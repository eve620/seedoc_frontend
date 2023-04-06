import "./style.scss"
import {useState} from "react";

export type Props = {
  id: string
  name: string
  size: number
  type: string
  created: Date
  uploader: string
}
// 如果使用 onClick, 那么不会记录active
// 如果使用 onChange，那么不会调用click
export default (props: { data: Props[], onDoubleClick?: (file: Props) => void, onChange?:(active:Set<Props>) => void}) => {
  const [active] = useState(new Set<Props>())
  return (
    <table className="file-table" cellSpacing={0}>
      <thead>
      <tr>
        <th>文件名称</th>
        <th>文件大小</th>
        <th>文件类型</th>
        <th>上传者</th>
        <th>上传时间</th>
      </tr>
      </thead>
      <tbody>
      {props.data.map((data) => {
        return (<tr onClick={() => {
          if (props.onDoubleClick) {
            props.onDoubleClick(data)
          }
          // 选择激活/反选
          if (active.has(data)) {
            active.delete(data)
          } else {
            active.add(data)
          }
          // 触发更新
          props.onChange && props.onChange(active);
        }
        } key={data.id} className={isActive(active,data.id) ? "active" : ""}>
          <td>{data.name}</td>
          <td>{data.size}</td>
          <td>{data.type}</td>
          <td>{data.uploader}</td>
          <td>{data.created.toLocaleDateString()}</td>
        </tr>)
      })}
      </tbody>
    </table>
  )
}

const isActive = (active :Set<Props>, id: string):boolean => {
  console.log(active,id)
  for (let i of active) {
    if (i.id == id) {
      return true
    }
  }
  return false
}