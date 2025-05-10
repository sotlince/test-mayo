import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "./sass/style.sass";//Aqui estan los estilos globales del SASS
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Debo verificar que la ruta sea correcta

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Ahora todo tiene acceso al contexto */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
