import Files, {File, Handler as FileHandler} from "../../component/Files/Files"
import type {File as FileProps} from "../../component/Files/Files";
import Buttom from "../../component/Button/Button";
import {getInstance} from "../../sdk/Instance";
import Paths from "../../component/Paths/Paths";
import Pop from "../../component/Pop/Pop"
import React, {useEffect, useRef, useState} from "react";
import {FileInfo} from "../../sdk/Types";
// import {Error} from "../../sdk/Types"
import {Modal} from "antd";
import Input, {Handler as InputHandler} from "../../component/Input/Input";
import {isValidFilename, pathJoin} from "../../utils";
import {toLogin} from "../../router";
import paths from "../../component/Paths/Paths";

export default () => {
  const instance = getInstance()
  const [paths, setPaths] = useState("")
  const [file, setFiles] = useState<FileProps[]>([])
  const fileList = useRef<FileHandler>(null);

  // 文件更新与内容展示
  const refreshDir = () => {
    instance.list(paths).then(res => {
      const files: FileProps[] = []
      res.forEach(file => {
        files.push(fileInfoToFileProps(file))
      })
      setFiles(files)
    }).catch(error => console.error(error))
  }

  useEffect(() => {
    refreshDir()
  }, [paths])

  // 创建文件夹
  const [isNewDirOpen, setIsNewDirOpen] = useState(false)
  const newDirName = useRef<InputHandler>(null);
  const getInputValue = () => {
    if (newDirName.current == null) {
      throw Error("should be ready")
    }
    return newDirName.current.value()
  }
  const onCreateDirOk = async () => {
    const dirName = getInputValue()
    if (!isValidFilename(dirName)) {
      Pop({message: "文件夹名称不规范"})
      return
    }
    instance.createDir(pathJoin(paths, dirName)).then(() => {
      newDirName.current!.reset()
      refreshDir()
    }).catch(errHandler)
    setIsNewDirOpen(false)
  }
  const onCreateDirCancel = () => setIsNewDirOpen(false)

  // 文件上传
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadFile = () => {
    fileInput.current && fileInput.current.click()
  }
  const onUploadFileChange = () => {
    const input = fileInput.current!
    const file = input.files ? (input.files.length > 0 ? input.files[0] : undefined) : undefined
    if (!file) {
      return
    }
    instance.upload(paths, file).do().then((res: string) => {
      refreshDir()
      return Pop({message: "上传成功"})
    }).catch(err => {
      return Pop({message: "上传失败:" + err})
    })
  }

  // 文件下载
  const downloadOrOpen = (file: FileProps) => {
    // 大卡文件夹
    if (file.type == "dir") {
      const newPath = paths.length == 0 ? file.name : paths + "/" + file.name
      setPaths(newPath)
      return
    }
    // 否则下载文件
    getInstance().objectUrl(file.id).then(res => window.open(res))
  }
  const batchDownload = () => {
    const active = fileList.current!.active()
    // 排除所有文件夹
    active.forEach(value => {
      if (value.type == "dir") {
        return
      }
      instance.objectByPath(pathJoin(paths, value.name)).then((url) => {
        window.open(url)
      })
    })
  }

  // 文件删除
  const deleteObject = () => {
    const active = fileList.current!.active()
    // TODO: POP message to user
    const promises = new Array<Promise<void>>();
    active.forEach(value => {
      promises.push(getInstance().objectDelete(pathJoin(paths, value.name)))
    })
    Promise.all(promises).then(res => {
      refreshDir()
      return Pop({message: "删除成功"})
    }).catch(err => {
      return Pop({message: "删除失败:" + err.message})
    })
  }

  return (
    <div className="app-container">
      <Modal title="新建文件夹" open={isNewDirOpen} onOk={onCreateDirOk} onCancel={onCreateDirCancel}>
        <Input size={"small"} type={"text"} placeHolder={"文件夹名称"} ref={newDirName}/>
      </Modal>
      <div className="file-container">
        <div className="file-menus">
          <Paths path={paths} onPathChange={setPaths}/>
          <div className="flex-spacer"></div>
          <div className="button-groups">
            <input onChange={onUploadFileChange} ref={fileInput} type="file" id="file-input" style={{display: "none"}}/>
            <Buttom text="上传" icon="upload" onClick={uploadFile}/>
            <Buttom text="下载" onClick={() => batchDownload()} icon="download"/>
            <Buttom text="删除" onClick={() => deleteObject()} icon="trash"/>
            <Buttom text="新建" onClick={() => setIsNewDirOpen(true)} icon="create"/>
          </div>
        </div>
        <Files ref={fileList} onChange={fileSelectedChange} onDoubleClick={downloadOrOpen} data={file}/>
      </div>
    </div>
  )
}


const fileSelectedChange = (selected: Set<FileProps>) => {

}

const fileInfoToFileProps = (file: FileInfo): FileProps => {
  return {
    id: file.etag,
    name: file.name,
    size: file.size,
    type: file.contentType,
    created: new Date(),
    uploader: file.owner
  }
}

const errHandler = async (err: any) => {
  return Pop({message: err.error})
}