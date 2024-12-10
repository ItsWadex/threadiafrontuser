import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css"; 
function Login() {
  const [loginData, setLoginData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    axios
      .post(`/api/customer/login`, loginData)
      .then((response) => {
        if (response.data.status) {
          setErrorMessage("");
          localStorage.setItem("token", response.data.data.token);

          navigate("/");
        } else {
          setErrorMessage(response.data.message || "Login failed.");
        }
      })
      .catch((error) => {
        setErrorMessage("An error occurred. Please try again.");
      });
  }

  return (
    <div id="login-page">
      <div id="Login-box">
        <h1>Login Page</h1>
        <form
          onChange={(e) =>
            setLoginData({
              ...loginData,
              [e.target.name]: e.target.value,
            })
          }
        >
          <input name="email" type="email" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button onClick={handleLogin} type="button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
