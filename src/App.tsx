import './App.scss'
import {StrictMode, useEffect} from "react"
import {RouterProvider, useNavigate} from "react-router-dom"
import {router, toErrorChrome, toLogin} from "./router";
import {isBrowserSupport} from "./utils";
import ChromeOnly from "./pages/Error/ChromeOnly";
function App() {
  return (
    <StrictMode>
      {isBrowserSupport() ? <RouterProvider router={router}></RouterProvider> : <ChromeOnly/>}
    </StrictMode>
  )
}

export default App
