import React, { useEffect, useState } from 'react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Number of users per page

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError(error.message);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/users/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete user');
            }

            // Update the state to remove the deleted user
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
            setError(error.message);
        }
    };

    // Pagination logic
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Users</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                {currentUsers.length > 0 ? (
                    currentUsers.map(user => (
                        <div key={user.id} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{user.name}</h5>
                                    <p className="card-text">Email: {user.email}</p>
                                    <p className="card-text">Role: {user.role || 'User'}</p>
                                    
                                    <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-info">No users found.</div>
                    </div>
                )}
            </div>
            {/* Pagination Controls using Flexbox */}
            <div className="d-flex justify-content-center mt-4">
                <nav>
                    <ul className="pagination d-flex flex-wrap justify-content-center">
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

export default Users;