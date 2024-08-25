import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault();
        if (username === 'f2' && password === 'parking') {
            localStorage.setItem('adminLoggedIn', 'true');
            navigate('/admin-dashboard');
        } else {
            Swal.fire('Error', 'Usuario o contraseña incorrectos', 'error');
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión como Administrador</h2>
            <form onSubmit={handleLogin}>
                <label>
                    Usuario:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>
                <br />
                <label>
                    Contraseña:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <br />
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default AdminLogin;
