import React, { useEffect, useState } from 'react';

const FoodItems = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [newItem, setNewItem] = useState({ name: '', price: '', img: '', category_id: '' });

    useEffect(() => {
        const fetchFoodItems = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/food-items');
                if (!response.ok) {
                    throw new Error('Failed to fetch food items');
                }
                const data = await response.json();
                setFoodItems(data);
            } catch (error) {
                console.error('Error fetching food items:', error);
                setError(error.message);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/categories');
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError(error.message);
            }
        };

        fetchFoodItems();
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/api/food-items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (!response.ok) {
                throw new Error('Failed to add food item');
            }

            const addedItem = await response.json();
            setFoodItems([...foodItems, addedItem]);
            setNewItem({ name: '', price: '', img: '', category_id: '' }); // Reset form
        } catch (error) {
            console.error('Error adding food item:', error);
            setError(error.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Food Items</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <ul className="list-group">
                {foodItems.map(item => (
                    <li key={item.id} className="list-group-item">
                        <img src={item.img} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />
                        <strong>{item.name}</strong> - ₹{item.price}
                    </li>
                ))}
            </ul>
            <h3>Add New Food Item</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Food Name" value={newItem.name} onChange={handleChange} required />
                <input type="number" name="price" placeholder="Price" value={newItem.price} onChange={handleChange} required />
                <input type="text" name="img" placeholder="Image URL" value={newItem.img} onChange={handleChange} required />
                <select name="category_id" value={newItem.category_id} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                    ))}
                </select>
                <button type="submit" className="btn btn-success">Add Item</button>
            </form>
        </div>
    );
};

export default FoodItems;