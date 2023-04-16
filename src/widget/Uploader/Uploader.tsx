import React, {forwardRef, ReactNode, useEffect, useImperativeHandle, useRef, useState} from "react";
import Pop from "../../component/Pop/Pop";
import {getInstance} from "../../sdk/Instance";
import {Modal, Progress} from "antd";
import Icon from "../../component/Icon/Icon";
import "./style.scss";
import {Simulate} from "react-dom/test-utils";
import {formatBytes} from "../../utils";

export type Handler = {
  active(path: string): void
}
export type Props = {
  onSuccess: () => void
}

export default forwardRef<Handler, Props>((props: Props, ref) => {
  const [active, setActive] = useState(true);
  const [path, setPath] = useState("")
  const [uploadEnabled, setIsUploadEnabled] = useState(true)
  useImperativeHandle(ref, () => ({
    active(path: string) {
      setActive(true)
      setPath(path)
    }
  }))
  // 清理浏览器默认行为
  const inputArea = useRef<HTMLDivElement>(null)
  const fileInput = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState(new Map<string, Entry>([
    ["testDir", {name: "一个测试文件夹但是他的名字非常非常的长以至于需要折叠", type: "dir", size: 1000, children: new Map<String, File | null>()}],
    ["testFile", {name: "一个测试文件", type: "file", size: 1000, children: new Map<String, File | null>()}]
  ]));

  // 文件上传
  const uploadFile = () => {
    fileInput.current && fileInput.current.click()
  }
  const onUpload = () => {
    setIsUploadEnabled(false)
    // const input = fileInput.current!
    // const file = input.files ? (input.files.length > 0 ? input.files[0] : undefined) : undefined
    // if (!file) {
    //   return
    // }
    // getInstance().upload(path, file).do().then((res: string) => {
    //   return Pop({message: "上传成功"})
    // }).catch(err => {
    //   return Pop({message: "上传失败:" + err})
    // })
  }
  const onChange = (dataTransfer: DataTransferItemList) => {
    const promises = new Array<Promise<void>>()
    const entries = new Map<string, Entry>()
    for (let i = 0; i < dataTransfer.length; i++) {
      const result = new Map<string, File | null>();
      const entry = dataTransfer[i].webkitGetAsEntry()!
      promises.push(readDirOrFiles(entry, result).then(() => {
        const entryInfo: Entry = {children: result, name: entry.name, size: 0, type: entry.isDirectory ? "dir" : "file"}
        result.forEach(file => entryInfo.size += file ? file.size : 0)
        entries.set(entry.fullPath, entryInfo)
      }))
    }
    Promise.all(promises).then(() => {
      selected.forEach((value, key) => entries.set(key, value))
      setSelected(entries)
    })
  }
  useEffect(() => {
    console.log(selected)
  }, [selected])

  const onCancel = () => {
    setActive(false)
    setIsUploadEnabled(true)
  }

  const result: ReactNode[] = []
  selected.forEach((value, key) => {
    result.push(<div key={key} className="upload-file-item">
      <span>{value.name}</span>
      <span>{formatBytes(value.size)}</span>
      <span>{value.type == "dir" ? "文件夹" : "文件"}</span>
      <Icon icon={"close"} size={16}></Icon>
    </div>)
  })

  return (
    <Modal title="上传文件" width={"80vw"} open={active} onOk={onUpload} onCancel={onCancel}>
      {uploadEnabled && <div onClick={uploadFile}
                             onDrop={preventDefaults((e) => onChange(e.dataTransfer.items))}
                             onDragOver={preventDefaults()}
                             className="drop-area"
                             ref={inputArea}
      >
          <Icon size={32} icon={"upload"}></Icon>
          <p>点击或拖动文件到此区域以上传</p>
        {/* @ts-expect-error */}
          <input onChange={onChange} style={{display: "none"}} type={"file"} multiple ref={fileInput}/>
      </div>}
      {!uploadEnabled && <Progress strokeLinecap="butt" percent={75}/>}
      <div className="upload-file-list">
        {result}
      </div>
    </Modal>
  )
})

function preventDefaults<T extends React.DragEvent>(callback?: (e: T) => void) {
  return (e: T) => {
    callback && callback(e)
    e.stopPropagation();
    e.preventDefault();
  }
}

async function readDirOrFiles(entry: FileSystemEntry, result: Map<string, File | null>): Promise<void> {
  if (entry.isFile) {
    return new Promise(resolve => {
      (entry as FileSystemFileEntry).file(file => {
        result.set(entry.fullPath, file)
        resolve();
      })
    })
  }
  // 如果是文件夹，则进一步深入
  result.set(entry.fullPath, null)
  const reader = (entry as FileSystemDirectoryEntry).createReader()
  // 读取所有内容
  const promises = new Array<Promise<void>>()
  while (await recordEntry(reader, (entries) => {
    entries.forEach(entry => {
      if (entry.isFile) {
        promises.push(new Promise(resolve => {
          (entry as FileSystemFileEntry).file(file => {
            result.set(entry.fullPath, file)
            resolve()
          })
        }))
      }
      promises.push(readDirOrFiles(entry,result))
    })
  })) {
  }
  return Promise.all(promises).then()
}

function recordEntry(reader: FileSystemDirectoryReader, callback: FileSystemEntriesCallback): Promise<boolean> {
  return new Promise(resolve => {
    reader.readEntries(entries => {
      callback(entries)
      resolve(entries.length != 0)
    })
  })
}

type Entry = {
  name: string,
  type: "file" | "dir",
  size: number,
  children: Map<String, File | null>;
}