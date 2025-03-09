import { createHashRouter, RouterProvider } from 'react-router-dom'

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
import Week6 from './pages/Week6';


const routes = [
  {
    path: "/", element: <Layout />,
    children: [
      { index: true, element: <Home/> },
      { path: "week1", element: <Week1/> },
      { path: "week2", element: <Week2/>},
      { path: "week3", element: <Week3/>},
      { path: "week4", element: <Week4/>},
      { path: "week5", element: <Week5/>},
      { path: "week6", element: <Week6/>},
    ]
  },
];

const router = createHashRouter(routes);

const RouteConf = () => {
  return <RouterProvider router={router} />;
};

export default RouteConf;