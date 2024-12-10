import React, { useState, useEffect, useRef } from "react";
import PublicNavBar from "../../components/PublicNavBar";
import "./style.css";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel CSS
import Footer from "../../components/Footer";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

function LandingPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("all");

  // Ref for the products container
  const productsRef = useRef(null);

  useEffect(() => {
    axios
      .get(`/api/customer/products`, {
        headers: { token: localStorage.getItem("token") },
      })
      .then((response) => {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data); // Set default to all products
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    filterProducts(selectedCategory);
  };

  const filterProducts = (selectedCategory) => {
    let filtered = products.filter((product) => {
      return (
        selectedCategory === "all" || product.pCategory === selectedCategory
      );
    });
    setFilteredProducts(filtered);
  };

  const handlePromoClick = () => {
    setCategory("Hoodies");
    filterProducts("Hoodies");
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="landing-page">
      <PublicNavBar />

      {/* Promo Banner */}
      <div className="promo-banner" onClick={handlePromoClick}></div>

      {/* Category Filter */}
      <div className="category-filter">
        <label htmlFor="category-select">Filter by Category:</label>
        <select
          id="category-select"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="all">All Categories</option>
          <option value="T-shirts">T-shirts</option>
          <option value="Jeans">Jeans</option>
          <option value="Hoodies">Hoodies</option>
        </select>
      </div>

      {/* Products Display */}
      <div className="products-container" ref={productsRef}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              {/* Link to ProductDetails page */}
              <Link to={`/products/${product._id}`}>
                <Carousel
                  showThumbs={false}
                  autoPlay={true}
                  infiniteLoop={true}
                  className="product-carousel"
                >
                  {product.pImg && product.pImg.length > 0 ? (
                    product.pImg.map((img, index) => (
                      <div key={index}>
                        <img src={img} alt={`Product image ${index + 1}`} />
                      </div>
                    ))
                  ) : (
                    <div>
                      <img src="/path/to/default-image.jpg" alt="Default" />
                    </div>
                  )}
                </Carousel>
              </Link>
              <h3>{product.pName}</h3>
              <p>{product.pDescription}</p>
              <p>Price: {product.pPrice}DT</p>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
