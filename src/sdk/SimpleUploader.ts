import {AuthedClient} from "./Auth";
import {pathJoin} from "../utils";

// 一口气上传文件，不进行分片操作
export class SimpleUploader {
  public static uploadPieceUrl = ""
  public static completeUrl = ""
  private client: AuthedClient
  private readonly contentType;
  private uploadId: string = "";
  private readonly pathKey: string;
  private readonly file: File;

  constructor(client: AuthedClient, file: File, pathKey: string, contentType: string) {
    this.client = client
    this.pathKey = pathKey
    this.contentType = contentType
    this.file = file
  }

  // public upload(dirKey: string, file: File): SimpleUploader {
  //   let path = pathJoin(dirKey, file.name)
  //   console.log(dirKey, file.name, path)
  //   return new SimpleUploader(this.client, file, path, file.type)
  // }

  public async do() {
    this.uploadId = await this.create(this.pathKey);
    await this.upload(this.file)
    return await this.finish()
  }

  // create uploadId
  private async create(pathKey: string): Promise<string> {
    const res = await this.client.fetch("/meta/" + encodeURI(pathKey), {
      method: "PUT",
      headers: {
        "Content-Type": this.contentType
      }
    })
    return res.text()
  }

  // upload piece
  private async upload(stream: File) {
    const queries = new URLSearchParams()
    queries.set("part", "0")
    return this.client.fetch(`/file/${this.uploadId}?${queries}`, {
      method: "PUT",
      body: this.file,
    })
  }

  // finish upload
  private async finish(): Promise<string> {
    return this.client.fetch(`/meta/${this.uploadId}/complete`, {
      method: "PUT"
    }).then(res => {
      return res.text()
    })
  }
}