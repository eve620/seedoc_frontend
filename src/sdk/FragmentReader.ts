export class FragmentReader implements UnderlyingSource<Uint8Array> {
  private reader: ReadableStreamDefaultReader<Uint8Array>
  private buff: ArrayBuffer;
  private view?: Uint8Array;
  private readonly fragment: number;
  private remind: number;

  private static defaultBufferSize = 1024*1024

  constructor(stream: ReadableStream<Uint8Array>, fragment: number, buffSize?: number) {
    this.reader = stream.getReader();
    this.buff = new ArrayBuffer(buffSize ? buffSize : FragmentReader.defaultBufferSize)
    this.fragment = fragment
    this.remind = fragment;
  }

  start = async (controller: ReadableStreamController<Uint8Array>) => {
    if (!this.view || this.view.length <= 0) {
      return
    }
    controller.enqueue(this.view)
  }
  pull = async (controller: ReadableStreamController<Uint8Array>) => {
    const readBuff = await this.reader.read()
    // 如果结束，关闭
    const read = !readBuff.value ? 0 : readBuff.value.length
    if (read == 0) {
      controller.close()
      return
    }
    this.remind -= read
    controller.enqueue(readBuff.value!.slice(0, this.remind))
    // 如果当前分段已经读完
    if (this.remind == 0) {
      this.view = undefined;
      controller.close();
    } else if (this.remind < 0) {
      this.view = new Uint8Array(this.buff).slice(0,-this.remind)
      this.view.set(readBuff.value!.slice(-this.remind))

    }
  }

  reset(): boolean {
    let res = this.remind <= 0
    this.remind = this.fragment;
    return res
  }
}