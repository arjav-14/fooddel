// import React, { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import Card from "../components/Card";
// import { getRandomImages } from "../components/Carousel"; 

// export default function Home() {
//     const [foodCategories, setFoodCategories] = useState([]);
//     const [foodItems, setFoodItems] = useState([]);
//     const [search, setSearch] = useState("");
//     const [filteredItems, setFilteredItems] = useState([]);
//     const [carouselImages, setCarouselImages] = useState([]);
//   const [currentPage , setCurrentPage] = useState(1);
//   const itemsPerPage = 6;
//     const loadData = async () => {
//         try {
//             const response = await fetch("http://localhost:4000/api/foodData", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });
//             const [items, categories] = await response.json();
//             setFoodItems(items);
//             setFoodCategories(categories);
//             setFilteredItems(items);
//         } catch (error) {
//             console.error("Error fetching food data:", error);
//         }
//     };

//     useEffect(() => {
//         loadData();
//         setCarouselImages(getRandomImages(3));
//     }, []);

//     const handleSearch = (searchTerm) => {
//         setSearch(searchTerm);
//         if (searchTerm) {
//             const term = searchTerm.toLowerCase();
//             const filtered = foodItems.filter(item => {
//                 const matchesCategory = item.category_name?.toLowerCase().includes(term);
//                 const matchesName = item.name.toLowerCase().includes(term);
//                 return matchesCategory || matchesName;
//             });
//             setFilteredItems(filtered);
//         } else {
//             setFilteredItems(foodItems);
//         }
//     };
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

//     const paginate = (pageNumber) => setCurrentPage(pageNumber);

//     // Calculate total pages
//     const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

//     // Generate page numbers
//     const pageNumbers = [];
//     for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//     }
//     return (
//         <div className="min-vh-100 d-flex flex-column">
//             <Navbar />
            
//             {/* Hero Section with Carousel and Search */}
//             <div className="hero-section mb-5">
//                 <div className="carousel-container" style={{ height: "500px", position: "relative" }}>
//                     <div id="foodCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
//                         <div className="carousel-inner">
//                             {carouselImages.map((img, index) => (
//                                 <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
//                                     <img
//                                         src={img}
//                                         className="d-block w-100"
//                                         style={{ height: "500px", objectFit: "cover" }}
//                                         alt="Food"
//                                     />
//                                 </div>
//                             ))}
//                         </div>
                        
//                         {/* Search Overlay */}
//                         <div className="carousel-caption" style={{ zIndex: "10" }}>
//                             <div className="search-container w-75 mx-auto">
//                                 <div className="input-group">
//                                     <input
//                                         type="search"
//                                         className="form-control"
//                                         placeholder="Search by category (e.g., Main Course, Desserts)..."
//                                         value={search}
//                                         onChange={(e) => handleSearch(e.target.value)}
//                                     />
//                                     <button 
//                                         className="btn btn-outline-light"
//                                         onClick={() => handleSearch("")}
//                                     >
//                                         Clear
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

            

//             {/* Food Items Grid */}
//             <div className="container flex-grow-1 mb-5">
//                 {filteredItems.length > 0 ? (
//                     <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
//                         {filteredItems.map((item, index) => (
//                             <div key={index} className="col">
//                                 <Card
//                                     foodName={item.name}
//                                     price={item.price}
//                                     imgSrc={item.img}
//                                     category={item.category_name}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center mt-4 fs-4">
//                         No food items found for "{search}"
//                     </div>
//                 )}
//             </div>
//             <nav aria-label="Food items pagination">
//                             <ul className="pagination justify-content-center">
//                                 <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                                     <button 
//                                         className="page-link" 
//                                         onClick={() => paginate(currentPage - 1)}
//                                         disabled={currentPage === 1}
//                                     >
//                                         Previous
//                                     </button>
//                                 </li>

//                                 {pageNumbers.map(number => (
//                                     <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
//                                         <button
//                                             className="page-link"
//                                             onClick={() => paginate(number)}
//                                         >
//                                             {number}
//                                         </button>
//                                     </li>
//                                 ))}
//                                 <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                                     <button 
//                                         className="page-link" 
//                                         onClick={() => paginate(currentPage + 1)}
//                                         disabled={currentPage === totalPages}
//                                     >
//                                         Next
//                                     </button>
//                                 </li>
//                             </ul>
//                         </nav>

//                         <div className="text-center mt-2">
//                             Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} items
//                         </div>
//                     </>
//                 ) : (
//                     <div className="text-center mt-4 fs-4">
//                         No food items found for "{search}"
//                     </div>
//                 )}
//             </div>
//             <Footer />
//         </div>
//     );
// }

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { getRandomImages } from "../components/Carousel"; 

export default function Home() {
    const [foodCategories, setFoodCategories] = useState([]);
    const [foodItems, setFoodItems] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [carouselImages, setCarouselImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const loadData = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/foodData",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const [items, categories] = await response.json();
            setFoodItems(items);
            setFoodCategories(categories);
            setFilteredItems(items);
        } catch (error) {
            console.error("Error fetching food data:", error);
        }
    };

    useEffect(() => {
        loadData();
        setCarouselImages(getRandomImages(3));
    }, []);

    const handleSearch = (searchTerm) => {
        setSearch(searchTerm);
        setCurrentPage(1); // Reset to first page when searching
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const filtered = foodItems.filter(item => {
                const matchesCategory = item.category_name?.toLowerCase().includes(term);
                const matchesName = item.name.toLowerCase().includes(term);
                return matchesCategory || matchesName;
            });
            setFilteredItems(filtered);
        } else {
            setFilteredItems(foodItems);
        }
    };

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Generate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="min-vh-100 d-flex flex-column">
            <Navbar />
            
            {/* Hero Section with Carousel and Search */}
            <div className="hero-section mb-5">
                <div className="carousel-container" style={{ height: "500px", position: "relative" }}>
                    <div id="foodCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {carouselImages.map((img, index) => (
                                <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                    <img
                                        src={img}
                                        className="d-block w-100"
                                        style={{ height: "500px", objectFit: "cover" }}
                                        alt="Food"
                                    />
                                </div>
                            ))}
                        </div>
                        
                        {/* Search Overlay */}
                        <div className="carousel-caption" style={{ zIndex: "10" }}>
                            <div className="search-container w-75 mx-auto">
                                <div className="input-group">
                                    <input
                                        type="search"
                                        className="form-control"
                                        placeholder="Search by category (e.g., Main Course, Desserts)..."
                                        value={search}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                    <button 
                                        className="btn btn-outline-light"
                                        onClick={() => handleSearch("")}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container flex-grow-1 mb-5">
                {filteredItems.length > 0 ? (
                    <>
                        {/* Food Items Grid */}
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
                            {currentItems.map((item, index) => (
                                <div key={index} className="col">
                                    <Card
                                        foodName={item.name}
                                        price={item.price}
                                        imgSrc={item.img}
                                        category={item.category_name}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <nav aria-label="Food items pagination">
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                </li>

                                {pageNumbers.map(number => (
                                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => paginate(number)}
                                        >
                                            {number}
                                        </button>
                                    </li>
                                ))}

                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>

                        {/* Pagination Info */}
                        <div className="text-center mt-2">
                            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} items
                        </div>
                    </>
                ) : (
                    <div className="text-center mt-4 fs-4">
                        No food items found for "{search}"
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}