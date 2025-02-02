import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 bootstrap
// import '@/styles/all.scss'; // 引入自訂的 scss 檔案

function Week1() {
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

  const [tempProduct, setTempProduct] = React.useState<Product | null>(null); // 單一產品細節
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
          axios.get(`${import.meta.env.VITE_BASE_URL}/v2/api${import.meta.env.VITE_API_PATH}/admin/products`)
            .then((res: AxiosResponse) => {
              console.log(res.data)
              setProducts(res.data.products);
            })
            .catch((error) => {
              console.error(error);
            });

          setIsAuth(true);// 登入成功
        }
      })
      .catch((error) => {
        console.error(error);
        alert('登入失敗');
        setIsAuth(false);// 登入失敗

      });
}

return (
  <>
    {isAuth ? 
      <section className="container mt-5">
        <div className="row">
          <div className="col-12 col-lg-6 mb-4">
            <h2 className="fw-bold">產品列表</h2>
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
                      <button className="btn btn-primary" onClick={() => { setTempProduct(item) }}>查看細節</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-12 col-lg-6 mb-4">
            <h2 className="fw-bold">單一產品細節</h2>
            {tempProduct && tempProduct.title ? (
              <div className="card mb-3">
                <img src={tempProduct.imageUrl} className="card-img-top primary-image" alt="主圖" />
                <div className="card-body">
                  <h5 className="card-title">
                    {tempProduct.title}
                    <span className="badge bg-primary ms-2">{tempProduct.category}</span>
                  </h5>
                  <p className="card-text">商品描述：{tempProduct.description}</p>
                  <p className="card-text">商品內容：{tempProduct.content}</p>
                  <div className="d-flex">
                    <p className="card-text text-secondary"><del>{tempProduct.origin_price}</del></p>
                    元 / {tempProduct.price} 元
                  </div>
                  <h5 className="mt-3">更多圖片：</h5>
                  <div className="d-flex flex-wrap">
                    {tempProduct.imagesUrl.map((image, index) => (
                      <img key={index} src={image} className="img-thumbnail border-0 me-2" alt="其他圖片" />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-secondary fw-bold">請選擇一個商品查看 !</p>
            )}
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
  </>
)
}

export default Week1;
