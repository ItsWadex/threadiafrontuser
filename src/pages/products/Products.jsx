import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import { FaFilter } from "react-icons/fa"; // Import filter icon

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([
    "T-shirts",
    "Jeans",
    "Hoodies",
  ]);
  const [sizes, setSizes] = useState(["S", "M", "L", "XL","XXL"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // State for sidebar visibility

  useEffect(() => {
    axios
      .get(`/api/customer/products`)
      .then((response) => {
        if (response.data.status) {
          setProducts(response.data.data);
          setFilteredProducts(response.data.data);
        } else {
          console.error("Failed to fetch products");
        }
      })
      .catch((error) => {
        console.error("An error occurred while fetching products:", error);
      });
  }, []);

  useEffect(() => {
    let newFilteredProducts = products;

    if (selectedCategory !== "All") {
      newFilteredProducts = newFilteredProducts.filter(
        (product) => product.pCategory === selectedCategory
      );
    }

    if (selectedSize !== "All") {
      // Filter products by available sizes
      newFilteredProducts = newFilteredProducts.filter((product) =>
        product.pSize.some(
          (sizeObj) => sizeObj.size === selectedSize && sizeObj.qte > 0
        )
      );
    }

    setFilteredProducts(newFilteredProducts);
  }, [selectedCategory, selectedSize, products]);

  return (
    <div id="products-page">
      <div id="sidebar" className={isSidebarVisible ? "visible" : "hidden"}>
        <button
          id="toggle-sidebar"
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        >
          <FaFilter /> {/* Filter icon */}
        </button>
        <h2>Filters</h2>
        <div className="filter-section">
          <h3>Category</h3>
          <ul>
            <li>
              <button
                onClick={() => setSelectedCategory("All")}
                className={selectedCategory === "All" ? "selected" : ""}
              >
                All
              </button>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "selected" : ""}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="filter-section">
          <h3>Size</h3>
          <ul>
            <li>
              <button
                onClick={() => setSelectedSize("All")}
                className={selectedSize === "All" ? "selected" : ""}
              >
                All
              </button>
            </li>
            {sizes.map((size) => (
              <li key={size}>
                <button
                  onClick={() => setSelectedSize(size)}
                  className={selectedSize === size ? "selected" : ""}
                >
                  {size}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div id="products-list-container">
        <div id="products-list">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-item">
                <Link to={`/products/${product._id}`} className="product-link">
                  <Carousel
                    showThumbs={false}
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
                  <h2>{product.pName}</h2>
                  <p>{product.pDescription}</p>
                  <p>Price: {product.pPrice}DT</p>
                </Link>
              </div>
            ))
          ) : (
            <p>No products found for the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
