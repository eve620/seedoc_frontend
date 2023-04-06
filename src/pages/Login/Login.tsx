import "./style.scss"
import Buttom from "../../component/Buttom/Buttom";

export default () => {
  return (
    <div className="login">
      <div className="display">
        <img src="/login-display.png" alt="login-display"/>
      </div>
      <div className="login-form">
        <form>
          <span>用户名</span>
          <input type="text"/>
          <span>密码</span>
          <input type="text"/>
        </form>
        <div>
          <Buttom text="登录"/>
        </div>
      </div>
    </div>

  )
}