import {message} from "antd"

type Props = {
  message: string
}

export default async (props: Props) => {
  return message.info(props.message)
}
