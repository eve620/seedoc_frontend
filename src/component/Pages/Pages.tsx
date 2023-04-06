import "./style.scss"

type Props = {
  total: number
  show?: number
}

export default (props:Props) => {
  const show= props.show ? props.show : 10
  const total = props.total
  const items = []
  for (let i = 1; i<= show; i++) {
    items.push(<div key={i}>{i}</div>)
  }
  return (
    <div className="pages">
      {items}
    </div>
  )
}