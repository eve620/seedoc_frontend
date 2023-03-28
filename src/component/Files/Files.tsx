import "./style.scss"
import Buttom from "../Buttom/Buttom";

export default () => {
  return (
    <div className="file-container">
      <div className="file-menus">
        <div className="paths">
          <Buttom text="home"></Buttom>
          <span>/</span>
          <Buttom text="root"></Buttom>
          <span>/</span>
          <Buttom text="其他"></Buttom>
        </div>
        <div className="flex-spacer"></div>
        <div className="button-groups">
          <Buttom text="上传" icon="upload"/>
          <Buttom text="下载" icon="download"/>
          <Buttom text="删除" icon="trash"/>
          <Buttom text="分享" icon="share"/>
        </div>
      </div>
    </div>
  )
}