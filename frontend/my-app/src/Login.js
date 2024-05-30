import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Submitting login form with:", { username, password });
            const response = await axios.post('/login', { username, password }); // Use relative path
            console.log("Login response:", response.data);

            if (response.data.status === 'success') {
                localStorage.setItem('token', response.data.token);
                const payload = JSON.parse(atob(response.data.token.split('.')[1]));
                if (payload.role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error during login:", error);

            if (error.response && error.response.status === 401) {
                setMessage('Bad username or password');
            } else {
                setMessage('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p className="result">{message}</p>}
        </div>
    );
};

export default Login;
