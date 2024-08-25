import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Obtén el contenedor raíz del DOM
const rootElement = document.getElementById('root') as HTMLElement;

// Crea el contenedor raíz usando createRoot
const root = ReactDOM.createRoot(rootElement);

// Renderiza tu aplicación dentro del contenedor raíz
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
