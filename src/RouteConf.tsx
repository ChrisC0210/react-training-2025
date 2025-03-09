// import React from 'react'
import { useRoutes } from 'react-router-dom'

//components
import Layout from './components/Layout';
import Home from './components/Home';
//pages
// import Login from './pages/Login'; 
import Week1 from './pages/Week1';
import Week2 from './pages/Week2';
import Week3 from './pages/Week3';
import Week4 from './pages/Week4';
import Week5 from './pages/Week5';


const routes = [
  {
    path: "/react-training-2025/", element: <Layout />,
    // path: "", element: <Layout />,
    /// + in the Routes path="/" need to be path=""
    // https://github.com/orgs/community/discussions/36010
    children: [
      { index: true, element: <Home/> },
      // { path: "/react-training-2025/login", element: <Login/> },
      { path: "/react-training-2025/week1", element: <Week1/> },
      { path: "/react-training-2025/week2", element: <Week2/>},
      { path: "/react-training-2025/week3", element: <Week3/>},
      { path: "/react-training-2025/week4", element: <Week4/>},
      { path: "/react-training-2025/week5", element: <Week5/>},
    ]
  },
]

const RouteConf = () => {
  const routeConfig = useRoutes(routes)
  return routeConfig
}

export default RouteConf