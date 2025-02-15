import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            const userEmail = localStorage.getItem("userEmail");
            
            if (!userEmail) {
                setError("Please login to view transactions");
                navigate("/login");
                return;
            }
    
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/transactions/${userEmail}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch transactions');
                }
    
                const data = await response.json();
                console.log("Fetched transactions:", data); // Debug log
                setTransactions(Array.isArray(data) ? data : []);
                
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchTransactions();
    }, [navigate]);

    if (loading) {
        return <div className="container mt-5 text-center">Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="container m-auto mt-5">
                <h1 className="fs-2">Transaction History</h1>
                {error ? (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="m-5 w-100 text-center fs-3">No Transactions Found!</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="text-success fs-4">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Transaction ID</th>
                                    <th scope="col">Order Date</th>
                                    <th scope="col">Total Amount</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction, index) => (
                                    <tr key={transaction.transactionId || `transaction-${index}`}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{transaction.transactionId || "N/A"}</td>
                                        <td>{new Date(transaction.orderDate).toLocaleDateString()}</td>
                                        <td>₹{parseFloat(transaction.totalAmount || 0).toFixed(2)}/-</td>
                                        <td>
                                            <span className={`badge ${
                                                transaction.status === 'Success' ? 'bg-success' : 
                                                transaction.status === 'Pending' ? 'bg-warning' : 
                                                'bg-danger'
                                            }`}>
                                                {transaction.status || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                )}
            </div>
        </>
    );
};

export default Transactions; 