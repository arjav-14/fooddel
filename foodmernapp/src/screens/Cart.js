// import React from 'react';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { useCart, useCartDispatch } from '../components/ContextReducer';
// import { useNavigate } from 'react-router-dom';

// export default function Cart() {
//     const navigate = useNavigate();
//     const data = useCart();
//     const dispatch = useCartDispatch();

//     if (data.length === 0) {
//         return (
//             <div>
//                 <div className="m-5 w-100 text-center fs-3">The Cart is Empty!</div>
//             </div>
//         );
//     }

//     const handleCheckOut = async () => {
//         const userEmail = localStorage.getItem("userEmail");
//         if (!userEmail) {
//             alert("Please log in first.");
//             return;
//         }

//         // Format current date for MySQL datetime format
//         const now = new Date();
//         const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

//         const totalPrice = data.reduce((total, food) => total + food.price , 0);
//         const formattedOrderData = data.map(item => ({
//             foodName: item.name,
//             quantity: item.qty,
//             totalPrice: item.price,
//         }));
//         try {
//             const response = await fetch("http://localhost:4000/api/orderData", {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     order_data: formattedOrderData,
//                     email: userEmail,
//                     order_date: formattedDate,
//                     total_amount: totalPrice
//                 }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 console.error("Error placing order:", errorData.message || response.statusText);
//                 alert(`Failed to place order: ${errorData.message || "Unknown error"}`);
//                 return;
//             }

//             const orderData = await response.json();
//             dispatch({ type: "DROP" }); // Clear cart after successful order
            
//             navigate('/transaction', { 
//                 state: { 
//                     transactionId: orderData.transactionId,
//                     orderDate: formattedDate,
//                     totalAmount: totalPrice,
//                     status: 'Success'
//                 } 
//             });
//         } catch (error) {
//             console.error("Error during checkout:", error);
//             alert('An error occurred while placing the order. Please try again later.');
//         }
//     };

//     const totalPrice = data.reduce((total, food) => total + food.price, 0);

//     return (
//         <div>
//             <div className="container m-auto mt-5 table-responsive">
//                 <table className="table table-hover">
//                     <thead className="text-success fs-4">
//                         <tr>
//                             <th scope="col">#</th>
//                             <th scope="col">Name</th>
//                             <th scope="col">Quantity</th>
//                             <th scope="col">Amount</th>
//                             <th scope="col">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {data.map((food, index) => (
//                             <tr key={index}>
//                                 <th scope="row">{index + 1}</th>
//                                 <td>{food.name}</td>
//                                 <td>{food.qty}</td>
//                                 <td>₹{Number(food.price).toFixed(2)}/-</td>
//                                 <td>
//                                     <button
//                                         type="button"
//                                         className="btn p-0"
//                                         onClick={() => dispatch({ type: "REMOVE", index })}
//                                     >
//                                         <DeleteIcon />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//                 <div>
//                     <h1 className="fs-2">Total Price: ₹{Number(totalPrice).toFixed(2)}/-</h1>
//                 </div>
//                 <div>
//                     <button className="btn bg-success mt-5 text-white" onClick={handleCheckOut}>
//                         Check Out
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart, useCartDispatch } from '../components/ContextReducer';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const navigate = useNavigate();
    const data = useCart();
    const dispatch = useCartDispatch();

    if (data.length === 0) {
        return (
            <div>
                <div className="m-5 w-100 text-center fs-3">The Cart is Empty!</div>
            </div>
        
        );
    }

    const handleCheckOut = async () => {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
            alert("Please log in first.");
            return;
        }

        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

        const totalPrice = data.reduce((total, food) => total + (food.price * food.qty), 0);
        
        const formattedOrderData = data.map(item => ({
            foodName: item.name,
            quantity: item.qty,
            totalPrice: item.price * item.qty, // Calculate individual item total
        }));

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orderData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_data: formattedOrderData,
                    email: userEmail,
                    order_date: formattedDate,
                    total_amount: totalPrice
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error placing order:", errorData.message || response.statusText);
                alert(`Failed to place order: ${errorData.message || "Unknown error"}`);
                return;
            }

            const orderData = await response.json();
            dispatch({ type: "DROP" });
            
            navigate('/transaction', { 
                state: { 
                    transactionId: orderData.transactionId,
                    orderDate: formattedDate,
                    totalAmount: totalPrice,
                    status: 'Success'
                } 
            });
        } catch (error) {
            console.error("Error during checkout:", error);
            alert('An error occurred while placing the order. Please try again later.');
        }
    };

    return (
        <div>
            <div className="container m-auto mt-5 table-responsive">
                <table className="table table-hover">
                    <thead className="text-success fs-4">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Price/Item</th>
                            <th scope="col">Total</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((food, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{food.name}</td>
                                <td>{food.qty || 1}</td>
                                <td>₹{(food.price || 0).toFixed(2)}/-</td>
                                <td>₹{((food.price || 0) * (food.qty || 1)).toFixed(2)}/-</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn p-0"
                                        onClick={() => dispatch({ type: "REMOVE", index })}
                                    >
                                        <DeleteIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <h1 className="fs-2">
                        Total Price: ₹{data.reduce((total, food) => total + ((food.price || 0) * (food.qty || 1)), 0).toFixed(2)}/-
                    </h1>
                </div>
                <div>
                    <button className="btn bg-success mt-5 text-white" onClick={handleCheckOut}>
                        Check Out
                    </button>
                </div>
            </div>
        </div>
    );
}