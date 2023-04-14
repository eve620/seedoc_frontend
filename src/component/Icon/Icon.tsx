import Upload from "./icons/upload.svg"
import Download from "./icons/download.svg"
import Trash from "./icons/trash.svg"
import Share from "./icons/share.svg"
import Create from "./icons/create.svg"
import Modify from "./icons/modify.svg"
import Empty from "./icons/empty.svg"
import Paste from "./icons/paste.svg"
import AddUser from "./icons/adduser.svg"
import Cut from "./icons/cut.svg"

export type Icon = "upload" | "download" | "trash" | "share" | "create" | "modify" | "empty" | "paste" | "cut" | "addUser"

const icons: Map<Icon, string> = new Map<Icon, string>()
icons.set("upload", Upload)
icons.set("download", Download)
icons.set("trash", Trash)
icons.set("share", Share)
icons.set("create", Create)
icons.set("cut", Cut)
icons.set("modify", Modify)
icons.set("empty", Empty)
icons.set("paste", Paste)
icons.set("addUser", AddUser)

export default (props: { icon: Icon, size: number }) => {
  return (
    <img src={icons.get(props.icon)} alt={props.icon} style={{width: `${props.size}px`, height: `${props.size}px`}}/>
  )
}