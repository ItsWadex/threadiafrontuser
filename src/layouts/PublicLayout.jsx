import React from "react";
import PublicNavBar from "../components/PublicNavBar";
import Footer from "../components/Footer";

import { Outlet } from "react-router-dom";
function PublicLayout({ setIsCartOpen, isCartOpen }) {
  return (
    <div>
      <PublicNavBar isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
      <Outlet test="ok" />
      <Footer />
    </div>
  );
}

export default PublicLayout;
