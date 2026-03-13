import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    fetch(`https://amazon-backend-uy18.onrender.com/orders/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Orders fetch error:", err);
        setLoading(false);
      });
  }, [user?.email]);

  if (loading) {
    return <h2 style={{ padding: "40px" }}>Loading orders...</h2>;
  }

  return (
    <div style={{ padding: "30px", background: "#f3f4f6", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "25px" }}>My Orders</h1>

      {orders.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}
        >
          <h3>No orders found</h3>
          <button
            onClick={() => navigate("/home")}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              background: "#35a84d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              background: "white",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "25px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}
          >
<div
  style={{
    marginBottom: "15px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px"
  }}
>
  <h3 style={{ margin: 0 }}>Order ID: {order._id}</h3>

  <p style={{ margin: "8px 0" }}>
    <b>Total Amount:</b> ₹{order.totalAmount}
  </p>

  <p style={{ margin: "8px 0" }}>
    <b>Address:</b> {order.address}
  </p>

  <p style={{ margin: "8px 0" }}>
    <b>Order Type:</b> {order.orderType}
  </p>

  <p style={{ margin: "8px 0" }}>
    <b>Delivery Time:</b> {order.deliveryTime}
  </p>

  <p style={{ margin: "8px 0" }}>
    <b>Ordered On:</b> {order.date || new Date(order.createdAt).toLocaleString()}
  </p>
</div>

            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    padding: "15px 0",
                    borderBottom: "1px solid #eee"
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "140px",
                      height: "140px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      background: "#f9fafb"
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: "10px" }}>{item.title}</h3>
                    <p style={{ margin: "6px 0" }}>
                      <b>Price:</b> ₹{item.price}
                    </p>
                    <p style={{ margin: "6px 0" }}>
                      <b>Quantity:</b> {item.quantity}
                    </p>
                    <p style={{ margin: "6px 0", color: "#35a84d", fontWeight: "bold" }}>
                      Item Total: ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No items in this order</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;