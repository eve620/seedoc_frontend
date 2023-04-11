import './App.scss'
import {StrictMode, useEffect} from "react"
import {RouterProvider, useNavigate} from "react-router-dom"
import {router, toLogin} from "./router";
import {getInstance} from "./sdk/Instance";
import Pop from "./component/Pop/Pop";

function App() {
  return (
    <StrictMode>
      <RouterProvider router={router}></RouterProvider>
    </StrictMode>
  )
}

export default App
