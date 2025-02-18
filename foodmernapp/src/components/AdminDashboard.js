import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const [totalSales, setTotalSales] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTotalSales = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/total-sales');
                if (!response.ok) {
                    throw new Error('Failed to fetch total sales');
                }
                const data = await response.json();
                console.log('Total Sales Data:', data); 
                
                
                const salesValue = parseFloat(data.totalSales[0]?.totalSales) || 0;
                setTotalSales(salesValue); 
            } catch (error) {
                console.error('Error fetching total sales:', error);
                setError(error.message);
            }
        };

        fetchTotalSales();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Admin Dashboard</h2>
            <div className="row mt-4">
                <div className="col-md-3">
                    <Link to="/admin/food-items" className="btn btn-primary w-100">
                        Manage Food Items
                    </Link>
                </div>
                <div className="col-md-3">
                    <Link to="/admin/orders" className="btn btn-info w-100">
                        View Orders
                    </Link>
                </div>
                <div className="col-md-3">
                    <Link to="/admin/users" className="btn btn-warning w-100">
                        View Users
                    </Link>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Total Sales</h5>
                    <p className="card-text">₹{totalSales.toFixed(2)}</p> 
                </div>
            </div>
        </div>
    );
}