import "./style.scss"
import Button from "../../component/Buttom/Buttom";

export default () => {
  return (
    <div className="login">
      <div className="display">
        {/*<img src="/login-display.png" alt="login-display"/>*/}
      </div>
      <div className="login-form-container">
        <div className="login-form">
          <form>
            <input type="text" placeholder="用户名"/>
            <input type="text" placeholder="密码"/>
          </form>
          <div className="login-button">
            <span>登录</span>
          </div>
        </div>
      </div>
    </div>

  )
}