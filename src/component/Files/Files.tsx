import "./style.scss"
import Buttom from "../Buttom/Buttom";
import {useState} from "react";

type Props = {
  id: string
  name: string
  size: number
  created: Date
  uploader: string
}
export default (props: { data: Props[] }) => {
  const [active] = useState(new Map<string,boolean>())
  return (
    <table className="file-table" cellSpacing={0}>
      <thead>
      <tr>
        <th>文件名称</th>
        <th>文件大小</th>
        <th>上传者</th>
        <th>上传时间</th>
      </tr>
      </thead>
      <tbody>
      {props.data.map((data) => {
        return (<tr key={data.id} className={active.get(data.id) ? "active" : ""}>
          <td>{data.name}</td>
          <td>{data.size}</td>
          <td>{data.uploader}</td>
          <td>{data.created.toLocaleDateString()}</td>
        </tr>)
      })}
      </tbody>
    </table>
  )
}

