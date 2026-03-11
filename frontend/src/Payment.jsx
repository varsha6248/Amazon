import React from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const amount = Number(localStorage.getItem("cartPrice")) || 0;

  const placeOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const checkoutData = JSON.parse(localStorage.getItem("checkoutData")) || {};
    const latestProduct = JSON.parse(localStorage.getItem("latestProduct") || "null");

    console.log("user =", user);
    console.log("checkoutData =", checkoutData);
    console.log("latestProduct =", latestProduct);
    console.log("amount =", amount);

    if (!user?.email) {
      alert("User not found. Please login again.");
      return;
    }

    if (!latestProduct) {
      alert("No product selected.");
      return;
    }

    if (amount <= 0) {
      alert("Invalid order amount.");
      return;
    }

    const orderItems = [
      {
        productId: latestProduct.id,
        title: latestProduct.title,
        price: latestProduct.price,
        image: latestProduct.image,
        quantity: latestProduct.quantity || 1
      }
    ];

    try {
      const response = await fetch("https://amazon-backend-glih.onrender.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userEmail: user.email,
          items: orderItems,
          totalAmount: amount,
          address: checkoutData.address || "",
          orderType: checkoutData.orderType || "Home Delivery",
          deliveryTime: checkoutData.deliveryTime || "",
          date: checkoutData.date || new Date().toLocaleString()
        })
      });

      const data = await response.json();
      console.log("order response =", data);

      if (response.ok) {
        alert("Thank you for your payment! Your order is confirmed.");
        localStorage.setItem("orderPaid", "true");
        localStorage.removeItem("cartPrice");
        localStorage.removeItem("checkoutData");
        localStorage.removeItem("latestProduct");
        navigate("/orders");
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (error) {
      console.log("Place order error:", error);
      alert("Server error while saving order");
    }
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "30px", textAlign: "center" }}>
      <h1>Payment via UPI</h1>
      <p>Total Amount: ₹{amount}</p>

      <p>
        Please scan the QR code below with your UPI app (Google Pay, PhonePe, PayTM, etc.)
        to pay directly to my account.
      </p>

      <img
        src="/upi-qr.png"
        alt="UPI QR Code"
        style={{ width: "250px", height: "250px", margin: "20px 0" }}
      />

      <p>After payment, please take a screenshot and click "I Paid".</p>

      <button
        onClick={placeOrder}
        style={{
          background: "#008cba",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer"
        }}
      >
        I Paid
      </button>
    </div>
  );
};

export default Payment;