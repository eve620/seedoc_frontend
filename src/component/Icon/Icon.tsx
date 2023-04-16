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
import Close from "./icons/close.svg"

export type Icon =
  "upload"
  | "download"
  | "trash"
  | "share"
  | "create"
  | "modify"
  | "empty"
  | "paste"
  | "cut"
  | "addUser"
  | "close"

const icons: Map<Icon, string> = new Map<Icon, string>([
  ["upload", Upload],
  ["download", Download],
  ["trash", Trash],
  ["share", Share],
  ["create", Create],
  ["cut", Cut],
  ["modify", Modify],
  ["empty", Empty],
  ["paste", Paste],
  ["addUser", AddUser],
  ["close", Close],
])
export default (props: { icon: Icon, size: number, onClick?: () => void }) => {
  return (
    <img onClick={() => props.onClick && props.onClick()} src={icons.get(props.icon)} alt={props.icon}
         style={{width: `${props.size}px`, height: `${props.size}px`}}/>
  )
}