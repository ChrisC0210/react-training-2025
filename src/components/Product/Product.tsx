import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

//元件
import type { Product, DefaultModalState, PageInfo } from './type';
import ProductModal from './ProductModal';
import Pagination from './Pagination';
import DeleteProductModal from './DeleteProductModal';

const Product: React.FC = () => {
  //定義 API 網址和路徑
  const BASE_URL = import.meta.env.VITE_BASE_URL; // 從 .env 取得 API 網址
  const API_PATH = import.meta.env.VITE_API_PATH; // 從 .env 取得 API 路徑

  //定義 Modal 預設值
  const defaultModalState = {
    id: "",
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [], // 確保初始為空陣列
  };

  // 狀態
  const [productList, setProducts] = React.useState<Product[]>([]); // 產品列表
  // const [tempProduct, setTempProduct] = React.useState<Product | null>(null); // 單一產品細節
  const [tempProduct, setTempProduct] = useState<DefaultModalState>(defaultModalState); // 單一產品細節
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create'); // modal 模式
  const [pageInfo, setPageInfo] = useState<PageInfo>({ total_pages: 0, current_page: 1 }); // 頁面資訊

  //產品 modal 設定 Ref
  const productModalRef = useRef<HTMLDivElement>(null);
  const delProductModalRef = useRef<HTMLDivElement>(null);

  // 取得產品列表
  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api${API_PATH}/admin/products?page=${page}`
      );
      setProducts(res.data.products); // 設定產品列表
      setPageInfo(res.data.pagination);// 設定分頁資訊
    } catch (error) {
      alert("取得產品失敗");
      console.error(error);
    }
  };
  //取得產品列表
  useEffect(() => {
    getProducts();
  }, []);

  // 處理表單輸入
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value, name } = e.target; //解構賦值
  //   setAccount({
  //     ...account,
  //     [name]: value
  //   })
  //   // console.log(account)
  // }


  //產品 modal 設定
  useEffect(() => {
    new Modal(productModalRef.current!);
    new Modal(delProductModalRef.current!);
    // productModal.show();
  }, []);
  interface OpenProductModalParams {
    mode: 'create' | 'edit';
  }
  // 開啟「新增/編輯」產品 Modal
  const openProductModal = (mode: OpenProductModalParams['mode'], product?: Product) => {
    setModalMode(mode);
    if (product) {
      setTempProduct({
        id: product.id.toString(),
        imageUrl: product.imageUrl || "",  // 確保 `imageUrl` 存在
        title: product.title,
        category: product.category,
        unit: product.unit,
        origin_price: product.origin_price.toString(),
        price: product.price.toString(),
        description: product.description,
        content: product.content,
        is_enabled: product.is_enabled,
        imagesUrl: product.imagesUrl
        // imagesUrl: product.imagesUrl.length > 0 ? product.imagesUrl : []
      });
    } else {
      setTempProduct(defaultModalState);
    }
    const modalInstance = Modal.getInstance(productModalRef.current!);
    if (modalInstance) {
      modalInstance.show();
    }
  }
  // 開啟刪除 Modal
  const openDelProductModal = (product: Product) => {
    setTempProduct({
      id: product.id.toString(),
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
    const modalInstance = Modal.getInstance(delProductModalRef.current!);
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
  const closeDelProductModal = () => {
    const modalInstance = Modal.getInstance(delProductModalRef.current!);
    if (modalInstance) {
      modalInstance.hide();
    }
    setTempProduct(defaultModalState);
  }

  // 新增產品
  const createProduct = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/v2/api${API_PATH}/admin/product`,
        // tempProduct
        {
          data: {
            ...tempProduct,
            origin_price: Number(tempProduct.origin_price),
            price: Number(tempProduct.price),
            is_enabled: tempProduct.is_enabled ? 1 : 0,
            // imagesUrl: tempProduct.imagesUrl,
            imagesUrl: Array.isArray(tempProduct.imagesUrl) ? tempProduct.imagesUrl : [], // 確保 imagesUrl 是陣列
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

  // 更新產品
  const updateProduct = async () => {
    try {
      const res = await axios.put(`${BASE_URL}/v2/api${API_PATH}/admin/product/${tempProduct.id}`,
        {
          data: {
            ...tempProduct,
            origin_price: Number(tempProduct.origin_price),
            price: Number(tempProduct.price),
            is_enabled: tempProduct.is_enabled ? 1 : 0,
            // imagesUrl: tempProduct.imagesUrl
            imagesUrl: Array.isArray(tempProduct.imagesUrl) ? tempProduct.imagesUrl : [], // 確保 imagesUrl 存在
          }
        });
      console.log(res.data);
    } catch (error) {
      console.error(error);
      alert('更新失敗');
    }
  }

  // 用於 ProductModal 按下「確認」後，依 mode 呼叫 create 或 update
  const handleUploadProduct = async () => {
    const apiCall = modalMode === 'create' ? createProduct : updateProduct;

    try {
      // await createProduct();
      await apiCall();
      // alert('新增成功');
      getProducts();
      closeProductModal();
    } catch (error) {
      console.error(error);
      alert('新增失敗');
    }
  }
  // 刪除產品
  const delProduct = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/v2/api${API_PATH}/admin/product/${tempProduct.id}`,
        {
          data: {
            ...tempProduct,
            origin_price: Number(tempProduct.origin_price),
            price: Number(tempProduct.price),
            is_enabled: tempProduct.is_enabled ? 1 : 0,
            imagesUrl: Array.isArray(tempProduct.imagesUrl) ? tempProduct.imagesUrl : [], // 確保 imagesUrl 存在
          }
        });
      console.log(res.data);
    } catch (error) {
      console.error(error);
      alert('刪除失敗');
    }
  }

  // 刪除確認
  const handleDelProduct = async () => {
    try {
      // await createProduct();
      await delProduct();
      // alert('新增成功');
      getProducts();
      closeDelProductModal();
    } catch (error) {
      console.error(error);
      alert('刪除產品失敗');
    }
  }
  //頁面設定
  // interface PageInfo {
  //   total_pages: number;
  //   current_page: number;
  //   has_pre?: boolean;
  //   has_next?: boolean;
  //   category?: string;
  // }
  // const [pageInfo, setPageInfo] = useState<PageInfo>({ total_pages: 0, current_page: 1 }); // 頁面資訊
  // 分頁
  const handlePageChange = (page: number) => {
    getProducts(page);
    // setPageInfo((prevPageInfo) => ({
    //   ...prevPageInfo,
    //   current_page: page
    // }));
  }

  return (
    <>
      <section className="container mt-5">
        <div className="row">
          <div className="col-12 mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="fw-bold">產品列表</h2>
              <button onClick={() => { openProductModal('create') }} type="button" className="btn btn-primary"><i className="bi bi-plus-lg"></i>&nbsp;建立新的產品</button>
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
                    <td>{item.is_enabled ?
                      (
                        <span className="text-success">啟用</span>
                      ) : (
                        <span className="text-danger">未啟用</span>
                      )}
                    </td>
                    <td>
                      {/* <button className="btn btn-primary" onClick={() => { setTempProduct(item) }}>查看細節</button> */}
                      {/* <div className="btn-group"> */}
                      <div className="">
                        <button
                          onClick={() => openProductModal('edit', item)}
                          type="button"
                          className="btn btn-primary btn-sm me-2"
                        >
                          <i className="bi bi-pencil-square"></i>&nbsp;編輯
                        </button>
                        <button
                          onClick={() => openDelProductModal(item)}
                          type="button"
                          className="btn btn-danger btn-sm"
                        >
                          <i className="bi bi-trash3-fill"></i>&nbsp;刪除
                        </button>
                        {/* <button onClick={() => { const product = productList.find(product => product.id === item.id); if (product) openProductModal('edit', product); }} type="button" className="btn btn-primary btn-sm me-2"><i className="bi bi-pencil-square"></i>&nbsp;編輯</button> */}
                        {/* <button onClick={() => { const product = productList.find(product => product.id === item.id); if (product) openDelProductModal(product); }} type="button" className="btn btn-danger btn-sm"><i className="bi bi-trash3-fill"></i>&nbsp;刪除</button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          {/* 頁面 UI */}
          <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
        </div>
      </section>
      {/* 產品 Modal */}
      <ProductModal
        tempProduct={tempProduct}
        setTempProduct={setTempProduct}
        modalMode={modalMode}
        closeProductModal={closeProductModal}
        handleUploadProduct={handleUploadProduct}
        productModalRef={productModalRef}
        BASE_URL={BASE_URL}
        API_PATH={API_PATH}
      />
      {/* 刪除產品 Modal */}
      <DeleteProductModal
        tempProduct={tempProduct}
        closeDelProductModal={closeDelProductModal}
        handleDelProduct={handleDelProduct}
        delProductModalRef={delProductModalRef}
      />
    </>
  );
}

export default Product;