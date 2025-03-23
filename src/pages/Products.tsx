import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { useDispatch } from 'react-redux';
import { showToast } from '../redux/slices/toastSlice';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

interface Product {
  id: number | string;
  title: string;
  imageUrl: string;
  price: number;
  origin_price: number;
}

interface CartItem {
  id: number | string;
  title: string;
  price: number;
  quantity: number;
}

interface ProductsProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const Products: React.FC<ProductsProps> = ({ cart, setCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/v2/api${API_PATH}/products`);
        setProducts(res.data.products);
      } catch (error) {
        alert("取得產品失敗");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product: Product) => {
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/v2/api${API_PATH}/cart`, {
        data: { product_id: product.id, qty: 1 },
      });
      setCart((prev) => {
        const found = prev.find((item) => item.id === product.id);
        if (found) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
      dispatch(showToast('已加入購物車'));
      // dispatch(showToast(`已加入 ${qtySelect} 個 ${tempProduct.title} 至購物車`));
    } catch (error) {
      console.error(error);
      alert("加入購物車失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFromCart = async (cartItemId: string | number) => {
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/v2/api${API_PATH}/cart/${cartItemId}`);
      setCart((prev) => prev.filter((item) => item.id !== cartItemId));
      dispatch(showToast('已從購物車移除產品'));
    } catch (error) {
      console.error(error);
      alert("從購物車移除產品失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Toast />
      <div className="container mt-4">
        {loading && <ReactLoading type="spin" color="#000" className="d-block mx-auto" />}
        <div className="d-flex justify-content-between align-items-center">
          <h1>產品列表</h1>
          <Link to="/cart" className="btn btn-primary mt-3">查看購物車</Link>
        </div>
        <table className="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ width: "200px" }}>
                  <img className="img-fluid" src={product.imageUrl} alt={product.title} />
                </td>
                <td>{product.title}</td>
                <td>
                  <del className="h6">原價 {product.origin_price} 元</del>
                  <div className="h5">特價 {product.price} 元</div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <Link to={`/products/${product.id}`} className="btn btn-outline-secondary">
                      查看更多
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      type="button"
                      className="btn btn-outline-danger"
                    >
                      加到購物車
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cart.length > 0 && (
          <div className="mt-5">
            <h2>購物車</h2>
            <table className="table align-middle">
              <thead>
                <tr>
                  <th></th>
                  <th>品名</th>
                  <th>數量</th>
                  <th className="text-end">單價</th>
                  <th className="text-end">小計</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteFromCart(item.id)}
                      >
                        x
                      </button>
                    </td>
                    <td>{item.title}</td>
                    <td>{item.quantity}</td>
                    <td className="text-end">{item.price}</td>
                    <td className="text-end">{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="text-end">總計：</td>
                  <td className="text-end">
                    {cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className="text-end">
              <button 
                className="btn btn-danger" 
                onClick={() => {
                  // Clear the entire cart
                  setCart([]);
                  dispatch(showToast('購物車已清空'));
                }}
              >
                清空購物車
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
