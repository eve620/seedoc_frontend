import "./style.scss"
import {useImperativeHandle, forwardRef, useState, useRef} from "react";

export type Props = {
  onChange?: (text: string) => void
}

export type Handler = {
  value: () => string
  reset: () => void
}

const APP = forwardRef<Handler, Props>((props: Props, ref) => {
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
    <input type="text" ref={input} onChange={(event) => props.onChange && props.onChange(event.target.value)}/>
  </div>
})

export default APP;