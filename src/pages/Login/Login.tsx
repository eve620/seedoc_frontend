import "./style.scss"
import Input from "../../component/Input/Input";
import {toMain} from "../../router";

export default () => {
  const onLogin = () => {
    toMain()
    console.log("hi")
  }
  return (
    <div className="login">
      <div className="display">
        <div>
          <h1>年度审核资料管理系统</h1>
          <h2>西安电子科技大学</h2>
          <div>
            <li>安全</li>
            <li>可靠</li>
            <li>方便</li>
          </div>
        </div>
      </div>
      <div className="login-form-container">
        <div className="login-form">
          <div className="title">登录</div>
          <form>
            <Input size={"large"} placeHolder={"用户名"} type={"text"}/>
            <Input size={"large"} placeHolder={"密码"} type={"password"}/>
          </form>
          <div className="login-button-container">
            <div onClick={onLogin} className="login-button">
              <span>登录</span>
            </div>
            <div className="login-button">
              <span>统一认证登录</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}