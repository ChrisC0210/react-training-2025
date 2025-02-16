// src/components/Product/type.ts
export interface Product {
  id: number;
  title: string;
  origin_price: number;
  price: number;
  is_enabled: boolean;
  imageUrl: string;
  category: string;
  unit: string;
  description: string;
  content: string;
  imagesUrl: string[];
}

// Modal 用的預設值 defaultModalState
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

// 分頁資訊
export interface PageInfo {
  total_pages: number;
  current_page: number;
  has_pre?: boolean;
  has_next?: boolean;
  category?: string;
}
