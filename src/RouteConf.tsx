import { HashRouter, Routes, Route } from "react-router-dom";

// Components
import Layout from "./components/Layout";
import Home from "./components/Home";
// Pages
import Week2 from "./pages/Week2";
import Week3 from "./pages/Week3";
import Week4 from "./pages/Week4";
import Week5 from "./pages/Week5";
import Week6 from "./pages/Week6";
import Week7 from "./pages/Week7";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";

const RouteConf = () => {
  // Get the base URL from the environment
  // const basename = import.meta.env.BASE_URL;

  return (
    // <BrowserRouter basename={basename}>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="week2" element={<Week2 />} />
          <Route path="week3" element={<Week3 />} />
          <Route path="week4" element={<Week4 />} />
          <Route path="week5" element={<Week5 />} />
          <Route path="week6" element={<Week6 />} />
          <Route path="week7" element={<Week7 />} />
          <Route path="products" element={<Products cart={[]} setCart={() => {}} />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </HashRouter>
    // </BrowserRouter>
  );
};

export default RouteConf;
