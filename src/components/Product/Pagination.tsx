import React from "react";

interface PageInfo {
  total_pages: number;
  current_page: number;
  has_pre?: boolean;
  has_next?: boolean;
}

interface PaginationProps {
  pageInfo: PageInfo;
  handlePageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageInfo, handlePageChange }) => {
  const { total_pages, current_page, has_pre, has_next } = pageInfo;

  return (
    <nav>
      <ul className="pagination">
        {/* 上一頁 */}
        <li className={`page-item ${!has_pre ? "disabled" : ""}`}>
          <button
            onClick={() => has_pre && handlePageChange(current_page - 1)}
            className="page-link"
            disabled={!has_pre}
          >
            上一頁
          </button>
        </li>

        {/* 頁碼 */}
        {Array.from({ length: total_pages }, (_, index) => (
          <li key={index} className={`page-item ${current_page === index + 1 ? "active" : ""}`}>
            <button
              onClick={() => handlePageChange(index + 1)}
              className="page-link"
            >
              {index + 1}
            </button>
          </li>
        ))}

        {/* 下一頁 */}
        <li className={`page-item ${!has_next ? "disabled" : ""}`}>
          <button
            onClick={() => has_next && handlePageChange(current_page + 1)}
            className="page-link"
            disabled={!has_next}
          >
            下一頁
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
