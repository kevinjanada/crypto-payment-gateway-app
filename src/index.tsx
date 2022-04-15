import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'flowbite';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { TorusProvider } from "./contexts/torus";
// import { OpenLoginProvider } from './contexts/openlogin';
import { AuthProvider } from './contexts/auth';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <TorusProvider>
      {/* <OpenLoginProvider> */}
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      {/* </OpenLoginProvider> */}
    </TorusProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
