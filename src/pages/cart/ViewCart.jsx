import React, { useEffect, useState } from "react";
import axios from "axios";
import "./viewCart.css"; // Add appropriate styles

function ViewCart() {
  const [cartItems, setCartItems] = useState([]);
  // console.log(cartItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address, setAddress] = useState("");

  // Function to fetch cart data
  // const fetchCartData = () => {};
  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/customer/getCart", {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setCartItems(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("An error occurred while fetching cart data.");
        console.error(error);
        setLoading(false);
      });
  }, [cartItems]);
  // Increase product quantity
  const increaseQuantity = (itemId) => {
    axios
      .put(
        `/api/customer/incProductOfCart/${itemId}`,
        {},
        {
          headers: { token: localStorage.getItem("token") },
        }
      )
      .then((response) => {
        if (response.data.status) {
          console.log(response.data.data);
          // setCartItems([response.data.data]);
        } else {
          console.error("Failed to increase quantity");
        }
      })
      .catch((error) => console.error("Error increasing quantity:", error));
  };

  // Decrease product quantity
  // Decrease product quantity
  const decreaseQuantity = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      // Reduce the quantity only if it's greater than 1
      axios
        .put(
          `/api/customer/decProductOfCart/${itemId}`,
          {},
          {
            headers: { token: localStorage.getItem("token") },
          }
        )
        .then((response) => {
          if (response.data.status) {
            // Update the cart items state directly for instant feedback
            setCartItems((prevItems) =>
              prevItems.map((item) =>
                item._id === itemId ? { ...item, qte: item.qte - 1 } : item
              )
            );
          } else {
            console.error("Failed to decrease quantity");
          }
        })
        .catch((error) => console.error("Error decreasing quantity:", error));
    } else {
      // If the quantity is 1, show the alert and don't reduce the quantity
      alert("Minimum quantity is 1.");
    }
  };

  // Remove product from cart
  const removeProduct = (pId) => {
    axios
      .put(
        `/api/customer/removeProductFromCart/${pId}`,
        {},
        {
          headers: { token: localStorage.getItem("token") },
        }
      )
      .then(() => {
        // Directly update the state after removing the item
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.pId._id !== pId)
        );
      })
      .catch((error) => console.error("Error removing product:", error));
  };

  // Create an order
  const handleCreateOrder = () => {
    if (!address) {
      alert("Order cannot be created without an address.");
      return;
    }

    axios
      .post(
        "/api/customer/createOrder",
        { address }, // Include address in the request body
        {
          headers: { token: localStorage.getItem("token") },
        }
      )
      .then(() => {
        alert("Order created successfully!");
        setCartItems([]); // Clear cart after order creation
        setAddress(""); // Clear address field
        setShowAddressForm(false); // Hide address form
      })
      .catch((error) => console.error("Error creating order:", error));
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.qte * item.pId.pPrice,
      0
    );
  };
  // if (!loading) {
  //   return <p>Loading cart data...</p>;
  // }
  return (
    <div className="view-cart-container">
      <h2>Your Cart</h2>
      {error && <p className="error-message">{error}</p>}
      {cartItems.length === 0 && <p>Your cart is empty.</p>}
      <div className="cart-items">
        {cartItems.length > 0 &&
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
                <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(item._id, item.qte)}>
                    -
                  </button>
                  <span>{item.qte}</span>
                  <button onClick={() => increaseQuantity(item._id)}>+</button>
                </div>
                <button onClick={() => removeProduct(item.pId._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
      </div>
      {cartItems.length > 0 && (
        <>
          <div className="cart-total">
            <h3>Total: {calculateTotal()} DT</h3>
          </div>
          {!showAddressForm ? (
            <button
              className="create-order"
              onClick={() => setShowAddressForm(true)}
            >
              Create Order
            </button>
          ) : (
            <div className="address-form">
              <h3>Enter Your Address</h3>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
              />
              <button onClick={handleCreateOrder}>Submit Order</button>
              <button onClick={() => setShowAddressForm(false)}>Cancel</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ViewCart;
