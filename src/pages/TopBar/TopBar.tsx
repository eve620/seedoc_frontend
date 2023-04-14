import "./style.scss"
import "../../component/Button/Button"
import "./Menus"
import Menus from "./Menus";
import {useNavigate} from "react-router-dom";
import {toMain} from "../../router";

export default () => {
  const navigate = useNavigate();

  return (
    <div id="top-bar">
      <div className="app-container" id="top-bar-content">
        <div id="logo" onClick={() => toMain(navigate)}>
          <img src="/logo-on.png" height="30px" className="logo"></img>
          <span className="font-color-shadow"> | </span>
          <span className="font-content">本科教学文件管理系统</span>
        </div>
        <div className="flex-spacer"></div>
        <Menus/>
      </div>
    </div>
  )
}