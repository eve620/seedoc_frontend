import "./style.scss"
export default () => {
  return (
    <div className="file-container">
      <div className="input-container">
        <span>文件路径</span>
        <input type="search" alt="path" id="path" autoComplete="false"/>
      </div>
    </div>
  )
}