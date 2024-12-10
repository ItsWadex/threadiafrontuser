import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaShoppingCart,
  FaInfoCircle,
  FaPhone,
  FaSignInAlt,
  FaTshirt,
  FaSearch,
  FaUserAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import Cart from "../pages/cart/Cart";
import "./style.css";

function PublicNavBar({ setIsCartOpen, isCartOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null); // To track dropdown for outside clicks

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    axios
      .get("/api/customer/products")
      .then((response) => {
        setAllProducts(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  useEffect(() => {
    if (location.pathname === "/viewCart") {
      setIsCartOpen(true);
    }
  }, [location.pathname]);

  // Handle search changes
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filteredSuggestions = allProducts.filter(
        (product) =>
          product.pName.toLowerCase().includes(query) ||
          product.pCategory.toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
    setIsDropdownOpen(false); // Close the dropdown when logging out
  };

  // Toggle cart visibility
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Toggle dropdown menu visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      <div id="th-navbar-container">
        <div className="navbar-left" onClick={() => navigate("/")}>
          <h1>Threadia</h1>
        </div>
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button>
            <FaSearch />
          </button>

          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    navigate(`/products/${suggestion._id}`);
                    setSearchQuery("");
                    setSuggestions([]);
                  }}
                >
                  <img
                    src={suggestion.pImg[0]}
                    alt={suggestion.pName}
                    className="suggestion-img"
                  />
                  <span className="suggestion-name">{suggestion.pName}</span> -{" "}
                  <span>{suggestion.pCategory}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Toggle between the menu icon and dropdown on mobile */}
        <div className="navbar-menu-icon" onClick={toggleDropdown}>
          {isDropdownOpen ? <FaBars /> : <FaBars />}
        </div>

        <div
          className={`navbar-right ${isDropdownOpen ? "open" : ""}`}
          ref={dropdownRef} // Attach the ref to the dropdown container
        >
          <ul>
            <li
              onClick={() => {
                navigate("/products");
                setIsDropdownOpen(false); // Close dropdown on selection
              }}
            >
              <FaTshirt className="icon" /> Products
            </li>
            <li
              onClick={() => {
                navigate("/aboutUs");
                setIsDropdownOpen(false); // Close dropdown on selection
              }}
            >
              <FaInfoCircle className="icon" /> About Us
            </li>
            <li
              onClick={() => {
                navigate("/contact");
                setIsDropdownOpen(false); // Close dropdown on selection
              }}
            >
              <FaPhone className="icon" /> Contact
            </li>
            <li onClick={toggleCart}>
              <FaShoppingCart className="icon" /> Cart
            </li>
            {!isLoggedIn ? (
              <>
                <li
                  onClick={() => {
                    navigate("/register");
                    setIsDropdownOpen(false); // Close dropdown on selection
                  }}
                >
                  <FaUserPlus className="icon" /> Register
                </li>
                <li
                  onClick={() => {
                    navigate("/login");
                    setIsDropdownOpen(false); // Close dropdown on selection
                  }}
                >
                  <FaSignInAlt className="icon" /> Login
                </li>
              </>
            ) : (
              <>
                <li
                  onClick={() => {
                    navigate("/profile");
                    setIsDropdownOpen(false); // Close dropdown on selection
                  }}
                >
                  <FaUserAlt className="icon" /> Profile
                </li>
                <li onClick={handleLogout}>
                  <FaSignOutAlt className="icon" /> Logout
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <Cart isOpen={isCartOpen} toggleCart={toggleCart} />
    </>
  );
}

export default PublicNavBar;
