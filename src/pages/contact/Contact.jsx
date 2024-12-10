import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import "./style.css";

function Contact() {
  return (
    <div id="contact-us-page">
      <h1>Contact Us</h1>

      <div className="contact-form-container">
        <p>
          If you have any questions, please feel free to get in touch with us,
          we'll get back to you shortly.
        </p>
        <div className="contact-details">
          <h3>Contact Details</h3>
          <p>
            <FontAwesomeIcon icon={faEnvelope} />{" "}
            <a href="mailto:contact.info@gmail.com">contact.info@gmail.com</a>
          </p>
          <p>
            <FontAwesomeIcon icon={faPhone} /> +216 21 211 261
          </p>
          <p>
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Tunis, Ariana
          </p>
        </div>
        <form className="contact-form">
          <div className="input-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="First"
              required
            />
            <input
              type="text"
              id="last-name"
              name="last-name"
              placeholder="Last"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email *</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="input-group">
            <label htmlFor="message">Message *</label>
            <textarea id="message" name="message" rows="4" required></textarea>
          </div>
          <button type="submit" className="send-button">
            SEND
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
