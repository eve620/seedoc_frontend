import "./style.scss"
import Icon from "../Icon/Icon"
import type {Icon as IconType} from "../Icon/Icon"

type Props = {
  text: string
  icon?: IconType
  onClick?: () => void
}

export default (props: Props) => {
  return (
    <div onClick={() => props.onClick && props.onClick()} className="button button-text">
      <div>
        {props.icon && <Icon size={16} icon={props.icon!}></Icon>}
        <span>{props.text}</span>
      </div>
    </div>
  )
}