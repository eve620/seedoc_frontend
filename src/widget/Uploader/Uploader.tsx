import React, {
    ChangeEvent,
    forwardRef,
    ReactNode,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import Pop from "../../component/Pop/Pop";
import {getInstance} from "../../sdk/Instance";
import {Modal, Progress} from "antd";
import Icon from "../../component/Icon/Icon";
import "./style.scss";
import {
    deletePrefixSlash,
    formatBytes,
    getEndPath,
    getParentPath,
    isValidFilename,
    pathJoin
} from "../../utils";

export type Handler = {
    active(path: string): void
}
export type Props = {
    onSuccess: () => void
}

export default forwardRef<Handler, Props>((props: Props, ref) => {
    const instance = getInstance()
    const [active, setActive] = useState(false);
    const [path, setPath] = useState("")
    const [uploadEnabled, setIsUploadEnabled] = useState(true)
    useImperativeHandle(ref, () => ({
        active(path: string) {
            setActive(true)
            setPath(path)
        }
    }))
    // 清理浏览器默认行为
    const inputArea = useRef<HTMLDivElement>(null)
    const [selected, setSelected] = useState(new Map<string, Entry>());
    const [progress, setProgress] = useState(0);
    const [maxFileSize, setMaxFileSize] = useState(500);
    useEffect(() => {
        instance.getMaxFileSize().then(res => {
            setMaxFileSize(Number(res))
        }).catch(err => {
            console.log(err)
        })
    }, [active])

    const onUpload = async () => {
        if (selected.size == 0) {
            return Pop({message: "至少上传一个文件"})
        }
        // 计算总共有多少个文件
        let totalFiles = 0
        for (const [_, entry] of selected) {
            totalFiles += entry.children.size
        }
        setIsUploadEnabled(false)
        let progress = 0;
        const successHandler = () => {
            progress++
            setProgress(Math.ceil(progress / totalFiles * 100))
        }
        try {
            for (const [_, entry] of selected) {
                for (const [key, value] of entry.children) {
                    const filePath = pathJoin(path, deletePrefixSlash(key))
                    // 如果是文件夹
                    if (!value) {
                        await instance.createDir(filePath).then(successHandler)
                        continue
                    }
                    // 如果是文件
                    await instance.upload(getParentPath(filePath), value!).do().then(successHandler)
                }
            }

            setSelected(new Map())
        } catch (err: any) {
            return Pop({message: err.message})
        }
        setActive(false)
        setIsUploadEnabled(true)
        props.onSuccess && props.onSuccess()
    }
    //拖动上传
    const onChange = (dataTransfer: DataTransferItemList) => {
        const promises = new Array<Promise<void>>()
        const entries = new Map<string, Entry>()
        let error = 0
        for (let i = 0; i < dataTransfer.length; i++) {
            const result = new Map<string, File | null>();
            const entry = dataTransfer[i].webkitGetAsEntry()!
            promises.push(readDirOrFiles(entry, result).then(() => {
                const entryInfo: Entry = {
                    children: result,
                    name: entry.name,
                    size: 0,
                    type: entry.isDirectory ? "dir" : "file"
                }
                result.forEach(file => entryInfo.size += file ? file.size : 0)
                if (entryInfo.size > maxFileSize * 1048576) {
                    Pop({message: "文件大于" + maxFileSize + "MB"})
                    return
                }
                entries.set(entry.fullPath, entryInfo)
            }))
        }
        Promise.all(promises).then(() => {
            let shouldSetSelected = true
            selected.forEach((value, key) => {
                if(entries.has(key)){
                    Pop({message:"该文件已上传"})
                    shouldSetSelected = false
                    return
                }
                entries.set(key, value)
            })
            if (shouldSetSelected) {
                setSelected(entries) // 根据标志变量决定是否执行该语句
            }
        })
    }
    useEffect(() => {
        console.log(selected)
    }, [selected])

    const onCancel = () => {
        setActive(false)
        setIsUploadEnabled(true)
        setSelected(new Map())
    }

    // 使用更加节约空间的方法
    const removeSelected = (key: string) => {
        selected.delete(key)
        const newMap = new Map<string, Entry>()
        selected.forEach((value, key1) => newMap.set(key, value))
        setSelected(newMap)
    }

    // 处理用户点击的文件上传
    const fileInput = useRef<HTMLInputElement>(null);

    const uploadFile = () => {
        if (fileInput.current) {
            fileInput.current.value = ''
            fileInput.current.click()
        }
    }
    const onFileInputChange = () => {
        const files = fileInput.current!.files!.length > 0 && fileInput.current!.files
        if (!files) {
            return
        }
        const entries = new Map<string, Entry>()
        selected.forEach((value, key) => entries.set(key, value))
        // for (let i = 0; i < files.length; i++) {
        //     const file = files[i];
        //     if (file.size > maxFileSize * 1048576) {
        //         Pop({message: "文件大于" + maxFileSize + "MB"})
        //         return
        //     }
        //     const result = new Map<string, File | null>();
        //     result.set(file.name, file)
        //     const entryInfo: Entry = {children: result, name: file.name, size: file.size, type: "file"}
        //     entries.set("/" + file.name, entryInfo)
        // }
        const file = files[0];
        if (file.size > maxFileSize * 1048576) {
            Pop({message: "文件大于" + maxFileSize + "MB"})
            return
        }
        const result = new Map<string, File>();
        result.set(file.name, file)
        if(entries.has("/" + file.name)){
            Pop({message:"该文件已上传"})
            return
        }
        const entryInfo: Entry = {children: result, name: file.name, size: file.size, type: "file"}
        entries.set("/" + file.name, entryInfo)
        setSelected(entries)
    }

    const result: ReactNode[] = []
    selected.forEach((value, key) => {
        result.push(<div key={key} className="upload-file-item">
            <span>{value.name}</span>
            <span>{formatBytes(value.size)}</span>
            <span>{value.type == "dir" ? "文件夹" : "文件"}</span>
            {uploadEnabled && <Icon icon={"close"} size={16} onClick={() => removeSelected(key)}></Icon>}
        </div>)
    })

    return (
        <Modal okText={"确定"} cancelText={"取消"} title="上传文件" width={"80vw"} open={active} onOk={onUpload}
               onCancel={onCancel}>
            {uploadEnabled && <div onClick={uploadFile}
                                   onDrop={preventDefaults((e) => onChange(e.dataTransfer.items))}
                                   onDragOver={preventDefaults()}
                                   className="drop-area"
                                   ref={inputArea}
            >
                <Icon size={32} icon={"upload"}></Icon>
                <p>点击上传文件或拖动文件夹到此区域上传，最大可上传{maxFileSize}MB的文件</p>
            </div>}
            {!uploadEnabled && <Progress strokeLinecap="butt" percent={progress}/>}
            <div className="upload-file-list">
                {result}
            </div>
            {/*文件夹上传*/}
            <input ref={fileInput} type="file" onChange={onFileInputChange} accept="" style={{display: "none"}}/>
        </Modal>
    )
})

function preventDefaults<T extends React.DragEvent>(callback?: (e: T) => void) {
    return (e: T) => {
        callback && callback(e)
        e.stopPropagation();
        e.preventDefault();
    }
}

async function readDirOrFiles(entry: FileSystemEntry, result: Map<string, File | null>): Promise<void> {
    const path = deletePrefixSlash(entry.fullPath)
    if (entry.isFile) {
        return new Promise(resolve => {
            (entry as FileSystemFileEntry).file(file => {
                result.set(path, file)
                resolve();
            })
        })
    }
    // 如果是文件夹，则进一步深入
    result.set(path, null)
    const reader = (entry as FileSystemDirectoryEntry).createReader()
    // 读取所有内容
    const promises = new Array<Promise<void>>()
    while (await recordEntry(reader, (entries) => {
        entries.forEach(entry => {
            if (entry.isFile) {
                promises.push(new Promise(resolve => {
                    (entry as FileSystemFileEntry).file(file => {
                        result.set(deletePrefixSlash(entry.fullPath), file)
                        resolve()
                    })
                }))
            }
            promises.push(readDirOrFiles(entry, result))
        })
    })) {
    }
    return Promise.all(promises).then()
}

function recordEntry(reader: FileSystemDirectoryReader, callback: FileSystemEntriesCallback): Promise<boolean> {
    return new Promise(resolve => {
        reader.readEntries(entries => {
            callback(entries)
            resolve(entries.length != 0)
        })
    })
}

// const testData = new Map<string, Entry>([
//   ["testDir", {
//     name: "一个测试文件夹但是他的名字非常非常的长以至于需要折叠",
//     type: "dir",
//     size: 1000,
//     children: new Map<String, File | null>()
//   }],
//   ["testFile", {name: "一个测试文件", type: "file", size: 1000, children: new Map<String, File | null>()}]
// ])

type Entry = {
    name: string,
    type: "file" | "dir",
    size: number,
    children: Map<string, File | null>;
}