import {AuthedClient} from "./Auth";
import {CredentialUser, FileInfo, User} from "./Types";
import {pathJoin} from "../utils";
import {SimpleUploader} from "./SimpleUploader";

let instance: Instance

export function getInstance(host?: string) {
  if (!instance) {
    instance = new Instance(host)
  }
  return instance;
}

export class Instance {
  public static host = "/api"
  private client: AuthedClient;
  private readonly users = new Map<string, User>()
  private readonly host: string

  // 保留TOKEN：
  constructor(host?: string) {
    this.client = new AuthedClient(Instance.host)
    this.host = host ? host : Instance.host
  }

  // 通过 Etag 下载对象
  public async object(object: string): Promise<ReadableStream<Uint8Array>> {
    return this.client.fetch("/file/" + object).then(res => res.body) as Promise<ReadableStream<Uint8Array>>
  }


  // 创建文件夹
  public async createDir(path: string) {
    // const encodedPath = path.replace(/\[|\]/g, (match) => {
    //   return encodeURIComponent(match);
    // });
    return this.client.fetch("/meta/" + path, {
      method: "POST"
    })
  }

  // 删除对象
  public async objectDelete(path: string) {
    await this.client.fetch("/meta/" + path + "?delete=true", {
      method: "PUT"
    }).then(res => {
      if (res.status == 400) {
        return Promise.reject("permission denied")
      }
    })
  }

  public upload(dirKey: string, file: File): SimpleUploader {
    let path = pathJoin(dirKey, file.name)
    console.log(dirKey, file.name, path)
    return new SimpleUploader(this.client, file, path, file.type)
  }

  // 通过 Etag 获取下载地址
  public async objectUrl(object: string): Promise<string> {
    return Promise.resolve(`${this.host}/file/object/${object}`)
  }

  // 通过路径下载文件
  public async objectByPath(path: string): Promise<string> {
    return Promise.resolve(this.host + "/meta/" + path)
  }

  // 获取批量下载文件地址
  public async objectArchiveUrl(paths: string[]): Promise<string> {
    const query = new URLSearchParams();
    paths.forEach(path => query.append("path", path))
    return Promise.resolve(this.host + "/file/archive?" + query)
  }

  // 文件重命名
  public async rename(src: string, dst: string) {
    const param = new URLSearchParams();
    param.set("src", src)
    param.set("dst", dst)
    return this.client.fetch("/meta/rename?" + param, {
      method: "GET"
    })
  }

  // 列出文件
  public async list(path: string): Promise<FileInfo[]> {
    const queries = new URLSearchParams();
    queries.set("prefix", path)
    return this.client.fetch("/meta?" + queries).then(res => res.json()).then((res: any[]) => {
      res.forEach((v, k) => {
        res[k].created = new Date(v.created)
      })
      return res;
    })
  }

  // 登录
  public async login(username: string, password: string) {
    return this.client.login(username, password)
  }

  public async loginCas() {
    window.location.assign("/login/cas")
  }

  public async whoami(): Promise<User | undefined> {
    return this.client.whoami().then(res => {
      if (res) {
        this.users.set(res.id, res)
      }
      return res
    })
  }

  public async userList(userIds: string[]): Promise<Map<String, User>> {
    // TODO: 如果全部命中，则不进行查询，否则查询
    const query = new URLSearchParams()
    for (const id of userIds) {
      query.append("id", id)
    }
    return this.client.json("/user?" + query).then(async res => {
      const users: User[] = await res.json()
      this.updateUserCache(users)
      const result = new Map<String, User>()
      users.forEach(u => result.set(u.id, u))
      return result
    })
  }

  public async userListAll(): Promise<Map<String, User>> {
    return this.client.json("/user").then(async res => {
      const users: User[] = await res.json()
      this.updateUserCache(users)
      return this.users
    })
  }

  private updateUserCache = (users: User[]) => {
    for (const u of users) {
      this.users.set(u.id, u)
    }
  }

  public async user(userId: string): Promise<User> {
    let user = this.users.get(userId)
    if (user != undefined) {
      return Promise.resolve(user);
    }
    return this.client.fetch("/user/" + userId).then(async res => {
      const user: User = await res.json();
      this.updateUserCache([user])
      return user
    })
  }

  // 登出
  public async logout() {
    return this.client.logout()
  }

  // 添加用户
  public async userCreate(user: CredentialUser) {
    return this.client.json("/user", {
      method: "POST",
      body: JSON.stringify(user)
    })
  }

  // 删除用户
  public async userDelete(userId: string) {
    return await this.client.fetch("/user/delete/" + userId).then(() => this.users.delete(userId))
  }

  // 设置用户信息
  public async userSet(user: CredentialUser): Promise<void> {
    return this.client.json("/user/" + user.id, {
      method: "PUT",
      body: JSON.stringify(user)
    }).then(res => {
      // 判断状态码
      return
    })
  }

  // 重制用户密码
  public async userPasswordReset(password: string) {
    return this.client.json("/user", {
      method: "PUT",
      body: JSON.stringify({password})
    })
  }
}