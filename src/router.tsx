import Login from "./pages/Login/Login"
import {createBrowserRouter, Navigate, NavigateFunction, useNavigate} from "react-router-dom";
import TopBar from "./pages/TopBar/TopBar";
import Files from "./pages/Files/Files";
import Manage from "./pages/Manage/Manage";
import {getInstance} from "./sdk/Instance";
import Redirect from "./pages/Redirect";

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
    element: <Login/>,
  },
  {
    path: "/",
    element: <Redirect></Redirect>
  },
  {
    path: "/file/:path?",
    element: <><TopBar/><Files/></>,
  },
  {
    path: "/manage",
    element: <><TopBar/><Manage/></>,
  }
])