import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const initialPrice =
    Number(params.get("price")) || Number(localStorage.getItem("cartPrice")) || 0;

  const [price, setPrice] = useState(initialPrice);
  const [showInput, setShowInput] = useState(false);
  const [offer, setOffer] = useState("");
  const [address, setAddress] = useState("");
  const [orderType, setOrderType] = useState("Home Delivery");

  useEffect(() => {
    const latestProduct = localStorage.getItem("latestProduct");
    if (!latestProduct) {
      alert("No product selected. Please click Buy Now from a product page.");
      navigate("/home");
    }
  }, [navigate]);

  const minimumPrice = initialPrice - 150;

  const handleBargain = () => setShowInput(true);

  const submitOffer = () => {
    const offerValue = Number(offer);

    if (offerValue >= minimumPrice && offerValue <= price) {
      setPrice(offerValue);
      alert("Bargain accepted!");
      setShowInput(false);
    } else if (offerValue < minimumPrice) {
      alert(`Offer too low. Minimum acceptable price is ₹${minimumPrice}`);
    } else {
      alert("Invalid offer");
    }
  };

  const handleContinueToPayment = () => {
    if (!address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    const estimatedTime =
      orderType === "Home Delivery"
        ? "3 - 5 business days"
        : "Available in 1 - 2 hours at store";

    const checkoutData = {
      price,
      address,
      orderType,
      deliveryTime: estimatedTime,
      date: new Date().toLocaleString()
    };

    localStorage.setItem("cartPrice", String(price));
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));

    navigate("/payment");
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "30px" }}>
      <h1>Checkout</h1>

      <div style={{ border: "1px solid #ccc", padding: "20px", width: "400px" }}>
        <h3>Price Details</h3>

        <p>Original Price: ₹{initialPrice}</p>
        <p>Total Payable: ₹{price}</p>

        <button
          onClick={handleBargain}
          style={{
            background: "#008cba",
            color: "#fff",
            padding: "8px 15px",
            border: "none",
            cursor: "pointer",
            marginBottom: "10px"
          }}
        >
          Bargain
        </button>

        {showInput && (
          <div style={{ marginBottom: "10px" }}>
            <input
              type="number"
              placeholder="Enter your offer"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              style={{ padding: "5px", width: "150px", marginRight: "10px" }}
            />
            <button onClick={submitOffer}>Submit</button>
          </div>
        )}

        <hr style={{ margin: "15px 0" }} />

        <div style={{ marginBottom: "10px" }}>
          <b>Delivery Address:</b>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            rows={3}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <b>Order Type:</b>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          >
            <option value="Home Delivery">Home Delivery</option>
            <option value="Pick Up">Pick Up</option>
          </select>
        </div>

        <button
          style={{
            background: "#fb641b",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer"
          }}
          onClick={handleContinueToPayment}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;