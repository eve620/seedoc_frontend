import Login from "./pages/Login/Login"
import {createBrowserRouter, NavigateFunction} from "react-router-dom";
import TopBar from "./pages/TopBar/TopBar";
import Files from "./pages/Files/Files";

export const toLogin = (navigate: NavigateFunction) => {
  navigate("/login")
}

export const toMain =(navigate: NavigateFunction) => {
  navigate("/")
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/",
    element: <><TopBar/><Files/></>,
  }
])