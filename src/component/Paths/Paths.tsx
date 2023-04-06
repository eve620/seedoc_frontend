import Buttom from "../Buttom/Buttom";
import "./style.scss"

type  Pros = {
  path: string
  onPathChange: (path: string) => void
}

export default (props: Pros) => {
  const {path, onPathChange} = props
  const paths = path.split("/")
  const elems = []
  elems.push(<Buttom key={"-1"} text={"/"} onClick={() => onPathChange("")}/>)
  for (let i = 0; i < paths.length; i++) {
    const path = paths.slice(0, i + 1).join("/")
    elems.push(<Buttom key={i * 2} text={paths[i]} onClick={() => onPathChange(path)}></Buttom>)
    if (i + 1 != paths.length) {
      elems.push(<span key={i * 2 + 1}>/</span>)
    }
  }
  return <div className="paths">{elems}</div>
}