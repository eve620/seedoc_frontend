// AuthedClient 已经认证过的连接器，可以用来发送各种请求
import {Error, User} from "./Types";

export class AuthedClient {
  private user?: User;
  private readonly host: string;

  // constructor(host: string)
  constructor(host: string) {
    this.host = host;
  }

  public async login(username: string, password: string) {
    // if already login, skip
    if (this.user) {
      return
    }
    const res = await this.json("/user/login", {
      method: "POST",
      body: JSON.stringify({
        name: username,
        password: password
      })
    }).then(() => this.whoami())
  }

  public async whoami(): Promise<User | undefined> {
    if (this.user) {
      return Promise.resolve(this.user)
    }
    return this.fetch("/user/whoami").then(async res => {
      this.user = await res.json() as User
      return this.user
    }).catch(err => {
      return undefined
    })
  }

  public async logout() {
    window.location.replace("/api/user/logout")
  }

  public json(info: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    let header = init?.headers;
    if (!header) {
      header = new Headers()
    }
    (header as Headers).set("Content-Type", "application/json")
    return this.fetch(info, {
      ...init,
      headers: header,
    })
  }

  public fetch(info: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    let header = init?.headers;
    if (!header) {
      header = new Headers()
    }
    return fetch(this.host + info, {headers: header, credentials: "include", ...init}).then(async res => {
      if (res.status != 200) {
        const err: Error = await res.json();
        return Promise.reject(err)
      }
      return res
    })
  }
}