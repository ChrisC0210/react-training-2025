import React, { useEffect, useRef, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 bootstrap
// import '@/styles/all.scss'; // 引入自訂的 scss 檔案
import { Modal } from 'bootstrap';

function Week3() {
  interface Product {
    id: number;
    title: string;
    origin_price: number;
    price: number;
    is_enabled: boolean;
    imageUrl: string;
    category: string;
    description: string;
    content: string;
    imagesUrl: string[];
  }
  interface defaultModalState {
    imageUrl: string;
    title: string;
    category: string;
    unit: string;
    origin_price: string;
    price: string;
    description: string;
    content: string;
    is_enabled: number | boolean;
    imagesUrl: string[];
  }
  //定義 API 網址和路徑
  const BASE_URL = import.meta.env.VITE_BASE_URL; // 從 .env 取得 API 網址
  const API_PATH = import.meta.env.VITE_API_PATH; // 從 .env 取得 API 路徑

  //定義 Modal 預設值
  const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""]
  };

  // const [tempProduct, setTempProduct] = React.useState<Product | null>(null); // 單一產品細節
  const [tempProduct, setTempProduct] = useState<defaultModalState>(defaultModalState); // 單一產品細節
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create'); // modal 模式

  const [productList, setProducts] = React.useState<Product[]>([]); // 產品列表
  const [isAuth, setIsAuth] = useState(false); // 是否登入
  const [account, setAccount] = useState({
    username: '',
    password: ''
  })

  // 處理表單輸入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target; //解構賦值
    setAccount({
      ...account,
      [name]: value
    })
    // console.log(account)
  }
  // 取得產品列表
  const getProducts = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api${API_PATH}/admin/products`
      );
      setProducts(res.data.products);
    } catch (error) {
      alert("取得產品失敗");
      console.error(error);
    }
  };
  // 登入
  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // 阻止表單提交
    console.log(account)
    // console.log(import.meta.env.VITE_BASE_URL)
    axios.post(`${import.meta.env.VITE_BASE_URL}/v2/admin/signin`, account)
      .then((res: AxiosResponse) => {
        const { token, expired } = res.data; //解構賦值
        console.log(token, expired) // 顯示 token 和 expired
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`; // 設定 cookie
        axios.defaults.headers.common['Authorization'] = token; // 設定預設請求標頭

        if (res.data.success === true) {
          alert('登入成功');
          // window.location.href = '/';
          // axios.get(`${import.meta.env.VITE_BASE_URL}/v2/api${import.meta.env.VITE_API_PATH}/admin/products`)
          //   .then((res: AxiosResponse) => {
          //     console.log(res.data)
          //     setProducts(res.data.products);
          //   })
          //   .catch((error) => {
          //     console.error(error);
          //   });
          getProducts(); // 取得產品列表
          setIsAuth(true);// 登入成功
        }
      })
      .catch((error) => {
        console.error(error);
        alert('登入失敗');
        setIsAuth(false);// 登入失敗

      });
  }
  // 檢查使用者是否登入
  const checkUserLogin = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/user/check`);
      // alert("使用者已登入");
      getProducts();
      setIsAuth(true);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    axios.defaults.headers.common['Authorization'] = token;
    checkUserLogin();
  }, []);

  //產品 modal 設定
  const productModalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    new Modal(productModalRef.current!);
    // productModal.show();
  }, []);
  interface OpenProductModalParams {
    mode: 'create' | 'edit';
  }
  // 開啟 Modal
  const openProductModal = (mode: OpenProductModalParams['mode'], product?: Product) => {
    setModalMode(mode);
    if (product) {
      setTempProduct({
        imageUrl: product.imageUrl,
        title: product.title,
        category: product.category,
        unit: '',
        origin_price: product.origin_price.toString(),
        price: product.price.toString(),
        description: product.description,
        content: product.content,
        is_enabled: product.is_enabled,
        imagesUrl: product.imagesUrl
      });
    } else {
      setTempProduct(defaultModalState);
    }
    const modalInstance = Modal.getInstance(productModalRef.current!);
    if (modalInstance) {
      modalInstance.show();
    }
  }
  const closeProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current!);
    if (modalInstance) {
      modalInstance.hide();
    }
    setTempProduct(defaultModalState);
  }
  // 處理 Modal 表單輸入
  const handleModalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setTempProduct((prevProduct) => ({
      ...prevProduct!,
      [name]: type === 'checkbox' ? checked : value
    }));
  }
  // 處理 Modal 其他圖片輸入
  const handleModalImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    setTempProduct((prevProduct) => {
      const newImagesUrl = [...prevProduct.imagesUrl];
      newImagesUrl[index] = value;
      return {
        ...prevProduct,
        imagesUrl: newImagesUrl
      };
    });
  }
  // 新增圖片
  const handleAddImageClick = () => {
    setTempProduct((prevProduct) => ({
      ...prevProduct,
      imagesUrl: [...prevProduct.imagesUrl, ""]
    }));
  }
  // 取消圖片
  const handleCancelImageClick = () => {
    // pop 也可以 移除最後一個元素
    // const newImagesUrl = [...tempProduct.imagesUrl];
    // newImagesUrl.pop();
    setTempProduct((prevProduct) => ({
      ...prevProduct,
      // imagesUrl: newImagesUrl //pop 
      imagesUrl: prevProduct.imagesUrl.slice(0, prevProduct.imagesUrl.length - 1),
    }));
  }

  //
  const createProduct = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/v2/api${API_PATH}/admin/product`,
        // tempProduct
        {
          data: {
            ...tempProduct,
            origin_price: Number(tempProduct.origin_price),
            price: Number(tempProduct.price),
            is_enabled: tempProduct.is_enabled ? 1 : 0
          }
        });
      console.log(res.data);
      // alert('新增成功');
      // getProducts();
      // closeProductModal();
    } catch (error) {
      console.error(error);
      alert('新增失敗');
    }
  }
  const handleUploadProduct = async () => {
    try {
      await createProduct();
      // alert('新增成功');
      getProducts();
      closeProductModal();
    } catch (error) {
      console.error(error);
      alert('新增失敗');
    }
  }
  // 更新產品

  return (
    <>
      {isAuth ?
        <section className="container mt-5">
          <div className="row">
            <div className="col-12 mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="fw-bold">產品列表</h2>
                <button onClick={() => { openProductModal('create') }} type="button" className="btn btn-primary"><i className="bi  bi-plus-lg"></i>&nbsp;建立新的產品</button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-bold">{item.title}</td>
                      <td>{item.origin_price}</td>
                      <td>{item.price}</td>
                      <td>{item.is_enabled ? "是" : "否"}</td>
                      <td>
                        {/* <button className="btn btn-primary" onClick={() => { setTempProduct(item) }}>查看細節</button> */}
                        {/* <div className="btn-group"> */}
                        <div className="">
                          <button onClick={() => { openProductModal('edit', productList.find(product => product.id === item.id)) }} type="button" className="btn btn-primary btn-sm me-2"><i className="bi bi-pencil-square"></i>&nbsp;編輯</button>
                          <button type="button" className="btn btn-danger btn-sm"><i className="bi bi-trash3-fill"></i>&nbsp;刪除</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        :
        <section className='bg-gradient'>
          <div className="d-flex flex-column justify-content-center align-items-center vh-100">
            <h1 className="mb-5">請先登入</h1>
            <form className="d-flex flex-column gap-4 w-50 p-4 shadow rounded-3">
              <div className="form-floating mb-3">
                <input type="email" className="form-control" id="username" placeholder="name@example.com"
                  value={account.username}
                  name='username'
                  onChange={handleInputChange}
                // onChange={(e) => setAccount({ ...account, username: e.target.value })} 
                />
                <label htmlFor="username">Email address</label>
              </div>
              <div className="form-floating">
                <input type="password" className="form-control" id="password" placeholder="Password"
                  value={account.password}
                  name='password'
                  onChange={handleInputChange}
                // onChange={(e) => setAccount({ ...account, password: e.target.value })} 
                />
                <label htmlFor="password">Password</label>
              </div>
              <button className="btn btn-primary" onClick={handleLogin}>登入</button>
            </form>
            <p className="mt-5 mb-3 text-muted">&copy; 2025 Chris Chen</p>
          </div>
        </section>
      }
      {/* 產品 Modal */}
      <div ref={productModalRef} id="productModal" className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              {/* <h5 className="modal-title fs-4">新增產品</h5> */}
              <h5 className="modal-title fs-4">{modalMode === 'create' ? '新增產品' : '編輯產品'}</h5>
              <button onClick={closeProductModal} type="button" className="btn-close" aria-label="Close"></button>
            </div>

            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-4">
                    <label htmlFor="primary-image" className="form-label">
                      主要圖片
                    </label>
                    <div className="input-group">
                      <input
                        value={tempProduct.imageUrl}
                        onChange={(e) => handleModalInputChange(e as React.ChangeEvent<HTMLInputElement>)}
                        name="imageUrl"
                        type="text"
                        id="primary-image"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                      />
                    </div>
                    <img
                      src={tempProduct.imageUrl}
                      alt={tempProduct.title}
                      className="img-fluid"
                    />
                  </div>

                  {/* 其他圖片 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {tempProduct && tempProduct.imagesUrl?.map((image: string, index: number) => (
                      <div key={index} className="mb-2">
                        <label
                          htmlFor={`imagesUrl-${index + 1}`}
                          className="form-label"
                        >
                          其他圖片 {index + 1}
                        </label>
                        <input
                          value={image}
                          onChange={(e) => handleModalImageChange(e, index)} // 傳入 index 參數,以便知道是哪一個圖片欄位被更改了
                          id={`imagesUrl-${index + 1}`}
                          type="text"
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2"
                          />
                        )}
                      </div>
                    ))}
                    {/* //新增圖片和取消圖片按鈕 */}
                    <div className="btn-group w-100">
                      {tempProduct.imagesUrl.length < 5 && tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] !== ""
                        && (
                          <button className="btn btn-outline-primary btn-sm w-100" onClick={() => handleAddImageClick()} >新增圖片</button>
                        )
                      }
                      {/* //取消圖片按鈕 */}
                      {tempProduct.imagesUrl.length > 1 && (
                        <button className="btn btn-outline-danger btn-sm w-100" onClick={() => handleCancelImageClick()} >取消圖片</button>
                      )}
                    </div>
                    {/*  */}
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      value={tempProduct.title}
                      onChange={handleModalInputChange}
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      value={tempProduct.category}
                      onChange={handleModalInputChange}
                      name="category"
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      value={tempProduct.unit}
                      onChange={handleModalInputChange}
                      name="unit"
                      id="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        value={tempProduct.origin_price}
                        onChange={handleModalInputChange}
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        value={tempProduct.price}
                        onChange={handleModalInputChange}
                        name="price"
                        id="price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      value={tempProduct.description}
                      onChange={handleModalInputChange}
                      name="description"
                      id="description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      value={tempProduct.content}
                      onChange={handleModalInputChange}
                      name="content"
                      id="content"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入說明內容"
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      checked={Boolean(tempProduct.is_enabled)}
                      onChange={handleModalInputChange}
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="isEnabled"
                    />
                    <label className="form-check-label" htmlFor="isEnabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button onClick={closeProductModal} type="button" className="btn btn-secondary">
                取消
              </button>
              <button onClick={handleUploadProduct} type="button" className="btn btn-primary">
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Week3;
