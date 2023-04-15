import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import Pop from "../../component/Pop/Pop";
import {getInstance} from "../../sdk/Instance";

type Handler = {
  active(path: string): void
}
type Props = {
  onSuccess: () => void
}
export default forwardRef<Handler,Props>((props: Props, ref) => {
  const [active, setActive] = useState(false);
  const [path, setPath] = useState("")
  useImperativeHandle(ref, () => ({
    active(path: string) {
      setActive(true)
      setPath(path)
    }
  }))

  // 文件上传
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadFile = () => {
    fileInput.current && fileInput.current.click()
  }
  const onUploadFileChange = () => {
    const input = fileInput.current!
    const file = input.files ? (input.files.length > 0 ? input.files[0] : undefined) : undefined
    if (!file) {
      return
    }
    getInstance().upload(path, file).do().then((res: string) => {
      return Pop({message: "上传成功"})
    }).catch(err => {
      return Pop({message: "上传失败:" + err})
    })
  }

  return (
    <div></div>
  )
})