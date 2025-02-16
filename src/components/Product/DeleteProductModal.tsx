import React from 'react';
// import { DefaultModalState } from './type';
// import axios from 'axios';
// import { Modal } from 'bootstrap';


interface DeleteProductModalProps {
	tempProduct: DefaultModalState;
	closeDelProductModal: () => void;
	handleDelProduct: () => void;
	delProductModalRef: React.RefObject<HTMLDivElement>;
}

export interface DefaultModalState {
  id?: string;
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

//定義 Modal 預設值
// const defaultModalState = {
// 	id: "",
// 	imageUrl: "",
// 	title: "",
// 	category: "",
// 	unit: "",
// 	origin_price: "",
// 	price: "",
// 	description: "",
// 	content: "",
// 	is_enabled: 0,
// 	imagesUrl: []
// };

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
	tempProduct,
	closeDelProductModal,
	handleDelProduct,
	delProductModalRef
}) => {

	//定義 Modal 預設值
	// const defaultModalState = {
	// id: "",
	// imageUrl: "",
	// title: "",
	// category: "",
	// unit: "",
	// origin_price: "",
	// price: "",
	// description: "",
	// content: "",
	// is_enabled: 0,
	// imagesUrl: []
	// };
	return (
		<>
			{/* 刪除產品 Modal */}
			<div
				ref={delProductModalRef}
				id="delProductModal"
				className="modal fade"
				tabIndex={-1}
				style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5">刪除產品</h1>
							<button
								onClick={closeDelProductModal}
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body">
							你是否要刪除&nbsp;
							<span className="text-danger fw-bold">{tempProduct.title}?</span>
						</div>
						<div className="modal-footer">
							<button
								onClick={closeDelProductModal}
								type="button"
								className="btn btn-secondary"
							>
								取消
							</button>
							<button onClick={handleDelProduct} type="button" className="btn btn-danger">
								刪除
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DeleteProductModal;