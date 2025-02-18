// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

// export default function AdminDashboard() {
//     const [totalSales, setTotalSales] = useState(0);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchTotalSales = async () => {
//             try {
//                 const response = await fetch('http://localhost:4000/api/total-sales' , {
//                   method : 'GET'
//                 });
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch total sales');
//                 }
//                 const data = await response.json();
//                 console.log('Total Sales Data:', data); // Log the response for debugging
//                 setTotalSales(data.totalSales); // Set the totalSales state
//             } catch (error) {
//                 console.error('Error fetching total sales:', error);
//                 setError(error.message);
//             }
//         };

//         fetchTotalSales();
//     }, []);

//     return (
//         <div className="container mt-4">
//             <h2>Admin Dashboard</h2>
//             <div className="row mt-4">
//                 <div className="col-md-3">
//                     <Link to="/admin/food-items" className="btn btn-primary w-100">
//                         Manage Food Items
//                     </Link>
//                 </div>
//                 <div className="col-md-3">
//                     <Link to="/admin/orders" className="btn btn-info w-100">
//                         View Orders
//                     </Link>
//                 </div>
//                 <div className="col-md-3">
//                     <Link to="/admin/users" className="btn btn-warning w-100">
//                         View Users
//                     </Link>
//                 </div>
//             </div>
//             <div className="card">
//                 <div className="card-body">
//                     <h5 className="card-title">Total Sales</h5>
//                     <p className="card-text">₹{totalSales.toFixed(2)}</p> 
//                 </div>
//             </div>
//         </div>
//     );
// }

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const [totalSales, setTotalSales] = useState(0);
    const [error, setError] = useState(null);
    const [newCategory, setNewCategory] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchTotalSales = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/total-sales', {
                    method: 'GET'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch total sales');
                }
                const data = await response.json();
                
                setTotalSales(data.totalSales);
            } catch (error) {
                console.error('Error fetching total sales:', error);
                setError(error.message);
            }
        };

        fetchTotalSales();
    }, []);

    const handleAddCategory = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/addFoodCategory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category_name: newCategory }),
            });

            if (!response.ok) {
                throw new Error('Failed to add food category');
            }

            const data = await response.json();
            
            setNewCategory(''); // Reset the input field
            setShowModal(false); // Close the modal
        } catch (error) {
            console.error('Error adding food category:', error);
            setError(error.message);
        }
    };

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
                <div className="col-md-3">
                    <button className="btn btn-success w-100" onClick={() => setShowModal(true)}>
                        Add Food Category
                    </button>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Total Sales</h5>
                    <p className="card-text">₹{totalSales.toFixed(2)}</p>
                </div>
            </div>

            {showModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Add Food Category</h2>
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            required
                        />
                        <button onClick={handleAddCategory}>Add Category</button>
                    </div>
                </div>
            )}
        </div>
    );
}