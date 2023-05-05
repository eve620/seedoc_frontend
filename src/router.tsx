import Login from "./pages/Login/Login"
import {createBrowserRouter, Navigate, NavigateFunction, useNavigate} from "react-router-dom";
import TopBar from "./pages/TopBar/TopBar";
import Files from "./pages/Files/Files";
import Manage from "./pages/Manage/Manage";
import Redirect from "./pages/Redirect";
import ChromeOnly from "./pages/Error/ChromeOnly";

export const toErrorChrome = (navigate:NavigateFunction) => {
  navigate("/error/chrome")
}

export const toLogin = (navigate: NavigateFunction) => {
  navigate("/login")
}

export const toManage = (navigate: NavigateFunction) => {
  return navigate("/manage")
}

export const toMain = (navigate: NavigateFunction, path?: string) => {
  navigate("/file/" + (path ? path : ""))
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element:<Login/>,
    children: [{path: "cas"}]
  },
  {
    path: "/",
    element: <Redirect></Redirect>
  },
  {
    path: "/file/*",
    element: <><TopBar/><Files/></>,
  },
  {
    path: "/manage",
    // TODO: 使用loader加载数据
    element: <><TopBar/><Manage/></>,
  }
])