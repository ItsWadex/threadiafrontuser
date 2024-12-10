import "./App.css";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import LandingPage from "./pages/landingpage/LandingPage";
import Products from "./pages/products/Products";
import ProductDetails from "./pages/products/ProductDetails";
import AboutUs from "./pages/aboutus/AboutUs";
import Contact from "./pages/contact/Contact";
import Cart from "./pages/cart/Cart";
import ViewCart from "./pages/cart/ViewCart";
import Profile from "./pages/profile/Profile";
import { useState } from "react";

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  console.log(isCartOpen);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/"
          element={
            <PublicLayout
              setIsCartOpen={setIsCartOpen}
              isCartOpen={isCartOpen}
            />
          }
        >
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route
            path="/products/:id"
            element={
              <ProductDetails
                setIsCartOpen={setIsCartOpen}
                isCartOpen={isCartOpen}
              />
            }
          />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/cart" element={<Cart />} /> */}
          <Route path="/view-cart" element={<ViewCart />} />{" "}
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
