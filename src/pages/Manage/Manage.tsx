import {Modal, Select, Space, Table, Tag} from "antd"
import type {} from "antd"
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useRef, useState} from "react";
import {CredentialUser, User} from "../../sdk/Types";
import Button from "../../component/Button/Button";
import "./sytle.scss"
import Input, {Handler} from "../../component/Input/Input";
import {File} from "../../component/Files/Files";
import {getInstance} from "../../sdk/Instance";
import Pop from "../../component/Pop/Pop";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns = (deleteUser: (userId: string) => void, openUserForm: (title: UserFormType, defaultValue?: User) => void): ColumnsType<User> =>
  [
    {
      title: '工号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '权限',
      dataIndex: 'permission',
      key: 'permission',
      render: (text) => {
        return <code>{text}</code>
      }
    },
    {
      title: '角色',
      key: 'role',
      dataIndex: 'role',
      render: (_, {role}) => (
        <div>{role == "ADMIN" ? "管理员" : "用户"}</div>
      ),
    },
    {
      title: () => {
        return <div style={{paddingLeft: 12}}>操作</div>
      },
      key: 'action',
      render: (_, user) => (
        <div><Button onClick={() => openUserForm("编辑用户", user)} text={"修改"}></Button>
          <Button onClick={() => deleteUser(user.id)} text={"删除"}></Button></div>
      ),
    },
  ]

const roles = [
  {value: 'USER', label: '用户'},
  {value: 'ADMIN', label: '管理员'},
]

export default () => {
  // 创建用户
  const [isUserFormShow, setIsUserFormShow] = useState(false);
  const [userForm, setUserForm] = useState<UserForm>();
  const [userData, setUserData] = useState<User[]>();
  // 启动的时候加载用户信息
  const reload = () => {
    return getInstance().userListAll().then(res => {
      console.log(res)
      const users = new Array<User>();
      res.forEach(user => {
        users.push(user)
      })
      setUserData(users)
    })
  }
  useEffect(() => {
    reload().catch(err => Pop({message: "无法加载文件:" + err.message}))
  }, [])

  const openUserForm = (title: UserFormType, defaultValue?: User) => {
    if (!defaultValue) {
      defaultValue = {id: "", name: "", role: "USER", permission: ""}
    }
    setUserForm({title: title, password: "", ...defaultValue})
    setIsUserFormShow(true)
  }
  const userFormOk = async (): Promise<void> => {
    const instance = getInstance()
    const credentialUser = toCredentialUser(userForm!)

    if (userForm?.title == "编辑用户") {
      try {
        validateCredentialUser(credentialUser)
      } catch (err: any) {
        Pop({message: err.message})
      }
      return instance.userSet(credentialUser).then(res => {
        Pop({message: "修改成功"})
        reload()
      })
        .catch(err => {
          Pop({message: "修改失败:" + err.message})
        }).then(() => setIsUserFormShow(false))
    } else if (userForm!.title == "添加用户") {
      try {
        validateCredentialUser(credentialUser, true)
      } catch (err: any) {
        Pop({message: err.message})
      }
      return instance.userCreate(credentialUser).then(res => {
        Pop({message: "创建成功"})
        reload()
      })
        .catch(err => {
          Pop({message: "创建失败:" + err.message})
        })
        .then(() => setIsUserFormShow(false))
    } else {
      Pop({message: "错误的操作"})
    }
  }
  const userFormCancel = () => {
    setIsUserFormShow(false)
  }
  const userDelete = (userId: string) => {
    getInstance().userDelete(userId).then(res => {
      reload()
      return Pop({message: "删除成功"})
    }).catch(err => {
      return Pop({message: "删除失败" + err.message});
    })
  }

  // 修改最大文件大小
  const [isChangeFileSizeOpen, setIsChangeFileSizeOpen] = useState(false)
  const fileSizeInput = useRef<Handler>(null)
  const onChangeFileSize = () => {
    setIsChangeFileSizeOpen(true)
  }
  const onChangeFileSizeOk = () => {
    const filesize = fileSizeInput.current!.value()
    if(isNaN(Number(filesize)) || Number(filesize)<=0){
      return Pop({message: "输入错误"})
    }
    return getInstance().setMaxFileSize(filesize).then(res => {
      fileSizeInput.current!.reset()
      setIsChangeFileSizeOpen(false)
      return Pop({message: "修改成功"})
    }).catch(err => {
      return Pop({message: "修改失败" + err.message})
    })
  }

  const onChangeFileSizeCancel = () => {
    setIsChangeFileSizeOpen(false)
    fileSizeInput.current!.reset()
  }

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onChangeFileSizeOk();
    }
  }

  return <div className="app-container">
    <Modal  okText={"确定"} cancelText={"取消"} title={userForm?.title} open={isUserFormShow} onOk={userFormOk} onCancel={userFormCancel}>
      <form className="form">
        {userForm?.title == "添加用户" && <div><span>工号</span></div>}
        {userForm?.title == "添加用户" && <Input size={"small"} type={"text"} value={userForm?.id}
                                                 onChange={(id) => setUserForm({...userForm!, id})}/>}
        <div><span>用户名</span></div>
        <Input size={"small"} type={"text"} value={userForm?.name}
               onChange={(name) => setUserForm({...userForm!, name})}/>
        <div><span>密码</span></div>
        <Input size={"small"} type={"text"} value={userForm?.password}
               onChange={(password) => setUserForm({...userForm!, password})}/>
        <div><span>权限</span></div>
        <Input size={"small"} type={"text"} value={userForm?.permission}
               onChange={(permission) => setUserForm({...userForm!, permission})}/>
        <div><span>角色</span></div>
        <Select options={roles} onChange={(role) => setUserForm({...userForm!, role})} value={userForm?.role}></Select>
      </form>
    </Modal>
    <Modal okText={"确定"} cancelText={"取消"} title="最大上传文件" open={isChangeFileSizeOpen} onOk={onChangeFileSizeOk} onCancel={onChangeFileSizeCancel}>
      <div onKeyDown={handleEnter}>
        <Input size={"small"} type={"text"} placeHolder={"文件大小（MB）"} ref={fileSizeInput}/>
      </div>
    </Modal>
    <div className="menu-group">
      <Button onClick={() => openUserForm("添加用户")} icon={"addUser"} text={"添加用户"}></Button>
      <Button onClick={onChangeFileSize} icon={"modify"} text={"最大上传文件"}></Button>
    </div>
    <Table dataSource={userData} rowKey={"id"} columns={columns(userDelete, openUserForm)}></Table>
  </div>
}

const validateCredentialUser = (user: CredentialUser, password?: boolean) => {
  if (!user.name) {
    throw new Error("无效的用户名")
  }
  if (!user.role) {
    throw new Error("无效的用户权限")
  }
  if (password && (!user.password || user.password.length < 6)) {
    throw new Error("密码长度必须大于6")
  }
}
const toCredentialUser = (form: UserForm): CredentialUser => {
  return {id: form.id, name: form.name, password: form.password, permission: form.permission, role: form.role}
}
type UserFormType = "添加用户" | "编辑用户"

type UserForm = User & { title: UserFormType, password: string }