import {FragmentReader} from "./FragmentReader"
import {AuthedClient} from "./Auth";

// 用来上传文件
export class Uploader {
  public static uploadPieceUrl = ""
  public static completeUrl = ""

  private client: AuthedClient
  private readonly contentType;
  private reader?: FragmentReader;
  private steam?: ReadableStream;
  private uploadId: string = "";
  private piece: number = 0;
  private readonly pathKey: string;

  private readonly simple: boolean;

  private static defaultPartSize = 10 * 1024 * 1024

  constructor(client: AuthedClient, simple: boolean, stream: ReadableStream, pathKey: string, contentType: string, buffSize?: number) {
    this.client = client
    this.pathKey = pathKey
    this.contentType = contentType
    this.simple = simple
    if (simple) {
      this.steam = stream;
    } else {
      this.reader = new FragmentReader(stream, Uploader.defaultPartSize, buffSize)
    }
  }

  public async do() {
    this.uploadId = await this.create(this.pathKey);
    if (!this.simple) {
      do {
        await this.uploadPart(new ReadableStream(this.reader))
      } while (this.reader!.reset())
    } else {
      await this.uploadPart(this.steam!)
    }
    return await this.finish()
  }

  // create uploadId
  private async create(pathKey: string): Promise<string> {
    const res = await this.client.fetch("/meta/" + pathKey, {
      method: "PUT",
      headers: {
        "Content-Type": this.contentType
      }
    })
    return res.text()
  }

  // upload piece
  private async uploadPart(stream: ReadableStream) {
    const queries = new URLSearchParams()
    queries.set("part", this.piece.toString())
    return this.client.fetch(`/file/${this.uploadId}?${queries}`, {
      // @ts-ignore
      duplex: "half",
      method: "PUT",
      body: stream,
    }).then(() => this.piece++)
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