import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

interface User {
    username: string;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('No token found');
                return;
            }

            try {
                const response = await axios.get('/get_users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data.users);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage('An error occurred. Please try again later.');
                }
            }
        };

        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('No token found');
            return;
        }

        try {
            const response = await axios.post('/create_user', {
                username,
                password,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage(response.data.message);
            if (response.data.status === 'success') {
                setUsers([...users, { username }]);
                setUsername('');
                setPassword('');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setMessage(error.response.data.message);
            } else {
                setMessage('An error occurred. Please try again later.');
            }
        }
    };

    const handleDeleteUser = async (username: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('No token found');
            return;
        }

        try {
            const response = await axios.post('/delete_user', { username }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage(response.data.message);
            if (response.data.status === 'success') {
                setUsers(users.filter(user => user.username !== username));
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setMessage(error.response.data.message);
            } else {
                setMessage('An error occurred. Please try again later.');
            }
        }
    };

    const handleBackToAdminDashboard = () => {
        navigate('/admin-dashboard');
    };

    const handleViewBusinessData = () => {
        navigate('/dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="container">
            <h2>User Management</h2>
            <form onSubmit={handleCreateUser}>
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
                <button type="submit" className="button">Create User</button>
            </form>
            {message && <p className="result alert-danger">{message}</p>}
            <h3>Existing Users</h3>
            <ul>
                {users.map((user) => (
                    <li key={user.username}>
                        {user.username} <button className="button delete" onClick={() => handleDeleteUser(user.username)}>Delete</button>
                    </li>
                ))}
            </ul>
            <button className="button" onClick={handleBackToAdminDashboard}>Back to Admin Dashboard</button>
            <button className="button" onClick={handleViewBusinessData}>View Business Data</button>
            <button className="button logout" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default UserManagement;
