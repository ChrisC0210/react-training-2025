// import React from 'react'
import { useRoutes } from 'react-router-dom'

//components
import Layout from './components/Layout';
import Home from './components/Home';
//pages
import Week1 from './pages/Week1';
import Week2 from './pages/Week2/layout';

const routes = [
  {
    path: "/", element: <Layout />,
    /// + in the Routes path="/" need to be path=""
    // https://github.com/orgs/community/discussions/36010
    children: [
      { index: true, element: <Home/> },
      { path: "week1", element: <Week1/> },
      { path: "week2", element: <Week2/>}
    ]
  },
]

const RouteConf = () => {
  const routeConfig = useRoutes(routes)
  return routeConfig
}

export default RouteConf