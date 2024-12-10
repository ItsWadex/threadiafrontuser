import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

function Profile() {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateofBirth: "",
  });
  const [passwordData, setPasswordData] = useState({
    password: "",
    newPassword: "",
  });
  const [emailData, setEmailData] = useState({
    email: "",
    password: "",
  });
  const [orders, setOrders] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [visibleSection, setVisibleSection] = useState(null);

  // Fetch user data and orders on component mount
  useEffect(() => {
    axios
      .get(`/api/customer/myProfile`, {
        headers: { token: localStorage.getItem("token") },
      })
      .then((response) => {
        setUserData(response.data.data);
      })
      .catch((error) => console.error("Error fetching user data:", error));

    axios
      .get(`/api/customer/myOrders`, {
        headers: { token: localStorage.getItem("token") },
      })
      .then((response) => {
        setOrders(response.data.data || []); // Ensure orders is an array
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const handleUpdateDetails = (e) => {
    e.preventDefault();
    axios
      .put(`/api/customer/updateDetails`, userData, {
        headers: { token: localStorage.getItem("token") },
      })
      .then((response) => {
        setSuccessMessage("Account details updated successfully!");
        setErrorMessage("");
        setVisibleSection(null); // Hide the section after updating
      })
      .catch((error) => {
        setSuccessMessage("");
        setErrorMessage("Failed to update details.");
      });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    axios
      .put(`/api/customer/updatePassword`, passwordData, {
        headers: { token: localStorage.getItem("token") },
      })
      .then(() => {
        setSuccessMessage("Password updated successfully!");
        setErrorMessage("");
        setPasswordData({ password: "", newPassword: "" }); // Clear fields on success
        setVisibleSection(null); // Hide the section after updating
      })
      .catch((error) => {
        setSuccessMessage("");
        setErrorMessage("Failed to update password.");
      });
  };

  const handleUpdateEmail = (e) => {
    e.preventDefault();
    axios
      .put(
        `/api/customer/updateEmail`,
        { password: emailData.password, newEmail: emailData.email },
        {
          headers: { token: localStorage.getItem("token") },
        }
      )
      .then(() => {
        setSuccessMessage("Email updated successfully!");
        setErrorMessage("");
        setEmailData({ email: "", password: "" }); // Clear fields on success
        setVisibleSection(null); // Hide the section after updating
      })
      .catch((error) => {
        setSuccessMessage("");
        setErrorMessage("Failed to update email.");
      });
  };

  // Function to calculate the total for each order
  const calculateOrderTotal = (cart) => {
    return cart.reduce((total, item) => total + item.qte * item.pId.pPrice, 0);
  };

  return (
    <div id="profile-page-c">
      <div id="profile-page">
        <h1>Profile</h1>
        <div className="buttons-container">
          <button onClick={() => setVisibleSection("details")}>
            Modify Details
          </button>
          <button onClick={() => setVisibleSection("email")}>
            Modify Email
          </button>
          <button onClick={() => setVisibleSection("password")}>
            Modify Password
          </button>
          <button onClick={() => setVisibleSection("orders")}>
            View My Orders
          </button>
        </div>

        {/* Modify Details Section */}
        {visibleSection === "details" && (
          <form onSubmit={handleUpdateDetails}>
            <h3>Update Account Details</h3>
            <input
              name="fullName"
              type="text"
              value={userData.fullName}
              onChange={(e) =>
                setUserData({ ...userData, fullName: e.target.value })
              }
              placeholder="Full Name"
            />
            <input
              name="phone"
              type="text"
              value={userData.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
              placeholder="Phone"
            />
            <input
              name="dateofBirth"
              type="date"
              value={userData.dateofBirth}
              onChange={(e) =>
                setUserData({ ...userData, dateofBirth: e.target.value })
              }
            />
            <button type="submit">Update Details</button>
          </form>
        )}

        {/* Modify Password Section */}
        {visibleSection === "password" && (
          <form onSubmit={handleUpdatePassword}>
            <h3>Update Password</h3>
            <input
              type="password"
              placeholder="Old Password"
              value={passwordData.password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  password: e.target.value,
                })
              }
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />
            <button type="submit">Update Password</button>
          </form>
        )}

        {/* Modify Email Section */}
        {visibleSection === "email" && (
          <form onSubmit={handleUpdateEmail}>
            <h3>Update Email</h3>
            <input
              name="email"
              type="email"
              value={emailData.email}
              onChange={(e) =>
                setEmailData({ ...emailData, email: e.target.value })
              }
              placeholder="New Email"
            />
            <input
              name="password"
              type="password"
              value={emailData.password}
              onChange={(e) =>
                setEmailData({ ...emailData, password: e.target.value })
              }
              placeholder="Password"
            />
            <button type="submit">Update Email</button>
          </form>
        )}

        {/* Orders Section */}
        {visibleSection === "orders" && (
          <div id="orders">
            <h3>Your Orders</h3>
            <ul>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <li key={order._id}>
                    <h4>Order ID: {order._id}</h4>

                    {/* Determine and display order status */}
                    <p>
                      Status:
                      {order.isCanceled
                        ? "Canceled"
                        : order.isDelivered
                        ? "Delivered"
                        : order.isConfirmed
                        ? "Confirmed"
                        : "Pending"}
                    </p>

                    <h4>Products:</h4>
                    <ul>
                      {order.cart &&
                        order.cart.map((item) => (
                          <li key={item.pId._id}>
                            <img
                              src={item.pId.pImg[0]} // Display the product image
                              alt={item.pId.pName}
                              style={{ width: "100px", height: "100px" }} // Adjust size as needed
                            />
                            <p>{item.pId.pName}</p>
                            <p>Quantity: {item.qte}</p>
                            <p>Price: {item.pId.pPrice} DT</p>
                          </li>
                        ))}
                    </ul>
                    <p>
                      <strong>
                        Total: {calculateOrderTotal(order.cart)} DT
                      </strong>
                    </p>
                  </li>
                ))
              ) : (
                <p>No orders found.</p>
              )}
            </ul>
          </div>
        )}

        {/* Success and Error Messages */}
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Profile;
