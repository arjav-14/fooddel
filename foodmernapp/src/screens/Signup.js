import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", geolocation: "" });
    const [message, setMessage] = useState(""); // State for messages (success/error)

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        console.log(credentials); 

        const response = await fetch("http://localhost:4000/api/createuser", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: credentials.name,
                email: credentials.email,
                password: credentials.password,
                geolocation: credentials.geolocation || "Unknown location"  
            })
        });

        const json = await response.json();
        console.log(json);

        if (!json.success) {
            setMessage("User creation failed. Please try again!"); // Error message
        } else {
            setMessage("User created successfully! You can now login."); // Success message
        }
    };

    const onChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    return (
        <div
            style={{
                height: '100vh', // Full viewport height
                backgroundImage: `url('https://img.freepik.com/free-photo/sideways-asian-dish-with-copy-space_23-2148242494.jpg')`,
                backgroundSize: 'cover', // Ensures the image covers the entire screen
                backgroundPosition: 'center', // Centers the image
                display: 'flex', // Flexbox to center the form
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                padding: '20px', // Padding to avoid form sticking to edges
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    padding: '2rem',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    maxWidth: '500px',
                    width: '100%',
                    backgroundColor: '#ffffff', // Non-transparent background for form
                    opacity: '0.9', // Slight transparency for the form
                }}
            >
                <form onSubmit={handleSubmit}>
                    {/* Display message here */}
                    {message && (
                        <div
                            className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}
                            role="alert"
                        >
                            {message}
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label text-black">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={credentials.name}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label text-black">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={credentials.email}
                            onChange={onChange}
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            required
                        />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label text-black">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={credentials.password}
                            onChange={onChange}
                            id="exampleInputPassword1"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputgeolocation1" className="form-label text-black">Address</label>
                        <input
                            type="text"
                            className="form-control"
                            name="geolocation"
                            value={credentials.geolocation}
                            onChange={onChange}
                            id="exampleInputgeolocation1"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Submit</button>
                    <Link to="/login" className="btn btn-danger w-100 mt-3">Already a user?</Link>
                </form>
            </div>
        </div>
    );
}
