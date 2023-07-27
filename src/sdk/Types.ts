export class FileInfo {
  public name: string;
  public size: number;
  public contentType: string;
  public owner: string;
  public created: Date;
  public lastModified: Date;
  public etag: string;
  public uploadId?: string;

  constructor(name: string, size: number, contentType: string, owner: string, created: Date, lastModified: Date, etag: string, uploadId: string) {
    this.name = name;
    this.size = size;
    this.contentType = contentType;
    this.owner = owner;
    this.created = created;
    this.lastModified = lastModified;
    this.etag = etag;
    this.uploadId = uploadId;
  }
}

export type UserRole = "admin" | "user"

export type GroupInfo = {
  name: string,
  context: string
}

export class Context {

  private paths: Set<string>

  public constructor(context: string) {
    this.paths = new Set(context.split("|"))
  }

  public append(path: string) {
    this.paths.add(path)
  }

  public toString() {
  }
}

export type Error = {
  error: string
}

export type User = {
  id: string
  name: string
  role: "ADMIN" | "USER"
  permission: string
}
export type CredentialUser  = User & {password: string}