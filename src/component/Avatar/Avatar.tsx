import {Simulate} from "react-dom/test-utils";
import "./style.scss"

const defaultAvatar = "/avatar.jpg"
const getAvatar = (avatar?: string) => {
  if (avatar != undefined && avatar.length == 0) {
    return avatar
  }
  return defaultAvatar
}

export default (props: { name: string, avatar?: string }) => {
  return (
    <div className="avatar">
      <div>{props.name}</div>
      <img src={getAvatar(props.avatar)} alt={props.name}/>
    </div>
  )
}