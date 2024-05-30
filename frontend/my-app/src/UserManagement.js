import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
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
                if (error.response && error.response.data) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage('An error occurred');
                }
            }
        };

        fetchUsers();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('No token found');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/create_user', {
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
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else {
                setMessage('An error occurred');
            }
        }
    };

    const handleDeleteUser = async (username) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('No token found');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/delete_user', { username }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage(response.data.message);
            if (response.data.status === 'success') {
                setUsers(users.filter(user => user.username !== username));
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else {
                setMessage('An error occurred');
            }
        }
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
                <button type="submit">Create User</button>
            </form>
            {message && <p className="result">{message}</p>}
            <h3>Existing Users</h3>
            <ul>
                {users.map((user) => (
                    <li key={user.username}>
                        {user.username} <button onClick={() => handleDeleteUser(user.username)}>Delete</button>
                    </li>
                ))}
            </ul>
            <Link to="/admin-dashboard">Back to Admin Dashboard</Link>
            <br />
            <Link to="/dashboard">View Business Data</Link>
            <br />
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default UserManagement;
