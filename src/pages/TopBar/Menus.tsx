import Buttom from "../../component/Button/Button";
import Avatar from "../../component/Avatar/Avatar";
import {useNavigate} from "react-router-dom";
import {toLogin} from "../../router";
import {getInstance} from "../../sdk/Instance";
import Pop from "../../component/Pop/Pop";
import {useEffect, useState} from "react";

export default () => {
  const navigate = useNavigate()
  const instance = getInstance()
  const [userName,setUsername] = useState("")

  // 如果用户没有登录，跳转回登录界面
  useEffect(() => {
    instance.whoami().then(res => {
      if (!res) {
        toLogin(navigate)
        return
      }
      setUsername(res.name)
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
    <Avatar name={userName}></Avatar>
  </div>
}