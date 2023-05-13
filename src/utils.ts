import {File} from "./component/Files/Files";

export function isValidFilename(file: string) {
  return file.length > 0 && !file.includes("/")
}

export function pathJoin(dir: string, file: string) {
  if (dir == "" || dir == null) {
    return file
  }
  return dir + "/" + file
}

export function getParentPath(path: string) {
  const raw = path.split("/")
  return raw.length <= 1 ? "" : raw.slice(0, -1).join("/")
}

export function deletePrefixSlash(str: string): string {
  return str.indexOf("/") == 0 ? str.substring(1) : str
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

export function getFileType(mimeType?: string): string {
  if (!mimeType) {
    return "未知"
  }
  if (mimeType.indexOf("image") == 0) {
    return "图片"
  }
  if (mimeType == "application/vnd.ms-powerpoint") {
    return "PPT"
  }
  if (mimeType == "dir") {
    return "文件夹"
  }
  return "文件"
}

export function canWrite(path: string, permission: string) {
  if (permission.slice(-1) == "/") {
    permission = permission.slice(0, -1)
  }
  return path.indexOf(permission) == 0
}

// 进行排序
export function orderByName(files: File[], desc?: boolean): File[] {
  return files.sort((a, b): number => {
    const res = a.name > b.name ? 1 : -1
    return desc ? res : -res;
  })
}

// 根据修改时间进行排序
export function orderByTime(files: File[], desc?: boolean): File[] {
  return files.sort((a, b): number => {
    const result = a.created < b.created ? 1 : -1
    console.log(a.created,b.created,result)
    return desc ? result : -result;
  })
}

// 根据类型进行排序
export function orderByType(files: File[]): File[] {
  return files.sort((a, b): number => {
    if (a.type == b.type) {
      return 0
    }
    // 如果是文件夹，则默认放到最签名
    return a.type == "dir" ? -1 : 1
  })
}

export function isBrowserSupport():boolean {
  const explorer = window.navigator.userAgent ;
  console.log(explorer);
  return explorer.indexOf("Chrome") >= 0 || explorer.includes("Safari");
}

export const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${formatInt(date.getMonth() + 1)}-${formatInt(date.getDate())} ${formatInt(date.getHours())}:${formatInt(date.getMinutes())}`
}

const formatInt = (num: number): string => {
  return ("0" + num).slice(-2)
}
