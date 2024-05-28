import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Dashboard = () => {
    const [data, setData] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('No token found');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/dashboard', { 
                    headers: { Authorization: `Bearer ${token}` } 
                });
                console.log('Data received:', response.data.data); // Log received data
                setData(response.data.data);
            } catch (error) {
                if (error.response && error.response.data) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage('An error occurred');
                }
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    // Log the state of data and message
    console.log('Data:', data);
    console.log('Message:', message);

    return (
        <div className="container">
            <h2>Super Secret Dashboard</h2>
            {message && <p className="result">{message}</p>}
            {!message && data.financials && (
                <div>
                    <h3>Financials</h3>
                    <p>Revenue: {data.financials.revenue}</p>
                    <p>Expenses: {data.financials.expenses}</p>
                    <p>Net Profit: {data.financials.net_profit}</p>
                </div>
            )}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
