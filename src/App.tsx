import './App.scss'
import {StrictMode} from "react"
import {RouterProvider} from "react-router-dom"
import {router} from "./router";

function App() {
  return (
    <StrictMode>
      <RouterProvider router={router}></RouterProvider>
    </StrictMode>
  )
}

export default App
