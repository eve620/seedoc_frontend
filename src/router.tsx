import Login from "./pages/Login/Login"
import {createBrowserRouter, redirect} from "react-router-dom";
import TopBar from "./pages/TopBar/TopBar";
import Files from "./pages/Files/Files";

export const toLogin = () => {
  redirect("/login")
}

export const toMain =() => {
  redirect("/")
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