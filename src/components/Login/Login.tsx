import React, { useState } from 'react';
// import axios, { AxiosResponse } from 'axios';

interface LoginProps {
  handleLogin: (username: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ handleLogin }) => {
  //定義狀態
  // const [isAuth, setIsAuth] = useState(false); // 是否登入
  // 用於管理登入表單的 state
  const [account, setAccount] = useState({
    username: '',
    password: ''
  });

  //定義 API 網址和路徑
  //  const BASE_URL = import.meta.env.VITE_BASE_URL; // 從 .env 取得 API 網址


  // 監聽 input
  // 處理表單輸入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {  name, value  } = e.target; //解構賦值
    setAccount((prev) => ({
      // ...account,
      ...prev,
      [name]: value
    }));
    // console.log(account)
  };

  // 登入
  // 觸發父層傳入的 handleLogin
  const onSubmitLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();  // 阻止預設行為
    handleLogin(account.username, account.password);
  };

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
            <button className="btn btn-primary" onClick={onSubmitLogin}>登入</button>
          </form>
          <p className="mt-5 mb-3 text-muted">&copy; 2025 Chris Chen</p>
        </div>
      </section>

    </>
  )
};
export default Login;