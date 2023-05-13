import "./style.scss"
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {formatBytes, formatDate, getFileType, orderByName, orderByTime, orderByType} from "../../utils";
import Icon from "../Icon/Icon"
import {Checkbox} from "antd";

export type Props = {
  data: File[],
  orderBy?: "name" | "name-reverse" | "type" | "created" | "created-reverse"
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
  reset: () => void
}


// 如果使用 onClick, 那么不会记录active
// 如果使用 onChange，那么不会调用click
export default forwardRef<Handler, Props>((props: Props, ref) => {
  const [active, setActive] = useState(new Set<File>())
  const [data, setData] = useState(props.data)
  const [order, setOrder] = useState<Props["orderBy"]>("created");
  useImperativeHandle(ref, () => ({
    active: () => {
      return active;
    },
    reset
  }));
  const reorder = () => {
    let data: File[] = props.data
    switch (order) {
      case "name":
        data = orderByName([...props.data])
        break
      case "name-reverse":
        data = orderByName([...props.data], true)
        break
      case "created-reverse":
        data = orderByTime([...props.data], true)
        break
      case "type":
        data = orderByType([...props.data])
    }
    setData(data)
    console.log("reoder finished", data, props.data, order)
  }
  useEffect(reorder, [order, props.data])
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
    props.onChange && props.onChange(active);
  }
  useEffect(() => {
    reset()
  }, [props.data])

  const onClick = (data: File) => {
    props.onClick && props.onClick(data)
  }
  return (
    <>
      <table className="file-table" cellSpacing={0}>
        <thead>
        <tr>
          <th></th>
          <th className="sortable"
              onClick={() => setOrder(order == "name" ? "name-reverse" : "name")}>
            <span className={order == "name" ? "asc" : (order == "name-reverse" ? "desc" : undefined)}>文件名称</span>
          </th>
          <th>文件大小</th>
          <th  className="sortable" onClick={() => setOrder("type")}>
            <span className={order == "type" ? "asc" : undefined}>文件类型</span>
          </th>
          <th>上传者</th>
          <th className="sortable" onClick={() => setOrder(order == "created" ? "created-reverse" : "created")}>
            <span className={order == "created" ? "asc" : (order == "created-reverse" ? "desc" : undefined)}>上传时间</span>
          </th>
        </tr>
        </thead>
        <tbody>
        {data.map((data) => {
          return (<tr
            key={data.name}
            className={(isActive(active, data.name)? "active " : "") + (data.type == "dir" ? "clickable" : "")}>
            <td><Checkbox onClick={() => select(data)}/></td>
            <td onClick={() => onClick(data)}>{data.name}</td>
            <td>{formatBytes(data.size)}</td>
            <td>{getFileType(data.type)}</td>
            <td>{data.uploader}</td>
            <td>{formatDate(data.created)}</td>
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