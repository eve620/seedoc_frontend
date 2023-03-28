import "./style.scss"
import "../../component/Buttom/Buttom"
import "./Menus"
import Buttom from "../../component/Buttom/Buttom";
import Menus from "./Menus";

export default () => {

  return (
    <div id="top-bar">
      <div className="app-container" id="top-bar-content">
        <div id="logo">
          <img src="/logo-on.png" height="30px" className="logo"></img>
          <span className="font-color-shadow"> | </span>
          <span className="font-content">文件共享中心</span>
        </div>
        <div className="flex-spacer"></div>
        <Menus/>
      </div>
    </div>
  )
}