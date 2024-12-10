import React from "react";
import { FaInstagram, FaFacebook } from "react-icons/fa"; // Importing icons
import { useNavigate } from "react-router-dom";
import "./footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate(); // Use for navigation

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left" onClick={() => navigate("/")}>
          <h2>Threadia</h2> {/* Logo */}
        </div>

        <div className="footer-center">
          <p>&copy; {currentYear} Threadia. All rights reserved.</p>
        </div>

        <div className="footer-right">
          <a
            href="https://instagram.com/yourstore"
            target="_blank"
            rel="noreferrer"
          >
            <FaInstagram className="social-icon" /> {/* Instagram icon */}
          </a>
          <a
            href="https://facebook.com/yourstore"
            target="_blank"
            rel="noreferrer"
          >
            <FaFacebook className="social-icon" /> {/* Facebook icon */}
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
