import React from 'react';
 import ReactDOM from 'react-dom/client';
 import App from './App';
 import VistaPrevia from './VistaPrevia';
 import { BrowserRouter, Routes, Route } from 'react-router-dom';

 const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
 );
 root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/preview" element={<VistaPrevia />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
 );
