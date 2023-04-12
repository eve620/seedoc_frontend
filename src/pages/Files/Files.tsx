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
import {canWrite, isValidFilename, pathJoin} from "../../utils";
import {toLogin} from "../../router";
import paths from "../../component/Paths/Paths";
import {types} from "sass";
import String = types.String;

export default () => {
  const instance = getInstance()
  const [paths, setPaths] = useState("")
  const [file, setFiles] = useState<FileProps[]>([])
  const fileList = useRef<FileHandler>(null);

  // 文件更新与内容展示
  const refreshDir = () => {
    instance.list(paths).then(res => {
      const files: FileProps[] = []
      const promises = new Array<Promise<any>>()
      res.forEach(file => {
        promises.push(instance.user(file.owner).then(res => {
          const file_ = fileInfoToFileProps(file)
          file_.uploader = res.name
          files.push(file_)
        }))
      })
      Promise.all(promises).then(() => setFiles(files))
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
    console.log(paths)
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
    getInstance().objectByPath(pathJoin(paths, file.name)).then(res => window.open(res))
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

  // 文件重命名
  const [isModifyDirNameActive, setIsModifyDirNameActive] = useState(false);
  const modifyDirName = useRef<InputHandler>(null);
  const onModifyClick = () => {
    const active = fileList.current!.active();
    if (!active || active.size != 1) {
      return Pop({message: "只能同时重命名一个文件"})
    }
    setIsModifyDirNameActive(true)
  }
  const onModifyOk = () => {
    const active = fileList.current!.active().values().next().value as FileProps;
    const newName = modifyDirName.current!.value()
    if (!isValidFilename(newName)) {
      return Pop({message: "无效的文件名"})
    }
    console.log(active, newName, paths)
    instance.rename(pathJoin(paths, active.name), pathJoin(paths, newName)).then(() => {
      setIsModifyDirNameActive(false)
      refreshDir()
      return Pop({message: "修改成功"})
    }).catch(err => Pop({message: err.message}))
  }
  const onModifyCancel = () => {
    modifyDirName.current!.reset()
    setIsModifyDirNameActive(false)
  }

  // 复制剪切
  const [register, setRegister] = useState<Register | undefined>(undefined)
  const onSetRegister = (type: Register['type']) => {
    setRegister({
      type: type,
      path: paths,
      active: fileList.current!.active()
    })
    fileList.current!.reset()
    return Pop({message: "操作成功"})
  }
  const onPaste = () => {
    if (!register) {
      return Pop({message: "请先复制/剪切文件"})
    }
    if (!register || register.type != "cut") {
      return Pop({message: "功能暂未实现"})
    }
    const promises = new Array<Promise<any>>()
    register.active.forEach((file) => {
      promises.push(instance.rename(pathJoin(register.path, file.name), pathJoin(paths, file.name)))
    })
    Promise.all(promises).then(res => {
      refreshDir()
      return Pop({message: "操作成功"})
    })
  }
  //按钮组控制
  const [isPasteShow, setIsPasteShow] = useState(false)
  const [isRenameShow, setIsRenameShow] = useState(false)
  const [isDownloadShow, setIsDownloadShow] = useState(false)
  const [isDeleteShow, setIsDeleteShow] = useState(false)
  const [isCutShow, setIsCutShow] = useState(false)
  const [isUploadShow, setIsUploadShow] = useState(false)
  const [isCreateDirShow, setIsCreateDirShow] = useState(false)
  const fileSelectedChange = (selected: Set<FileProps>) => {
    setIsPasteShow(register != undefined)
    setIsRenameShow(selected && selected.size == 1)
    setIsDownloadShow(selected && selected.size > 0)
    setIsDeleteShow(selected && selected.size > 0)
    setIsCutShow(selected && selected.size > 0)
    instance.whoami().then(res => {
      if (!res) {
        setIsUploadShow(false)
        setIsCreateDirShow(false)
        return
      }
      setIsUploadShow(canWrite(paths, res.permission))
      setIsCreateDirShow(canWrite(paths, res.permission))
    })
  }


  return (
    <div className="app-container">
      <Modal title="新建文件夹" open={isNewDirOpen} onOk={onCreateDirOk} onCancel={onCreateDirCancel}>
        <Input size={"small"} type={"text"} placeHolder={"文件夹名称"} ref={newDirName}/>
      </Modal>
      <Modal title="修改文件名" open={isModifyDirNameActive} onOk={onModifyOk} onCancel={onModifyCancel}>
        <Input size={"small"} type={"text"} placeHolder={"新文件名"} ref={modifyDirName}/>
      </Modal>
      <div className="file-container">
        <div className="file-menus">
          <Paths path={paths} onPathChange={setPaths}/>
          <div className="flex-spacer"></div>
          <div className="button-groups">
            <input onChange={onUploadFileChange} ref={fileInput} type="file" id="file-input" style={{display: "none"}}/>
            {isUploadShow && <Buttom text="上传" icon="upload" onClick={uploadFile}/>}
            {isDownloadShow && <Buttom text="下载" onClick={() => batchDownload()} icon="download"/>}
            {isDeleteShow && <Buttom text="删除" onClick={() => deleteObject()} icon="trash"/>}
            {isCreateDirShow && <Buttom text="新建" onClick={() => setIsNewDirOpen(true)} icon="create"/>}
            {isRenameShow && <Buttom text="重命名" onClick={() => onModifyClick()} icon="modify"/>}
            {isCutShow && <Buttom text="剪切" onClick={() => onSetRegister("cut")} icon={"cut"}/>}
            {isPasteShow && <Buttom text="粘贴" onClick={() => onPaste()} icon={"paste"}/>}
          </div>
        </div>
        <Files ref={fileList} onChange={fileSelectedChange} onDoubleClick={downloadOrOpen} data={file}/>
      </div>
    </div>
  )
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

type Register = {
  type: "copy" | "cut"
  path: string
  active: Set<FileProps>
}