import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { hideToast } from '../redux/slices/toastSlice';

export default function Toast() {
  const { message, visible } = useSelector((state: RootState) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [visible, dispatch]);

  if (!visible) return null; // Don't render anything if not visible

  const isRemoval = message.includes('移除');
  const toastHeaderClassName = isRemoval
    ? "toast-header bg-danger text-white"
    : "toast-header bg-success text-white";

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1500 }}>
      <div 
        className="toast show" 
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
        style={{ 
          opacity: 1,
          backgroundColor: '#fff',
          boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
        }}
      >
        <div className={toastHeaderClassName}>
          <strong className="me-auto">通知</strong>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => dispatch(hideToast())}
          ></button>
        </div>
        <div className="toast-body">{message}</div>
      </div>
    </div>
  );
}

