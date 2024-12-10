import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

function Register() {
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateofBirth: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  function handleRegister(e) {
    e.preventDefault();

    if (
      !registerData.fullName ||
      !registerData.email ||
      !registerData.phone ||
      !registerData.dateofBirth ||
      !registerData.password
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    axios
      .post(`/api/customer/register`, registerData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setErrorMessage("");
          setSuccessMessage("Registration successful!");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setErrorMessage(response.data.message || "Registration failed.");
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("An error occurred. Please try again.");
      });
  }

  return (
    <div id="register-page">
      <div id="Register-box">
        <h1>Register Page</h1>
        <form
          onChange={(e) =>
            setRegisterData({
              ...registerData,
              [e.target.name]: e.target.value,
            })
          }
        >
          <input name="fullName" type="text" placeholder="Full Name" />
          <input name="email" type="email" placeholder="Email" />
          <input name="phone" type="text" placeholder="Phone Number" />
          <input name="dateofBirth" type="date" placeholder="Date of Birth" />
          <div className="password-container">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="password-input"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
          <button onClick={handleRegister} type="button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
