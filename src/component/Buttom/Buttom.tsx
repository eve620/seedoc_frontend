import "./style.scss"
import Icon from "../Icon/Icon"
import type {Icon as IconType} from "../Icon/Icon"

export default (props: { text: string, icon?: IconType }) => {
  return (
    <div className="button button-text">
      <div>
        {props.icon && <Icon size={16} icon={props.icon!}></Icon>}
        <span>{props.text}</span>
      </div>
    </div>
  )
}