import Files, {Props} from "../../component/Files/Files"
import type {Props as FileProps} from "../../component/Files/Files";
import Buttom from "../../component/Buttom/Buttom";
import {getInstance} from "../../sdk/Instance";
import Paths from "../../component/Paths/Paths";
import {useEffect, useState} from "react";
import {FileInfo} from "../../sdk/Types";

export default () => {
  const instance = getInstance()
  const [paths, setPaths] = useState("测试目录/文件夹1")
  const [file, setFiles] = useState<FileProps[]>([])

  useEffect(() => {
    const input = document.getElementById("file-input") as HTMLInputElement
    input!.onchange = (() => {
      const file = input.files ? input.files[0] : null
      if (!file) {
        return
      }
      instance.upload(paths, file).do().then((res: string ) => console.log(res))
    })
    instance.login("admin","admin")
  })

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

  useEffect(() => {
    instance.list(paths).then(res => {
      const files: FileProps[] = []
      res.forEach(file => {
        files.push(fileInfoToFileProps(file))
      })
      setFiles(files)
    }).catch(error => console.error(error))
  }, [paths])

  return (
    <div className="app-container">
      <div className="file-container">
        <div className="file-menus">
          <Paths path={paths} onPathChange={setPaths}/>
          <div className="flex-spacer"></div>
          <div className="button-groups">
            <input type="file" id="file-input" style={{display: "none"}}/>
            <Buttom text="上传" icon="upload" onClick={uploadFile}/>
            <Buttom text="下载" icon="download"/>
            <Buttom text="删除" onClick={() => deleteFile("")} icon="trash"/>
            <Buttom text="新建" icon="share"/>
          </div>
        </div>
        <Files onChange={fileSelectedChange} onDoubleClick={downloadOrOpen} data={file}/>
      </div>
    </div>
  )
}

const deleteFile = (key: string) => {
  // TODO: POP message to user
  getInstance().objectDelete(key)
}

const fileSelectedChange = (selected: Set<FileProps>) => {
  console.log(selected)
}


const uploadFile = () => {
  document.getElementById("file-input")?.click();
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