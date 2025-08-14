import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';


import App from './App.jsx';
import LoginMongo from './modules/auth/LoginMongo.jsx';
import RegisterMongo from './modules/auth/RegisterMongo.jsx';
import LoginFancy from './modules/auth/LoginFancy.jsx';



function Private({ children }) {
  const token = localStorage.getItem('mongo_token');
  return token ? children : <Navigate to="/login" replace />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginFancy />} />
        <Route path="/register" element={<RegisterMongo />} />
        <Route path="/*" element={<Private><App /></Private>} />
      </Routes>
    </BrowserRouter>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
      toastClassName="bg-cream-50 border-cream-100 text-gray-800"
    />
  </React.StrictMode>
);
