import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "./CartContent";
import { useNavigate, useParams } from "react-router-dom";

const ProductPage = () => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    fetch(`https://amazon-backend-uy18.onrender.com/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!product) {
    return <h2 style={{ padding: "40px" }}>Loading product...</h2>;
  }

  const handleAdd = () => {
    addToCart(product, Number(quantity));
    alert("Item added to cart");
  };

  const handleBuy = () => {
    const selectedProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: Number(quantity),
    };

    console.log("Saving latestProduct:", selectedProduct);

    localStorage.setItem("latestProduct", JSON.stringify(selectedProduct));
    localStorage.setItem("cartPrice", String(product.price * Number(quantity)));

    navigate("/checkout");
  };

  return (
    <div
      style={{
        padding: isMobile ? "20px 15px" : "40px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? "20px" : "40px",
        minHeight: "70vh",
        background: "linear-gradient(135deg, #f8fafc, #e0f2f1, #ecfdf5)",
        alignItems: isMobile ? "center" : "flex-start",
      }}
    >
      <img
        src={product.image}
        alt={product.title}
        style={{
          width: isMobile ? "100%" : "550px",
          maxWidth: isMobile ? "320px" : "550px",
          borderRadius: "10px",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          width: isMobile ? "100%" : "auto",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        <h1 style={{ fontSize: isMobile ? "28px" : "32px" }}>{product.title}</h1>

        <h2 style={{ color: "green", fontSize: isMobile ? "24px" : "28px" }}>
          ₹{product.price}
        </h2>

        <p
          style={{
            width: isMobile ? "100%" : "400px",
            fontSize: isMobile ? "15px" : "16px",
            lineHeight: "1.6",
          }}
        >
          {product.description}
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "center" : "center",
            gap: isMobile ? "10px" : "0",
          }}
        >
          <label style={{ marginRight: isMobile ? "0" : "10px" }}>Quantity: </label>
          <select
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{
              padding: "8px",
              width: isMobile ? "120px" : "auto",
            }}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        <div
          style={{
            marginTop: "30px",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "12px" : "15px",
            width: isMobile ? "100%" : "auto",
          }}
        >
          <button
            onClick={handleAdd}
            style={{
              padding: "10px 20px",
              marginRight: isMobile ? "0" : "15px",
              backgroundColor: "#ffd814",
              border: "none",
              cursor: "pointer",
              width: isMobile ? "100%" : "auto",
              borderRadius: "6px",
            }}
          >
            Add to Cart
          </button>

          <button
            onClick={handleBuy}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ffa41c",
              border: "none",
              cursor: "pointer",
              width: isMobile ? "100%" : "auto",
              borderRadius: "6px",
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;