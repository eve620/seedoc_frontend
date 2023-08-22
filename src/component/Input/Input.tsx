import "./style.scss"
import {useImperativeHandle, forwardRef, useRef, HTMLInputTypeAttribute} from "react";

export type Props = {
  size: "large" | "small"
  type: HTMLInputTypeAttribute
  value?: string
  placeHolder?: string
  onChange?: (text: string) => void
}

export type Handler = {
  value: () => string
  reset: () => void
}

export default forwardRef<Handler, Props>((props: Props, ref) => {
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({
    value(): string {
      return input.current ? input.current.value : ""
    },
    reset() {
      input.current && (input.current.value = "")
    }
  }));

  return <div className="input-container">
    <input value={props.value} type={props.type} className={props.size} placeholder={props.placeHolder} ref={input} onChange={(event) => props.onChange && props.onChange(event.target.value)}/>
  </div>
})
