import React, { useState } from 'react';
import { DefaultModalState } from './type';
import axios from 'axios';
// import { Modal } from 'bootstrap';


interface ProductModalProps {
  tempProduct: DefaultModalState;
  setTempProduct: React.Dispatch<React.SetStateAction<DefaultModalState>>;
  modalMode: 'create' | 'edit';
  closeProductModal: () => void;
  handleUploadProduct: () => void;   // 外層要去呼叫「createProduct 或 updateProduct」的整合函式
  productModalRef: React.RefObject<HTMLDivElement>;

  BASE_URL: string;
  API_PATH: string;
}

const ProductModal: React.FC<ProductModalProps> = ({
  tempProduct,
  setTempProduct,
  modalMode,
  closeProductModal,
  handleUploadProduct,
  productModalRef,
  BASE_URL,
  API_PATH
}) => {
  const [, forceUpdate] = useState(0); // 用於強制更新元件
  // 處理檔案上傳
  const handleFileChange = async (e: React.MouseEvent<HTMLInputElement>) => {
    const fileInput = e.target as HTMLInputElement;
    const file = fileInput.files?.[0];  // 檢查是否有選取檔案
    if (!file) {
      alert("請選擇圖片檔案");
      return;
    }
    // if (!file) return;
    const formData = new FormData();
    formData.append('file-to-upload', file);
    try {
      const res = await axios.post(`${BASE_URL}/v2/api${API_PATH}/admin/upload`, formData
        ,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // 確保 Content-Type 正確
          }
        }
      );
      // API 回傳的圖片 URL
      // console.log(res.data);
      const uploadImageUrl = res.data.imageUrl;
      // console.log("uploadImageUrl", uploadImageUrl);
      setTempProduct((prevProduct) => ({
        ...prevProduct,
        imageUrl: uploadImageUrl
      }));
      forceUpdate((n: number) => n + 1); // 強制畫面更新
    } catch (error) {
      console.error(error);
      alert('圖片上傳失敗');
    }
  }
  // 處理 Modal 表單輸入
  const handleModalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setTempProduct((prevProduct) => ({
      ...prevProduct!,
      [name]: type === 'checkbox' ? checked : value
    })
    );
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
  // 刪除圖片欄位最後一筆資料
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
  const handleAdditionalFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const fileInput = e.target;
    const file = fileInput.files?.[0];

    if (!file) {
      alert("請選擇圖片檔案");
      return;
    }

    const formData = new FormData();
    formData.append("file-to-upload", file);

    try {
      const res = await axios.post(
        `${BASE_URL}/v2/api${API_PATH}/admin/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log(`副圖片上傳成功: ${res.data.imageUrl}`);

      setTempProduct((prev) => {
        const newImagesUrl = [...prev.imagesUrl];
        newImagesUrl[index] = res.data.imageUrl; // 更新對應的 index
        return { ...prev, imagesUrl: newImagesUrl };
      });
    } catch (error) {
      console.error("副圖片上傳失敗:", error);
      alert("副圖片上傳失敗");
    }
  };

  return (
    <>
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
                  {/*  */}
                  <div className="mb-5">
                    <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="form-control"
                      id="fileInput"
                      onClick={handleFileChange}
                    />
                  </div>
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
                    {tempProduct.imageUrl ? (
                      <img src={tempProduct.imageUrl} alt={tempProduct.title} className="img-fluid"
                      />
                    ) : (
                      <div className="text-muted">尚無圖片</div>
                    )}

                  </div>
                  {/* 其他圖片 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {tempProduct.imagesUrl.map((image: string, index: number) => (
                      <div key={index} className="mb-2">
                        <label
                          htmlFor={`imagesUrl-${index + 1}`}
                          className="form-label"
                        >
                          其他圖片 {index + 1}
                        </label>
                        {/* 圖片上傳 input */}
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          className="form-control mb-2"
                          id={`fileInput-${index}`}
                          onChange={(e) => handleAdditionalFileChange(e, index)}
                        />

                        {/* 手動輸入圖片 URL */}
                        <input
                          value={image}
                          onChange={(e) => handleModalImageChange(e, index)} // 傳入 index 參數,以便知道是哪一個圖片欄位被更改了
                          id={`imagesUrl-${index + 1}`}
                          type="text"
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                        />
                        {/* 預覽圖片 */}
                        {image ? (
                          <img src={image} alt={`副圖 ${index + 1}`} className="img-fluid" />
                        ) : (
                          <div className="text-muted">尚無圖片</div>
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
                      標題{tempProduct.id}
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
              {/* LV3 */}
              <div className="col-md-12">
                <div className="mb-3">
                  <label htmlFor="rating" className="form-label">商品評價星級 (1~5)</label>
                  <input
                    value={tempProduct.rating ?? 0}
                    onChange={(e) => setTempProduct((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                    type="number"
                    min="1"
                    max="5"
                    className="form-control"
                    placeholder="請輸入評價星級"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="stock" className="form-label">庫存數量</label>
                  <input
                    value={tempProduct.stock ?? 0}
                    onChange={(e) => setTempProduct((prev) => ({ ...prev, stock: Number(e.target.value) }))}
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="請輸入庫存數量"
                  />
                </div>
              </div>
              {/*  */}
            </div>
            {/*  */}
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
  );
}

export default ProductModal