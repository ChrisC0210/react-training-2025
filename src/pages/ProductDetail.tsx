import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactLoading from "react-loading";
import Navbar from '../components/Navbar';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

interface Product {
  id: number | string;
  title: string;
  imageUrl: string;
  content: string;
  description: string;
  price: number;
  origin_price: number;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/v2/api${API_PATH}/product/${id}`);
        setProduct(res.data.product);
      } catch (error) {
        alert("取得產品詳情失敗");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <ReactLoading type="spin" color="#000" />
      </div>
    );
  }

  if (!product) {
    return <h1 className="text-center mt-5">找不到產品</h1>;
  }

  return (
    <>
      <Navbar /> {/* Add this line */}
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1>產品詳細頁</h1>
          <button className="btn btn-outline-primary" onClick={() => navigate("/products")}>
            返回產品列表
          </button>
        </div>
        <img src={product.imageUrl} alt={product.title} className="img-fluid mb-3" />
        <h2>{product.title}</h2>
        <p>{product.content}</p>
        <p>{product.description}</p>
        <p>
          價格：{product.price} 元 <del>{product.origin_price} 元</del>
        </p>
        {/* <div className="text-end">
          <button className="btn btn-outline-primary" onClick={() => navigate("/products")}>
            返回產品列表
          </button>
        </div> */}
      </div>
    </>
  );
};

export default ProductDetail;
