import React from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const checkoutData = JSON.parse(localStorage.getItem("checkoutData")) || {};
  const latestProduct = JSON.parse(localStorage.getItem("latestProduct") || "null");
  const amount = Number(localStorage.getItem("cartPrice")) || 0;

  const placeOrder = async () => {
    if (!user?.email) {
      alert("User not found. Please login again.");
      return;
    }

    if (!latestProduct) {
      alert("No product selected.");
      return;
    }

    if (!checkoutData.address) {
      alert("Checkout details are missing.");
      return;
    }

    const orderItems = [
      {
        productId: latestProduct.id || latestProduct._id,
        title: latestProduct.title,
        price: latestProduct.price,
        image: latestProduct.image,
        quantity: latestProduct.quantity || 1
      }
    ];

    try {
      const response = await fetch("https://amazon-backend-uy18.onrender.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userEmail: user.email,
          items: orderItems,
          totalAmount: amount,
          address: checkoutData.address,
          orderType: checkoutData.orderType,
          deliveryTime: checkoutData.deliveryTime,
          date: checkoutData.date
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

  if (!latestProduct) {
    return <h2 style={{ padding: "20px" }}>No product selected</h2>;
  }

  return (
    <div style={{ fontFamily: "Arial", padding: "30px", textAlign: "center" }}>
      <h1>Payment via UPI</h1>

      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto 20px auto",
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "left"
        }}
      >
        <h2>Order Summary</h2>
        <img
          src={latestProduct.image}
          alt={latestProduct.title}
          style={{ width: "180px", borderRadius: "10px", marginBottom: "10px" }}
        />
        <p><b>Product:</b> {latestProduct.title}</p>
        <p><b>Quantity:</b> {latestProduct.quantity || 1}</p>
        <p><b>Final Amount:</b> ₹{amount}</p>
        <p><b>Address:</b> {checkoutData.address}</p>
        <p><b>Order Type:</b> {checkoutData.orderType}</p>
        <p><b>Delivery Time:</b> {checkoutData.deliveryTime}</p>
        <p><b>Date:</b> {checkoutData.date}</p>
      </div>

      <p>
        Please scan the QR code below with your UPI app (Google Pay, PhonePe, PayTM, etc.)
        to pay directly.
      </p>

      <img
        src="/upi-qr.png"
        alt="UPI QR Code"
        style={{ width: "250px", height: "250px", margin: "20px 0" }}
      />

      <p>After payment, please click "I Paid".</p>

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