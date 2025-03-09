import { useState } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";

// Components
import Layout from "./components/Layout";
import Home from "./components/Home";
// Pages
import Week2 from "./pages/Week2";
import Week3 from "./pages/Week3";
import Week4 from "./pages/Week4";
import Week5 from "./pages/Week5";
import Week6 from "./pages/Week6";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";

interface CartItem {
  id: number | string;
  title: string;
  price: number;
  quantity: number;
}

const RouteConf = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const routes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "week2", element: <Week2 /> },
        { path: "week3", element: <Week3 /> },
        { path: "week4", element: <Week4 /> },
        { path: "week5", element: <Week5 /> },
        { path: "week6", element: <Week6 /> },
        { path: "products", element: <Products cart={cart} setCart={setCart} /> },
        { path: "products/:id", element: <ProductDetail /> },
        { path: "cart", element: <Cart cart={cart} setCart={setCart} /> },
      ],
    },
  ];

  const router = createHashRouter(routes);

  return <RouterProvider router={router} />;
};

export default RouteConf;
