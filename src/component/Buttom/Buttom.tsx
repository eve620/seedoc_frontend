import {ComponentProps, PropsWithChildren, ReactPropTypes} from "react";

export default (props: { text: string }) => {
  return (
    <div>
      {props.text}
    </div>
  )
}