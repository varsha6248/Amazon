import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
//const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
 const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch("https://amazon-backend-uy18.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log("Product fetch error:", err));
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const matches = products.filter((p) =>
      p.title.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(matches);
  };

  const handleSelect = (product) => {
    setQuery(product.title);
    setSuggestions([]);
    navigate(`/product/${product.id}`);
  };
const handleSearchSubmit = () => {
  const value = query.trim().toLowerCase();

  if (!value) {
    alert("Please enter a product name");
    return;
  }

  const foundProduct = products.find(
    (p) => p.title.toLowerCase() === value
  ) || products.find(
    (p) => p.title.toLowerCase().includes(value)
  );

  if (foundProduct) {
    setSuggestions([]);
    navigate(`/product/${foundProduct.id}`);
  } else {
    alert("Product not found");
  }
};

const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    handleSearchSubmit();
  }
};
  return (

    <div>

      {/* NAVBAR */}

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        background: "#1f2937",
        color: "white"
      }}>

        <h2 style={{ color: "#10b981" }}>OnlineStore
        </h2>

        {/* SEARCH */}

        <div style={{ position: "relative", display: "flex" }}>

          <input
placeholder="Search products..."
  value={query}
  onChange={handleSearch}
  onKeyDown={handleKeyDown}
  style={{
    padding: "10px",
    width: "400px",
    border: "none",
    outline: "none",
    background: "#f3f4f6"
  }}
/>
         <button
  onClick={handleSearchSubmit}
  style={{
    padding: "10px 15px",
    border: "none",
    background: "#10b981",
    color: "white",
    cursor: "pointer"
  }}
>
            🔍
          </button>

          {suggestions.length > 0 && (
            <div style={{
              position: "absolute",
              top: "40px",
              width: "300px",
              background: "white",
              border: "1px solid #ccc"
            }}>
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  style={{
                    padding: "8px",
                    cursor: "pointer"
                  }}
                  onClick={() => handleSelect(product)}
                >
                  {product.title}
                </div>
              ))}
            </div>
          )}

        </div>

        <div style={{ cursor: "pointer" }} onClick={() => navigate("/cart")}>
          🛒 Cart
        </div>
  <div style={{ cursor: "pointer" }} onClick={() => navigate("/orders")}>
    📦 Orders
  </div>
        <div style={{ cursor: "pointer" }} onClick={() => navigate("/payment")}>
          💳 Payment
        </div>
<button
  onClick={() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }}
  style={{
    padding: "10px 15px",
    background: "red",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px"
  }}
>
  Logout
</button>
      </div>

      {/* FRONT IMAGE */}

      <div
  style={{
    width: "100%",
    height: "380px",
    overflow: "hidden",
    background: "#e5e7eb"
  }}
>
  <img
    src="/front_photo.png"
    alt="Banner"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }}
  />
</div>

      {/* PRODUCTS */}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: "20px",
        padding: "40px",
        background: "#f9fafb"
      }}>

        {products.map((product) => (

          <div key={product.id} style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>

            <h3>{product.title}</h3>

            <div
              style={{
                height: "200px",
                backgroundImage: `url(${product.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                margin: "10px 0",
                cursor: "pointer"
              }}
              onClick={() => navigate(`/product/${product.id}`)}
            ></div>

            <p
              style={{ color: "#10b981", cursor: "pointer" }}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              View Product
            </p>

          </div>

        ))}

      </div>

      {/* FOOTER */}

      <div style={{
        background: "#374151",
        color: "white",
        textAlign: "center",
        padding: "15px"
      }}>
        Back to Top
      </div>

      <div style={{
        background: "#111827",
        color: "#9ca3af",
        textAlign: "center",
        padding: "15px"
      }}>
        © 2025 OnlineStore
      </div>
    </div>
  );
};

export default HomePage;