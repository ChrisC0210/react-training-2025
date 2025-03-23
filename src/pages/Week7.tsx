import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useForm } from 'react-hook-form';
import ReactLoading from 'react-loading';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast'; // Add this line
import { useDispatch, useSelector } from 'react-redux'; // Add this line
import { showToast } from '../redux/slices/toastSlice'; // Add this line
import { addToCart, clearCart } from '../redux/slices/cartSlice'; // Add this line
import { RootState } from '../redux/store'; // Add this line

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function Week6() {
  const [products, setProducts] = useState<Product[]>([]);
  const [tempProduct, setTempProduct] = useState<Product>({
    id: "",
    title: "",
    imageUrl: "",
    content: "",
    description: "",
    price: 0,
    origin_price: 0,
  });

  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>();

  const dispatch = useDispatch(); // Add this line

  const cart = useSelector((state: RootState) => state.cart); // Use Redux cart

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common['Authorization'] = token;

    const getProducts = async () => {
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
    getProducts();
  }, []);

  const productModalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (productModalRef.current) {
      new Modal(productModalRef.current, { backdrop: false });
    }
  }, []);

  const openModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current!);
    if (modalInstance) {
      modalInstance.show();
    }
  };

  const closeModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current!);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  interface Product {
    id: number | string;
    title: string;
    imageUrl: string;
    content: string;
    description: string;
    price: number;
    origin_price: number;
  }

  //   interface CartItem extends Product {
  //     quantity: number;
  //   }

  const handleSeeMore = (product: Product) => {
    setTempProduct(product);
    openModal();
  };

  const handleAddToCart = async (product: Product) => {
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/v2/api${API_PATH}/cart`, {
        data: {
          product_id: product.id,
          qty: 1
        }
      });
      dispatch(addToCart({
        product,
        quantity: 1
      }));
      dispatch(showToast('已加入購物車')); // Add this line
    } catch (error) {
      console.error(error);
      alert('加入購物車失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCartFromModal = async () => {
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/v2/api${API_PATH}/cart`, {
        data: {
          product_id: tempProduct.id,
          qty: qtySelect
        }
      });
      dispatch(addToCart({
        product: tempProduct,
        quantity: qtySelect
      }));
      dispatch(showToast(`已加入 ${qtySelect} 個 ${tempProduct.title} 至購物車`));
      closeModal();
    } catch (error) {
      console.error(error);
      alert('加入購物車失敗');
    } finally {
      setLoading(false);
    }
  };

  interface IFormInputs {
    email: string;
    name: string;
    tel: string;
    address: string;
    message?: string;
  }

  const onSubmit = async (data: IFormInputs) => {
    if (cart.length === 0) {
      alert('購物車無產品，無法結帳');
      return;
    }
    try {
      await axios.post(`${BASE_URL}/v2/api${API_PATH}/order`, {
        data: {
          user: {
            name: data.name,
            email: data.email,
            tel: data.tel,
            address: data.address
          },
          message: data.message
        }
      });
      dispatch(clearCart());
      dispatch(showToast('訂單已送出並清空購物車')); // Add this line
    } catch (error) {
      console.error(error);
      alert('訂單發送失敗');
    }
  };

  const [qtySelect, setQtySelect] = useState(1);

  return (
    <>
      <Navbar /> {/* Add this line */}
      <Toast /> {/* Add this line */}
      <div className="container">
        {loading && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <ReactLoading type="spin" color="#000" />
          </div>
        )}
        <div className="mt-4">
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
                    <img
                      className="img-fluid"
                      src={product.imageUrl}
                      alt={product.title}
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>
                    <del className="h6">原價 {product.origin_price} 元</del>
                    <div className="h5">特價 {product.origin_price}元</div>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        onClick={() => handleSeeMore(product)}
                        type="button"
                        className="btn btn-outline-secondary"
                      >
                        查看更多
                      </button>
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

          <div
            ref={productModalRef}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            className="modal fade"
            id="productModal"
            tabIndex={-1}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title fs-5">
                    產品名稱：{tempProduct.title}
                  </h2>
                  <button
                    onClick={closeModal}
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <img
                    src={tempProduct.imageUrl}
                    alt={tempProduct.title}
                    className="img-fluid"
                  />
                  <p>內容：{tempProduct.content}</p>
                  <p>描述：{tempProduct.description}</p>
                  <p>
                    價錢：{tempProduct.price}{" "}
                    <del>{tempProduct.origin_price}</del> 元
                  </p>
                  <div className="input-group align-items-center">
                    <label htmlFor="qtySelect">數量：</label>
                    <select
                      value={qtySelect}
                      onChange={(e) => setQtySelect(Number(e.target.value))}
                      id="qtySelect"
                      className="form-select"
                    >
                      {Array.from({ length: 10 }).map((_, index) => (
                        <option key={index} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleAddToCartFromModal}
                  >
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-end py-3">
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => dispatch(clearCart())}
            >
              清空購物車
            </button>
          </div>

          <table className="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style={{ width: "150px" }}>數量/單位</th>
                <th className="text-end">單價</th>
              </tr>
            </thead>

            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() =>
                        dispatch(clearCart())
                      }
                    >
                      x
                    </button>
                  </td>
                  <td>{item.title}</td>
                  <td style={{ width: "150px" }}>
                    <div className="d-flex align-items-center">
                      <div className="btn-group me-2" role="group">
                        <button
                          type="button"
                          className="btn btn-outline-dark btn-sm"
                          onClick={() =>
                            dispatch(addToCart({
                              product: item,
                              quantity: item.quantity - 1
                            }))
                          }
                        >
                          -
                        </button>
                        <span
                          className="btn border border-dark"
                          style={{ width: "50px", cursor: "auto" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline-dark btn-sm"
                          onClick={() =>
                            dispatch(addToCart({
                              product: item,
                              quantity: item.quantity + 1
                            }))
                          }
                        >
                          +
                        </button>
                      </div>
                      <span className="input-group-text bg-transparent border-0">
                        unit
                      </span>
                    </div>
                  </td>
                  <td className="text-end">{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-end">
                  總計：
                </td>
                <td className="text-end" style={{ width: "130px" }}>
                  {cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="my-5 row justify-content-center">
          <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="請輸入 Email"
                {...register('email', { required: '必填' })}
              />
              <p className="text-danger my-2">{errors.email?.message}</p>
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                收件人姓名
              </label>
              <input
                id="name"
                className="form-control"
                placeholder="請輸入姓名"
                {...register('name', { required: '必填' })}
              />
              <p className="text-danger my-2">{errors.name?.message}</p>
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                收件人電話
              </label>
              <input
                id="tel"
                type="text"
                className="form-control"
                placeholder="請輸入電話"
                {...register('tel', { required: '必填',      pattern: {
                  value: /^(0[2-8]\d{7}|09\d{8})$/,
                  message: '請輸入正確的電話格式'
                } })}
              />
              <p className="text-danger my-2">{errors.tel?.message}</p>
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                收件人地址
              </label>
              <input
                id="address"
                type="text"
                className="form-control"
                placeholder="請輸入地址"
                {...register('address', { required: '必填' })}
              />
              <p className="text-danger my-2">{errors.address?.message}</p>
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                留言
              </label>
              <textarea
                id="message"
                className="form-control"
                cols={30}
                rows={10}
                {...register('message')}
              ></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger">
                送出訂單
              </button>
            </div>
          </form>
        </div>
        
      </div>
    </>
  );
}

export default Week6;
