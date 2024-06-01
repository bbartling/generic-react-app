import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

interface Financials {
    revenue: number;
    expenses: number;
    net_profit: number;
}

interface Data {
    financials?: Financials;
}

const Dashboard: React.FC = () => {
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

    return (
        <div className="container">
            <div className="card">
                <h2>Business Dashboard</h2>
                {message && <p className="result alert-danger">{message}</p>}
                {!message && data.financials && (
                    <div>
                        <h3>Financials</h3>
                        <p>Revenue: {data.financials.revenue}</p>
                        <p>Expenses: {data.financials.expenses}</p>
                        <p>Net Profit: {data.financials.net_profit}</p>
                    </div>
                )}
                <div className="navbar">
                    <button className="button logout" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
