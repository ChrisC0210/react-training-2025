import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App'; // Use App component as the main entry point
import RouteConf from './RouteConf';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouteConf/>
  </React.StrictMode>,
);
