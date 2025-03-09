import { FC } from "react"
import { BrowserRouter, Outlet } from "react-router-dom"
import RouteConf from "./RouteConf"
// import Navbar from './components/Navbar'

//CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 bootstrap
import './styles/all.scss'; // 引入自訂的 scss 檔案

const App: FC = () => {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <RouteConf />
      <Outlet />
    </BrowserRouter>
  )
}

export default App
