import Buttom from "../../component/Button/Button";
import Avatar from "../../component/Avatar/Avatar";
import {useNavigate} from "react-router-dom";
import {toLogin, toManage} from "../../router";
import {getInstance} from "../../sdk/Instance";
import Pop from "../../component/Pop/Pop";
import React, {useEffect, useRef, useState} from "react";
import {Modal} from "antd";
import Input, {Handler} from "../../component/Input/Input";

export default () => {
  const navigate = useNavigate()
  const instance = getInstance()
  const [userName, setUsername] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  // 如果用户没有登录，跳转回登录界面
  useEffect(() => {
    instance.whoami().then(res => {
      if (!res) {
        toLogin(navigate)
        return
      }
      setUsername(res.name)
      setIsAdmin(res.role == "ADMIN")
    }).catch(err => {
      toLogin(navigate)
      return Pop({message: err.message})
    })
  })
  const onLogout = () => {
    instance.logout().then(res => {
      toLogin(navigate)
    }).catch(err => {
      return Pop({message: "退出错误：" + err})
    })
  }
  // 修改用户密码
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const passwordInput = useRef<Handler>(null)
  const onChangePassword = () => {
    setIsChangePasswordOpen(true)
  }
  const onChangePasswordOk = () => {
    const password = passwordInput.current!.value()
    return getInstance().userPasswordReset(password).then(res => {
      passwordInput.current!.reset()
      setIsChangePasswordOpen(false)
      return Pop({message: "修改成功"})
    }).catch(err => {
      return Pop({message: "修改失败" + err.message})
    })
  }

  const onChangePasswordCancel = () => {
    setIsChangePasswordOpen(false)
    passwordInput.current!.reset()
  }

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onChangePasswordOk();
    }
  }

  return <div id="top-bar-menus">
    <Modal okText={"确定"} cancelText={"取消"} title="修改密码" open={isChangePasswordOpen} onOk={onChangePasswordOk} onCancel={onChangePasswordCancel}>
      <div onKeyDown={handleEnter}>
        <Input size={"small"} type={"text"} placeHolder={"新密码"} ref={passwordInput}/>
      </div>
    </Modal>
    {isAdmin && <Buttom onClick={() => toManage(navigate)} text="管理"/>}
    <Buttom onClick={onChangePassword} text="修改密码"/>
    <Buttom onClick={onLogout} text="退出"/>
    <Avatar name={userName}></Avatar>
  </div>
}