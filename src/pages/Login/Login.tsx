import "./style.scss"
import Input from "../../component/Input/Input";
import {toMain} from "../../router";
import {Handler as InputHandler} from "../../component/Input/Input"
import {NavigateFunction, useNavigate} from "react-router-dom";
import {getInstance} from "../../sdk/Instance";
import {useEffect, useRef} from "react";
import Pop from "../../component/Pop/Pop";

export default () => {
  const navigate = useNavigate()
  const instance = getInstance()
  const username = useRef<InputHandler>(null)
  const password = useRef<InputHandler>(null)
  useEffect(() => {
    instance.whoami().then(res => {
      if (res) {
        toMain(navigate)
      }
    })
  },[])
  const onLogin = () => {
    const uname = username.current ? username.current.value() : undefined
    const pwd = password.current ? password.current.value() : undefined
    if (!uname || uname.length == 0 || !pwd || pwd.length == 0) {
      return Pop({message: "无效的用户名密码"})
    }
    instance.login(uname, pwd).then(res => {
      return instance.whoami().then((uid) => {
        toMain(navigate)
      })
    }).catch(err => Pop({message: err.message}))
  }
  return (
    <div className="login">
      <div className="display">
        <div>
          <h1>本科教学文件管理系统</h1>
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
            <Input ref={username} size={"large"} placeHolder={"用户名"} type={"text"}/>
            <Input ref={password} size={"large"} placeHolder={"密码"} type={"password"}/>
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