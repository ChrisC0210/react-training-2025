import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeFromCart, updateCartItemQuantity } from '../redux/slices/cartSlice';
import { showToast } from '../redux/slices/toastSlice';
import { RootState } from '../redux/store';
import Toast from '../components/Toast';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

interface OrderForm {
  email: string;
  name: string;
  tel: string;
  address: string;
  message?: string;
}


const Cart = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<OrderForm>();
  const [loading, setLoading] = useState(false);
  
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const onSubmit = async (data: OrderForm) => {
    if (cart.length === 0) {
      dispatch(showToast("購物車是空的，無法送出訂單！"));
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

      // dispatch(showToast("訂單。送出成功！"));
      alert("訂單送出成功！");
      dispatch(clearCart());
      window.location.reload();
    } catch (error) {
      console.error("訂單送出失敗", error);
      // dispatch(showToast("訂單送出失敗，請稍後再試！"));
      alert("訂單送出失敗，請稍後再試！");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string | number) => {
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/v2/api${API_PATH}/cart/${itemId}`);
      dispatch(removeFromCart(itemId));
      dispatch(showToast('已從購物車移除商品'));
    } catch (error) {
      console.error('刪除購物車商品失敗', error);
      dispatch(showToast('刪除購物車商品失敗，請稍後再試'));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOne = async (item: { id: string | number; title: string; quantity: number; price: number; }) => {
    setLoading(true);
    try {
      if (item.quantity > 1) {
        const newQty = item.quantity - 1;
        await axios.post(`${BASE_URL}/v2/api${API_PATH}/cart`, {
          data: {
            product_id: item.id,
            qty: newQty
          }
        });
        dispatch(updateCartItemQuantity({ id: item.id, quantity: newQty }));
        dispatch(showToast(`已減少 1 個 ${item.title}`));
      } else {
        // If only 1 left, remove the item entirely
        await axios.delete(`${BASE_URL}/v2/api${API_PATH}/cart/${item.id}`);
        dispatch(removeFromCart(item.id));
        dispatch(showToast(`已從購物車移除 ${item.title}`));
      }
    } catch (error) {
      console.error('更新購物車失敗', error);
      dispatch(showToast('更新購物車失敗，請稍後再試'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddOne = async (item: { id: string | number; title: string; quantity: number; price: number; }) => {
    setLoading(true);
    try {
      const newQty = item.quantity + 1;
      await axios.post(`${BASE_URL}/v2/api${API_PATH}/cart`, {
        data: {
          product_id: item.id,
          qty: newQty
        }
      });
      dispatch(updateCartItemQuantity({ id: item.id, quantity: newQty }));
      dispatch(showToast(`已增加 1 個 ${item.title}`));
    } catch (error) {
      console.error('更新購物車失敗', error);
      dispatch(showToast('更新購物車失敗，請稍後再試'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Toast />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1>購物車</h1>
          <Link to="/products" className="btn btn-outline-primary mt-3">
            返回產品列表
          </Link>
        </div>
        {cart.length === 0 ? (
          <div className="text-center mt-5">
            <div className="text-danger col-12">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="80px" height="80px" viewBox="0 0 22 22" id="memory-cart"><path d="M19 14V16H6V15H5V11H4V8H3V3H1V1H5V4H21V8H20V11H19V12H7V14H19M5 7H6V10H18V7H19V6H5V7M7 17H9V18H10V20H9V21H7V20H6V18H7V17M15 17H17V18H18V20H17V21H15V20H14V18H15V17Z" /></svg>
            </div>
            <h2 className="text-muted mt-3">您的購物車是空的</h2>
            <p className="text-muted">趕快去選購您喜愛的商品吧！</p>
            <Link to="/products" className="btn btn-primary mt-3">
              返回產品列表
            </Link>
          </div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>品名</th>
                  <th>數量</th>
                  <th>單價</th>
                  <th>總價</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>
                      <button 
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={() => handleRemoveOne(item)}
                      >
                        -
                      </button>
                      {item.quantity}
                      <button
                        className="btn btn-outline-secondary btn-sm ms-2"
                        onClick={() => handleAddOne(item)}
                      >
                        +
                      </button>
                    </td>
                    <td>{item.price} 元</td>
                    <td>{item.price * item.quantity} 元</td>
                    <td>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        移除
                      </button>
                    </td>
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
                    {...register("tel", { required: "必填",      
                      pattern: {
                      value: /^(0[2-8]\d{7}|09\d{8})$/,
                      message: '請輸入正確的電話格式'
                    } })}
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

                <div className="text-center">
                  <button type="submit" className="btn btn-danger" disabled={loading}>
                    {loading ? "送出中..." : "送出訂單"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary ms-2"
                    onClick={() => {
                      dispatch(clearCart());
                      window.location.reload();
                    }}
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
