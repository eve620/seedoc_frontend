export function isValidFilename(file: string) {
  return file.length > 0 && !file.includes("/")
}

export function pathJoin(dir: string, file: string) {
  if (dir == "" || dir == null) {
    return file
  }
  return dir + "/" + file
}

// 将毫秒转换为时间字符串
export function toFormatString(millisec: number): string {
  const date = new Date(millisec);
  return date.getFullYear() + "/" + (((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1)) + "/" + (((date.getDate() < 10) ? "0" : "") + date.getDate());
}

// 将字符串转化为毫秒
export function toMilliseconds(str: string): number {
  return new Date(str).getTime();
}

// 计算文件的单位
export function formatBytes(byteLen: number): string {
  if (!byteLen) {
    return ""
  }
  const units = ["B", "KB", "MB", "GB", "TB"]
  let index = 0
  while (index < units.length) {
    if (byteLen < 1024) {
      break;
    }
    byteLen = byteLen / 1024
    index++
  }
  return Math.ceil(byteLen * 100) / 100 + " " + units[index];
}

export function getFileType(mimeType: string): string {
  if (mimeType.indexOf("image") == 0) {
    return "图片"
  }
  if (mimeType == "dir") {
    return "文件夹"
  }
  return mimeType
}