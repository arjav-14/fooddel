import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function MyOrder() {
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const fetchMyOrder = async () => {
        try {
            const email = localStorage.getItem('userEmail');
            if (!email) {
                setError('Please login to view orders');
                navigate('/login');
                return;
            }
            const response = await fetch("http://localhost:4000/api/myOrderData", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();

            if (data && data.orderData) {
                setOrderData(data.orderData);
            } else {
                setError('No orders found');
            }
        } catch (error) {
            console.error('Error fetching order data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyOrder();
    }, []);

    const handleOrderHistory = () => {
        navigate('/transaction');
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="container mt-5 text-center">Loading...</div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className='container mt-4'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fs-2">My Orders</h2>
                    <button 
                        className="btn btn-success" 
                        onClick={handleOrderHistory}
                    > 
                        View Transaction History
                    </button>
                </div>

                {error ? (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                ) : orderData.length === 0 ? (
                    <div className="text-center fs-4">No orders found.</div>
                ) : (
                    <div className='row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4'>
                        {orderData.map((data, index) => (
                            data.order_data && data.order_data.length > 0 && 
                            data.order_data.flat().reverse().map((item, idx) => (
                                <div key={`${index}-${idx}`} className="col">
                                    {item.Order_date && (
                                        <div className='mb-3'>
                                            <strong>Order Date:</strong> {item.Order_date}
                                            <hr />
                                        </div>
                                    )}
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">{item.foodName || "Product Name"}</h5>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <div>
                                                    <span className="badge bg-secondary me-2">
                                                        Qty: {item.quantity}
                                                    </span>
                                                    {item.portion && (
                                                        <span className="badge bg-info me-2">
                                                            {item.portion}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className='text-success fw-bold'>
                                                    ₹{item.totalPrice}/-
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}