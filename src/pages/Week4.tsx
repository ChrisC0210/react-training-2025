import  { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 bootstrap
// import '@/styles/all.scss'; // 引入自訂的 scss 檔案
import Login from '../components/Login/Login';
import Product from '../components/Product/Product';

function Week4() {
  //定義 API 網址和路徑
  const BASE_URL = import.meta.env.VITE_BASE_URL; // 從 .env 取得 API 網址
  const API_PATH = import.meta.env.VITE_API_PATH; // 從 .env 取得 API 路徑

  const [isAuth, setIsAuth] = useState(false); // 是否登入
  // const [account, setAccount] = useState({
  //   username: '',
  //   password: ''
  // })
  
    useEffect(() => {
      const checkUserLogin = async () => {
        try {
          await axios.post(`${BASE_URL}/v2/api/user/check`);
          // alert("使用者已登入");
          // getProducts();
          setIsAuth(true);
        } catch (error) {
          console.error(error);
          setIsAuth(false);
        }
      };
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1",
      );
      axios.defaults.headers.common['Authorization'] = token;
      checkUserLogin();
    }, []);
    
  // 登入
  const handleLogin = (username: string, password: string) => {
    // console.log({ username, password })
    axios.post(`${BASE_URL}/v2/api${API_PATH}/admin/signin`, { username, password })
    // axios.post(`${import.meta.env.VITE_BASE_URL}/v2/admin/signin`, { username, password })
      .then((res: AxiosResponse) => {
        const { token, expired } = res.data; //解構賦值
        // console.log(token, expired) // 顯示 token 和 expired
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`; // 設定 cookie
        axios.defaults.headers.common['Authorization'] = token; // 設定預設請求標頭

        if (res.data.success === true) {
          alert('登入成功');
          // window.location.href = '/';
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
  return (
    <>
      {isAuth ? (
        // 如果已登入，顯示產品頁面
        <Product isAuth={isAuth} />
      ) : (
        // 尚未登入就顯示登入畫面
        <Login handleLogin={handleLogin} />
      )}
    </>
  )
}

export default Week4;
