import { Link, NavLink } from "react-router-dom";
import axios from "axios";

// 添加 props 接口
interface NavbarProps {
  isAuth?: boolean;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuth, onLogout }) => {
  // 登出功能
  const handleLogout = async () => {
    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      await axios.post(`${BASE_URL}/v2/logout`, {}, { withCredentials: true });

      // 清除 cookie
      document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // 清除 axios 默認請求頭
      axios.defaults.headers.common['Authorization'] = '';

      // 呼叫父組件的 onLogout 函數
      if (onLogout) onLogout();

      alert('登出成功');
    } catch (error) {
      console.error('登出失敗', error);
      alert('登出失敗');
    }
  };
  return (
    <nav className="container navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          CART
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/"
              >
                首頁
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/products"
              >
                產品頁
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/cart"
              >
                購物車
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/Admin"
              >
                後台登入
              </NavLink>
            </li>
            {/* 登出 */}
            {/* 條件渲染登出按鈕 */}
            {isAuth && (
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleLogout}>
                  登出
                </button>
              </li>
            )}
        </ul>
      </div>
    </div>
    </nav >
  );
};

export default Navbar;
