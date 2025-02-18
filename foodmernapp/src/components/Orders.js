import React, { useEffect, useState } from 'react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch orders');
                }
                const data = await response.json();
                
                setOrders(data.orderData || []); 
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError(error.message);
            }
        };

        fetchOrders();
    }, []);

    const handleDelete = async (orderId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders/${orderId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete order');
            }

            // Update the state to remove the deleted order
            setOrders(orders.filter(order => order.id !== orderId));
        } catch (error) {
            console.error('Error deleting order:', error);
            setError(error.message);
        }
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Orders</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                {Array.isArray(currentOrders) && currentOrders.length > 0 ? (
                    currentOrders.map(order => (
                        <div key={order.id} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Order #{order.id}</h5>
                                    <p className="card-text">Email: {order.email}</p>
                                    <p className="card-text">Date: {order.order_date}</p>
                                    <p className="card-text">Status: 
                                        <span className={`badge ${order.status === 'Success' ? 'bg-success' : 'bg-warning'}`}>
                                            {order.status}
                                        </span>
                                    </p>
                                    
                                    <h6>Items:</h6>
                                    <ul>
                                        {Array.isArray(order.order_data) && order.order_data.length > 0 ? (
                                            order.order_data.map((item, index) => (
                                                <li key={index}>
                                                    {item.foodName || 'Unknown'} - Quantity: {item.quantity} - Total Price: ₹{item.totalPrice || '0.00'}
                                                </li>
                                            ))
                                        ) : (
                                            <li>No items in this order.</li>
                                        )}
                                    </ul>
                                    <button className='btn btn-danger mt-3' onClick={() => handleDelete(order.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-info">No orders found.</div>
                    </div>
                )}
            </div>
            {/* Pagination Controls */}
            <div className="d-flex justify-content-center mt-4">
                <nav>
                    <ul className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Orders;