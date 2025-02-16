import React, { useEffect,  useState } from 'react';
import axios, { AxiosResponse } from 'axios';


function Login(isAuth: any, ) {

   //定義 API 網址和路徑
   const BASE_URL = import.meta.env.VITE_BASE_URL; // 從 .env 取得 API 網址

   //定義狀態
    // const [isAuth, setIsAuth] = useState(false); // 是否登入
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
            // axios.get(`${import.meta.env.VITE_BASE_URL}/v2/api${import.meta.env.VITE_API_PATH}/admin/products`)
            //   .then((res: AxiosResponse) => {
            //     console.log(res.data)
            //     setProducts(res.data.products);
            //   })
            //   .catch((error) => {
            //     console.error(error);
            //   });
            // getProducts(); // 取得產品列表
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
    }, [checkUserLogin]);
  
  return (
    <>
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

    </>
  )
};
export default Login;