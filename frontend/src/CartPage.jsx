import React, { useContext } from "react";
import { CartContext } from "./CartContent";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
const { cartItems = [] } = useContext(CartContext);
const navigate = useNavigate();

// Calculate total price
const totalPrice = cartItems.reduce((total, item) => {
return total + item.price * item.quantity;
}, 0);

const handleCheckout = () => {
localStorage.setItem("cartPrice", totalPrice);
navigate("/checkout");
};

return (
<div style={{ padding: "40px" }}> <h1>Your Cart</h1>

```
  {cartItems.length === 0 ? (
    <p>No items in cart</p>
  ) : (
    <>
      {cartItems.map((item, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
          }}
        >
          <h3>{item.title}</h3>
          <p>Price: ₹{item.price}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Total: ₹{item.price * item.quantity}</p>
        </div>
      ))}

      <h2>Total Price: ₹{totalPrice}</h2>

      <button
        onClick={handleCheckout}
        style={{
          padding: "10px 20px",
          backgroundColor: "#fb641b",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Proceed to Checkout
      </button>
    </>
  )}
</div>

);
};

export default CartPage;
