import "./style.scss"
import {toMain} from "../../router";
import Input, {Handler as InputHandler} from "../../component/Input/Input"
import {NavigateFunction, useNavigate} from "react-router-dom";
import {getInstance} from "../../sdk/Instance";
import {useEffect, useRef, useState} from "react";
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
  }, [])
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
    }).catch(err => Pop({message: "用户名或密码错误"}))
  }

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onLogin();
    }
  }
  const onLoginCas = () => {
    return getInstance().loginCas()
  }
  // True: useAccount, False: useCAS
  const [useAccountOrCAS, setUseAccountOrCAS] = useState(false);

  return (
    <div className={"container"}>
      <div className={"login-header"}>
        <img className={"login-logo"} src={"/logo_white.png"} alt={"校徽"}/>
        <span>本科教学文件管理系统</span>
      </div>
      <div className="login-container">

        <div className="login-display">
          <img src="/login-display.webp" alt="校园图片" className="login-display-img"/>
        </div>
        <div className="login-form">
          <div>
            {useAccountOrCAS && <div id={"account"}>
                <h2 className={"form-header"}>用户登录</h2>
                <div className={"form-container"}>
                  <div onKeyDown={handleEnter}>
                    <Input ref={username} size={"large"} placeHolder={"用户名"} type={"text"}></Input>
                  </div>
                  <div onKeyDown={handleEnter}>
                    <Input ref={password} size={"large"} placeHolder={"密码"} type={"password"}></Input>
                  </div>
                </div>
                <div onClick={onLogin} className={"confirm"}><span>登录</span></div>
            </div>}
            {!useAccountOrCAS && <div id={"cas"}>
                <h2 className={"form-header"}>统一认证登录</h2>
                <div className={"form-container cas"}>
                    <div style={{cursor: "pointer"}} onClick={onLoginCas}>前往统一认证服务</div>
                </div>
            </div>}

            <div className={"other"}>
              <div className={"spacer"}></div>
              <div className={"other-text"}><span>或者使用</span></div>
              <div className={"spacer"}/>
            </div>
            {!useAccountOrCAS && <div onClick={()=>setUseAccountOrCAS(true)} className={"login-option"}><img src={"/user.svg"} alt={"cas-logo"}/>账号密码登录</div>}
            {useAccountOrCAS && <div onClick={() =>setUseAccountOrCAS(false)} className={"login-option"}><img src={"/old.ico"} alt={"cas-logo"}/>统一认证登录</div>}
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>开发维护：西安电子科技大学电子工程学院</p>
      </div>
    </div>
  )
}