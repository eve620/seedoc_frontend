import {useNavigate} from "react-router-dom";
import {toLogin, toMain} from "../router";
import {useEffect} from "react";

export default () => {
  const navigate = useNavigate()
  useEffect(() => {
    toLogin(navigate)
  },[])
  return <></>
}