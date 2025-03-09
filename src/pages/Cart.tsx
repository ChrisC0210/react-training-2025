import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from '../components/Navbar';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

interface CartItem {
  id: number | string;
  title: string;
  price: number;
  quantity: number;
}

interface CartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

interface OrderForm {
  email: string;
  name: string;
  tel: string;
  address: string;
  message?: string;
}

const Cart: React.FC<CartProps> = ({ cart, setCart }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<OrderForm>();
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const onSubmit = async (data: OrderForm) => {
    if (cart.length === 0) {
      alert("購物車是空的，無法送出訂單！");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/v2/api${API_PATH}/order`, {
        data: {
          user: {
            name: data.name,
            email: data.email,
            tel: data.tel,
            address: data.address,
          },
          message: data.message,
          products: cart.map((item) => ({
            product_id: item.id,
            qty: item.quantity,
          })),
        },
      });

      alert("訂單送出成功！");
      setCart([]); // 清空購物車
    } catch (error) {
      console.error("訂單送出失敗", error);
      alert("訂單送出失敗，請稍後再試！");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar /> {/* Add this line */}
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center">
        <h1>購物車</h1>
        <Link to="/products" className="btn btn-outline-primary mt-3">
          返回產品列表
        </Link>
        </div>
        {cart.length === 0 ? (
          <p>購物車是空的</p>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>品名</th>
                  <th>數量</th>
                  <th>單價</th>
                  <th>總價</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price} 元</td>
                    <td>{item.price * item.quantity} 元</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-end fw-bold">總計：</td>
                  <td className="fw-bold">{totalAmount} 元</td>
                </tr>
              </tfoot>
            </table>

            <div className="my-5 row justify-content-center">
              <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="請輸入 Email"
                    {...register("email", { required: "必填" })}
                  />
                  <p className="text-danger my-2">{errors.email?.message}</p>
                </div>

                <div className="mb-3">
                  <label htmlFor="name" className="form-label">收件人姓名</label>
                  <input
                    id="name"
                    className="form-control"
                    placeholder="請輸入姓名"
                    {...register("name", { required: "必填" })}
                  />
                  <p className="text-danger my-2">{errors.name?.message}</p>
                </div>

                <div className="mb-3">
                  <label htmlFor="tel" className="form-label">收件人電話</label>
                  <input
                    id="tel"
                    type="text"
                    className="form-control"
                    placeholder="請輸入電話"
                    {...register("tel", { required: "必填" })}
                  />
                  <p className="text-danger my-2">{errors.tel?.message}</p>
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label">收件人地址</label>
                  <input
                    id="address"
                    type="text"
                    className="form-control"
                    placeholder="請輸入地址"
                    {...register("address", { required: "必填" })}
                  />
                  <p className="text-danger my-2">{errors.address?.message}</p>
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">留言</label>
                  <textarea
                    id="message"
                    className="form-control"
                    cols={30}
                    rows={3}
                    {...register("message")}
                  ></textarea>
                </div>

                <div className="text-end">
                  <button type="submit" className="btn btn-danger" disabled={loading}>
                    {loading ? "送出中..." : "送出訂單"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary ms-2"
                    onClick={() => setCart([])}
                  >
                    清空購物車
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

      </div>
    </>
  );
};

export default Cart;
