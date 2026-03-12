import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("https://amazon-backend-uy18.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log("Product fetch error:", err));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

    const foundProduct =
      products.find((p) => p.title.toLowerCase() === value) ||
      products.find((p) => p.title.toLowerCase().includes(value));

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

  const menuItemStyle = {
    padding: "10px 12px",
    cursor: "pointer",
    borderBottom: "1px solid #e5e7eb",
    color: "#111827",
    background: "white",
  };

  return (
    <div>
      {/* NAVBAR */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: isMobile ? "15px" : "15px 30px",
          background: "#1f2937",
          color: "white",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          <h2 style={{ color: "#10b981", margin: 0 }}>OnlineStore</h2>

          {!isMobile && (
            <>
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
                    background: "#f3f4f6",
                  }}
                />
                <button
                  onClick={handleSearchSubmit}
                  style={{
                    padding: "10px 15px",
                    border: "none",
                    background: "#10b981",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  🔍
                </button>

                {suggestions.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "42px",
                      width: "300px",
                      background: "white",
                      border: "1px solid #ccc",
                      zIndex: 10,
                    }}
                  >
                    {suggestions.map((product) => (
                      <div
                        key={product.id}
                        style={{
                          padding: "8px",
                          cursor: "pointer",
                          color: "black",
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
                  borderRadius: "5px",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>

        {isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                flex: 1,
                minWidth: 0,
              }}
            >
              <input
                placeholder="Search products..."
                value={query}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
                style={{
                  padding: "10px",
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "#f3f4f6",
                  fontSize: "14px",
                }}
              />
              <button
                onClick={handleSearchSubmit}
                style={{
                  padding: "10px 15px",
                  border: "none",
                  background: "#10b981",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                🔍
              </button>

              {suggestions.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "42px",
                    left: 0,
                    width: "100%",
                    background: "white",
                    border: "1px solid #ccc",
                    zIndex: 20,
                  }}
                >
                  {suggestions.map((product) => (
                    <div
                      key={product.id}
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                        color: "black",
                      }}
                      onClick={() => handleSelect(product)}
                    >
                      {product.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ position: "relative" }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  width: "44px",
                  height: "44px",
                  border: "none",
                  borderRadius: "6px",
                  background: "#10b981",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ☰
              </button>

              {menuOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "50px",
                    width: "180px",
                    background: "white",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                    zIndex: 30,
                  }}
                >
                  <div
                    style={menuItemStyle}
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/cart");
                    }}
                  >
                    🛒 Cart
                  </div>

                  <div
                    style={menuItemStyle}
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/orders");
                    }}
                  >
                    📦 Orders
                  </div>

                  <div
                    style={menuItemStyle}
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/payment");
                    }}
                  >
                    💳 Payment
                  </div>

                  <div
                    style={{
                      ...menuItemStyle,
                      borderBottom: "none",
                      color: "red",
                      fontWeight: "bold",
                    }}
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      setMenuOpen(false);
                      navigate("/login");
                    }}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FRONT IMAGE */}
      <div
        style={{
          width: "100%",
          height: isMobile ? "220px" : "380px",
          overflow: "hidden",
          background: "#e5e7eb",
        }}
      >
        <img
          src="/front_photo.png"
          alt="Banner"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      {/* PRODUCTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(4,1fr)",
          gap: "20px",
          padding: isMobile ? "20px 15px" : "40px",
          background: "#f9fafb",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <h3>{product.title}</h3>

            <div
              style={{
                height: "200px",
                backgroundImage: `url(${product.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                margin: "10px 0",
                cursor: "pointer",
                borderRadius: "6px",
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
      <div
        style={{
          background: "#374151",
          color: "white",
          textAlign: "center",
          padding: "15px",
        }}
      >
        Back to Top
      </div>

      <div
        style={{
          background: "#111827",
          color: "#9ca3af",
          textAlign: "center",
          padding: "15px",
        }}
      >
        © 2025 OnlineStore
      </div>
    </div>
  );
};

export default HomePage;