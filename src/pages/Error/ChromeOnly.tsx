import "./style.scss"
export default () => {
  return <div className="container">
    <div>
      <h1>:( 出错啦</h1>
      <h2>360浏览器请打开极速模式，或者切换到以下Chrome内核浏览器：</h2>
      <div className={"browsers"}>
        <div onClick={()=>window.open("https://www.google.cn/chrome/")}><img width={24} src="/chrome.svg" alt="chrome"/><span>谷歌浏览器</span></div>
        <div onClick={()=>window.open("https://www.microsoft.com/zh-cn/edge")}><img width={24} src="/edge.svg" alt="chrome"/><span>微软Edge浏览器</span></div>
      </div>
    </div>
  </div>
}