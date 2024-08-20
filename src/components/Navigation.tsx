import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css'; // Archivo de estilos específicos para la navegación

const Navigation: React.FC = () => {
    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse" id="navbarToggleExternalContent">
                    <div className="bg-dark">
                        <ul className="nav flex-row">
                            <li className="nav-item">
                                <Link to="/" className="nav-link text-body-secondary">Registro de Vehículos Ingresados</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/washers" className="nav-link text-body-secondary">Lavadores</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/vehicle-summary" className="nav-link text-body-secondary">Resumen de Vehículos</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/company-records" className="nav-link text-body-secondary">Registro por Empresa</Link>
                            </li>
                            {/* Nuevo elemento para iniciar sesión como administrador */}
                            <li className="nav-item">
                                <Link to="/admin-login" className="nav-link text-body-secondary">Iniciar sesión como administrador</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
