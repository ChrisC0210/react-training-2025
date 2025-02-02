import { FC } from "react"
import { BrowserRouter } from "react-router-dom"
import RouteConf from "./RouteConf"
// import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
// import axios, { AxiosResponse } from 'axios';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

//CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 bootstrap
import './styles/all.scss'; // 引入自訂的 scss 檔案

// 全部交由RouteConf來進行路由管理
const App: FC = () => {

  return (
    <BrowserRouter>
      <RouteConf/>
    </BrowserRouter>
  )
}

export default App 
