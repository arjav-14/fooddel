
import React, { useState } from "react";
import { useCartDispatch } from "./ContextReducer";

export default function Card(props) {
  const { imgSrc, foodName, price } = props;
  const [quantity, setQuantity] = useState(1);
  const dispatch = useCartDispatch();

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const totalPrice = quantity * price;

  const addToCart = () => {
    dispatch({
      type: "ADD",
      payload: {
        name: foodName,
        price: price, // Send base price (250)
        qty: parseInt(quantity), // Send selected quantity (2)
        imgSrc: imgSrc,
      },
    });
  };

  return (
    <div className="card mt-3 shadow" style={{ width: "18rem", maxHeight: "400px", borderRadius: "15px", overflow: "hidden" }}>
      <img src={imgSrc} className="card-img-top" alt={foodName} style={{ objectFit: "cover", height: "200px" }} />
      <div className="card-body">
        <h5 className="card-title">{foodName}</h5>
        <p className="card-text">Price: ₹{price}/-</p>
        <div className="container w-100 d-flex justify-content-between align-items-center">
          <select className="form-select form-select-sm bg-success text-white" style={{ width: "45%" }} value={quantity} onChange={handleQuantityChange}>
            {Array.from({ length: 6 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <div className="text-center mt-3 fw-bold fs-5">
          Total Price: ₹{totalPrice}/-
          <div>
            <button className="btn bg-success text-white mt-2" style={{ fontSize: "16px" }} onClick={addToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}