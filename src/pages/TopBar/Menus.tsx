import Buttom from "../../component/Button/Button";
import Avatar from "../../component/Avatar/Avatar";
import {useNavigate} from "react-router-dom";
import {toLogin} from "../../router";
import {getInstance} from "../../sdk/Instance";
import Pop from "../../component/Pop/Pop";
import {useEffect} from "react";

export default () => {
  const navigate = useNavigate()
  const instance = getInstance()

  // 如果用户没有登录，跳转回登录界面
  useEffect(() => {
    instance.whoami().then(res => {
      console.log(res)
      if (!res) {
        toLogin(navigate)
        return
      }
    }).catch(err => {
      toLogin(navigate)
      return Pop({message:err.message})
    })
  })
  const onLogout = () => {
    instance.logout().then(res => {
      toLogin(navigate)
    }).catch(err => {
      return Pop({message: "退出错误：" + err})
    })
  }
  return <div id="top-bar-menus">
    <Buttom onClick={onLogout} text="退出"/>
    <Avatar name="肖鹏飞"></Avatar>
  </div>
}