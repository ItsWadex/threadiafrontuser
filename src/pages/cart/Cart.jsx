import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

function Cart({ isOpen, toggleCart }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true); // User is logged in
      if (isOpen) {
        setLoading(true);
        axios
          .get("/api/customer/getCart", {
            headers: {
              token: token,
            },
          })
          .then((response) => {
            if (response.data.status) {
              setCartItems(response.data.data);
            } else {
              setError("Failed to fetch cart data.");
            }
          })
          .catch((error) => {
            setError("An error occurred while fetching cart data.");
            console.error(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, [isOpen]);

  const removeItemFromCart = (pId) => {
    axios
      .put(
        `/api/customer/removeProductFromCart/${pId}`,
        {},
        {
          headers: { token: localStorage.getItem("token") },
        }
      )
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.pId._id !== pId)
        );
      })
      .catch((error) => console.error("Error removing product:", error));
  };

  return (
    <>
      <div className={`cart-menu ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button onClick={toggleCart} className="close-button">
            &times;
          </button>
        </div>
        <div className="cart-content">
          {!isLoggedIn ? (
            <p>Please log in to add products to the cart.</p>
          ) : (
            <>
              {loading && <p>Loading cart...</p>}
              {error && <p className="error-message">{error}</p>}
              {!loading && !error && cartItems.length === 0 && (
                <p>No products in the cart.</p>
              )}
              {!loading &&
                cartItems.map((item) => (
                  <div key={item._id} className="cart-item">
                    <img
                      src={item.pId.pImg[0]}
                      alt={item.pId.pName}
                      className="cart-item-image"
                    />
                    <div className="cart-item-info">
                      <p>{item.pId.pName}</p>
                      <p>Price: {item.pId.pPrice} DT</p>
                      <p>Quantity: {item.quantity}</p>
                      <button
                        className="remove-item"
                        onClick={() => removeItemFromCart(item.pId._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
        <div className="cart-footer">
          {isLoggedIn && (
            <>
              <button className="continue-shopping" onClick={toggleCart}>
                Continue Shopping
              </button>
              <button
                className="view-cart"
                onClick={() => {
                  toggleCart();
                  navigate("/view-cart");
                }}
              >
                View Cart
              </button>
            </>
          )}
        </div>
      </div>
      {isOpen && <div className="cart-overlay" onClick={toggleCart}></div>}
    </>
  );
}

export default Cart;
