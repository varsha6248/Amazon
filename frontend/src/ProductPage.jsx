import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "./CartContent";
import { useNavigate, useParams } from "react-router-dom";

const ProductPage = () => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch product from backend
  useEffect(() => {
    fetch(`https://amazon-backend-glih.onrender.com/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.log(err));
  }, [id]);

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
    quantity: Number(quantity)
  };

  console.log("Saving latestProduct:", selectedProduct);

  localStorage.setItem("latestProduct", JSON.stringify(selectedProduct));
  localStorage.setItem("cartPrice", String(product.price * Number(quantity)));

  navigate("/checkout");
};

  return (
<div
  style={{
    padding: "40px",
    display: "flex",
    gap: "40px",
    minHeight: "70vh",
    background: "linear-gradient(135deg, #f8fafc, #e0f2f1, #ecfdf5)"
  }}
>
      <img
        src={product.image}
        alt={product.title}
        style={{ width: "550px", borderRadius: "10px" }}
      />

      <div>
        <h1>{product.title}</h1>
        <h2 style={{ color: "green" }}>₹{product.price}</h2>

        <p style={{ width: "400px" }}>{product.description}</p>

        <div style={{ marginTop: "20px" }}>
          <label>Quantity: </label>
          <select
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        <div style={{ marginTop: "30px" }}>
          <button
            onClick={handleAdd}
            style={{
              padding: "10px 20px",
              marginRight: "15px",
              backgroundColor: "#ffd814",
              border: "none",
              cursor: "pointer"
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
              cursor: "pointer"
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