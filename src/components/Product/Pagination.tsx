// import React, { useEffect, useRef, useState } from 'react';
import React from 'react';
// import { PageInfo } from './Type';

interface PaginationProps {
  pageInfo: PageInfo;
  handlePageChange: (page: number) => void;
}
  interface PageInfo {
    total_pages: number;
    current_page: number;
    has_pre?: boolean;
    has_next?: boolean;
  }


// function Pagination() {
const Pagination: React.FC<PaginationProps> = ({ pageInfo, handlePageChange }) => {
  const { total_pages, current_page, has_pre, has_next } = pageInfo;

  // const [pageInfo, setPageInfo] = useState<PageInfo>({ total_pages: 0, current_page: 1 }); // 頁面資訊
  // const handlePageChange = (page: number) => {
  //   // getProducts(page);
  //   setPageInfo((prevPageInfo) => ({
  //     ...prevPageInfo,
  //     current_page: page
  //   }));
  // }
  return <>
    <nav>
      <ul className="pagination">
        <li className={`page-item ${!has_pre && 'disabled'}`}>
          <a onClick={() => handlePageChange(current_page - 1)} className="page-link" href="#">
            上一頁
          </a>
        </li>
        {Array.from({ length: total_pages }).map((_, index) => (
          <li key={index} className={`page-item ${current_page === index + 1 && 'active'}`}>
            <a onClick={() => handlePageChange(index + 1)} className="page-link" href="#">
              {index + 1}
            </a>
          </li>
        ))}
        <li className={`page-item ${!has_next && 'disabled'}`}>
          <a onClick={() => handlePageChange(current_page + 1)} className="page-link" href="#">
            下一頁
          </a>
        </li>
      </ul>
    </nav>
  </>
    ;
}

export default Pagination;