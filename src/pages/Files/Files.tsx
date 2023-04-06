import Files from "../../component/Files/Files"
import Pages from "../../component/Pages/Pages";
import Buttom from "../../component/Buttom/Buttom";

export default () => {

  return (
    <div className="app-container">
      <div className="file-container">
        <div className="file-menus">
          <div className="paths">
            <Buttom text="home"></Buttom>
            <span>/</span>
            <Buttom text="root"></Buttom>
            <span>/</span>
            <Buttom text="其他"></Buttom>
          </div>
          <div className="flex-spacer"></div>
          <div className="button-groups">
            <Buttom text="上传" icon="upload"/>
            <Buttom text="下载" icon="download"/>
            <Buttom text="删除" icon="trash"/>
            <Buttom text="分享" icon="share"/>
          </div>
        </div>
        <Files data={testData}/>
        <div className="page-container">
          <Pages total={8}/>
        </div>
      </div>
    </div>
  )
}

const testData = [
  {
    id: "1",
    name: "西电开学报告.pdf",
    size: 1023432,
    uploader: "shlande",
    created: new Date()
  },
  {
    id: "2",
    name: "西电开学报告.pdf",
    size: 1023432,
    uploader: "shlande",
    created: new Date()
  },{
    id: "3",
    name: "西电开学报告.pdf",
    size: 1023432,
    uploader: "shlande",
    created: new Date()
  },{
    id: "4",
    name: "西电开学报告.pdf",
    size: 1023432,
    uploader: "shlande",
    created: new Date()
  },{
    id: "5",
    name: "西电开学报告.pdf",
    size: 1023432,
    uploader: "shlande",
    created: new Date()
  },
  {
    id: "6",
    name: "西电开学报告.pdf",
    size: 1023432,
    uploader: "shlande",
    created: new Date()
  },
  {
    id: "7",
    name: "西电开学报告.pdf",
    size: 1023432,
    uploader: "shlande",
    created: new Date()
  }
]