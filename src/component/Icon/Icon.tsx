import Upload from "./icons/upload.svg"
import Download from "./icons/download.svg"
import Trash from "./icons/trash.svg"
import Share from "./icons/share.svg"


export type Icon = "upload" | "download" | "trash" | "share"

const icons: Map<Icon, string> = new Map<Icon, string>()
icons.set("upload", Upload)
icons.set("download", Download)
icons.set("trash", Trash)
icons.set("share", Share)

export default (props: { icon: Icon, size: number }) => {
  return (
    <img src={icons.get(props.icon)} alt={props.icon} sizes={props.size + "px"}/>
  )
}