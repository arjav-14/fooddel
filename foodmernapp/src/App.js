import React from "react";
import "./App.css";
import Home from "./screens/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import "../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import Signup from "./screens/Signup.js";
import { CartProvider } from "./components/ContextReducer.js";
import MyOrder from "./screens/MyOrder.js";
import Transactions from "./screens/Transactions.js";
function App() {
  return (
    <CartProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/createuser" element={<Signup />} />
            <Route path="/MyOrderData" element={<MyOrder />} />
            <Route path="/transaction" element={<Transactions />} /> 
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
