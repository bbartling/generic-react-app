import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

interface Data {
    total_users?: number;
    system_status?: string;
}

const AdminDashboard: React.FC = () => {
    const [data, setData] = useState<Data>({});
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('No token found');
                return;
            }

            try {
                const response = await axios.get('/dashboard', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Data received:', response.data.data);
                setData(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                if (axios.isAxiosError(error) && error.response) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage('An error occurred. Please try again later.');
                }
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleViewBusinessData = () => {
        navigate('/dashboard');
    };

    const handleManageUsers = () => {
        navigate('/user-management');
    };

    return (
        <div className="container">
            <h2>Admin Dashboard</h2>
            {message && <p className="result alert-danger">{message}</p>}
            {!message && (
                <div>
                    <div className="card">
                        <h3>System Status</h3>
                        <p>Total Users: {data.total_users}</p>
                        <p>System Status: {data.system_status}</p>
                    </div>
                    <div className="card">
                        <button className="button" onClick={handleViewBusinessData}>
                            View Business Data
                        </button>
                        <button className="button" onClick={handleManageUsers}>
                            Manage Users
                        </button>
                    </div>
                    <button className="button logout" onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
