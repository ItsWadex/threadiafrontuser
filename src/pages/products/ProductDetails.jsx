import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetails.css";
import { Carousel } from "react-responsive-carousel";

function ProductDetails({ setIsCartOpen, isCartOpen }) {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState(""); // State for selected size
  const [loading, setLoading] = useState(true); // Track loading state
  const [errorMessage, setErrorMessage] = useState(""); // Handle errors
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/customer/products/${id}`)
      .then((response) => {
        if (response.data.status) {
          setProduct(response.data.data);
        } else {
          console.error("Failed to fetch product details");
        }
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      })
      .finally(() => {
        setLoading(false); // Stop loading state once the request completes
      });
  }, [id]);

const handleAddToCart = () => {
  if (!localStorage.getItem("token")) {
    setErrorMessage("Please log in to add the product to the cart.");
    return;
  }

  if (!size) {
    setErrorMessage(
      "Please select a size before adding the product to the cart."
    );
    return;
  }

  axios
    .post(
      `/api/customer/addProductToCart/${id}`,
      {
        size, // Include the selected size in the request body
        qte: 1, // Add the quantity of 1 by default
      },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    )
    .then((response) => {
      setIsCartOpen(!isCartOpen); // Toggle cart visibility
    })
    .catch((error) => {
      setErrorMessage("An error occurred. Please try again.");
    });
};

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div id="product-details-page">
      <h1>{product.pName}</h1>
      <div className="product-details">
        <Carousel
          showThumbs={true}
          autoPlay={true}
          infiniteLoop={true}
          className="product-carousel"
        >
          {product.pImg && product.pImg.length > 0 ? (
            product.pImg.map((img, index) => (
              <div key={index}>
                <img src={img} alt={`Image ${index + 1}`} />
              </div>
            ))
          ) : (
            <div>
              <img src="default-image-url" alt="Default" />
            </div>
          )}
        </Carousel>
        <div className="product-info">
          <p>{product.pDescription}</p>
          <p>
            <select onChange={(e) => setSize(e.target.value)} value={size}>
              <option value="">Choose size</option>
              {product.pSize.map((elt) => {
                return (
                  elt.qte !== 0 && (
                    <option key={elt.size} value={elt.size}>
                      {elt.size}
                    </option>
                  )
                );
              })}
            </select>
          </p>
          <p>Price: {product.pPrice}DT</p>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button className="buy-now-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
