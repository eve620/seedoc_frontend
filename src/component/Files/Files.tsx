import "./style.scss"
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {formatBytes, getFileType} from "../../utils";
import Icon from "../Icon/Icon"
import {Checkbox} from "antd";

export type Props = {
  data: File[],
  onClick?: (file: File) => void,
  onChange?: (active: Set<File>) => void
}

export type File = {
  id: string
  name: string
  size: number
  type: string
  created: Date
  uploader: string
}

export type Handler = {
  active: () => Set<File>
  reset:() => void
}


// 如果使用 onClick, 那么不会记录active
// 如果使用 onChange，那么不会调用click
export default forwardRef<Handler, Props>((props: Props, ref) => {
  const [active, setActive] = useState(new Set<File>())
  useImperativeHandle(ref, () => ({
    active: () => {
      return active;
    },
    reset
  }));
  const select = (data: File) => {
    // 选中和反选择
    if (active.has(data)) {
      active.delete(data)
    } else {
      active.add(data)
    }
    // TODO: 使用更加节约内存的方法
    setActive(new Set<File>(active))
    props.onChange && props.onChange(active)
  }
  const reset = () => {
    const active = new Set<File>()
    setActive(active)
    props.onChange&& props.onChange(active);
  }
  useEffect(() => {
    reset()
  },[props.data])

  const onClick = (data: File) => {
    props.onClick && props.onClick(data)
  }
  return (
    <>
      <table className="file-table" cellSpacing={0}>
        <thead>
        <tr>
          <th></th>
          <th>文件名称</th>
          <th>文件大小</th>
          <th>文件类型</th>
          <th>上传者</th>
          <th>上传时间</th>
        </tr>
        </thead>
        <tbody>
        {props.data.map((data) => {
          return (<tr
            key={data.name}
            className={isActive(active, data.name) ? "active" : ""}>
            <td><Checkbox onClick={()=> select(data)}/></td>
            <td onClick={() => onClick(data)}>{data.name}</td>
            <td>{formatBytes(data.size)}</td>
            <td>{getFileType(data.type)}</td>
            <td>{data.uploader}</td>
            <td>{data.created.toLocaleDateString()}</td>
          </tr>)
        })}
        </tbody>
      </table>
      {props.data.length == 0 &&
          <div className="empty">
              <div>
                  <Icon size={96} icon={"empty"}/>
                  <span>什么都没有呢</span>
              </div>
          </div>
      }
    </>
  )
})

const isActive = (active: Set<File>, name: string): boolean => {
  for (let i of active) {
    if (i.name == name) {
      return true
    }
  }
  return false
}