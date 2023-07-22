import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  let userName = "";
  if (isAuthenticated) {
    userName = user.name.split(" ");
  }

  const homeRedirect = () => {
    navigate("/");
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      searchSubmitHandler();
    }
  };

  const searchSubmitHandler = (e) => {
    // e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate("/products");
    }
  };

  const loginSignupHandler = () => {
    navigate("/login");
  };
  const cartHandler = () => {
    navigate("/cart");
  };
  return (
    <div className="nav">
      <div className="navbar">
        <div className="navbar__logo">
          <span className="logo" onClick={homeRedirect}>
            CELLKART
          </span>
        </div>
        <div className="navbar__search">
          <input
            type="text"
            placeholder="Search any mobile products, brands and more"
            className="search-bar"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeypress}
          />
          <button className="search-button" onClick={searchSubmitHandler}>
            Search
          </button>
        </div>
        <div className="navbar__act">
          {isAuthenticated ? (
            null
          ) : (
            <button className="login-btn" onClick={loginSignupHandler}>
              Login
            </button>
          )}
        </div>
        <div className="cart-component" onClick={cartHandler}>
          <span className="cart-icon">Cart</span>
          {cartItems.length > 0 ? (
            <span className="cart-count">{cartItems.length}</span>
          ) : null}
        </div>
        <div className="navbar__actions">
          {isAuthenticated ? (
            <button className="login-button" onClick={loginSignupHandler}>
              {userName[0]}
            </button>
          ) : (
            <button className="login-button" onClick={loginSignupHandler}>
              Login/Signup
            </button>
          )}

          

          {/* <button className="signup-button">Signup</button> */}
        </div>
        
      </div>
    </div>
  );
};

export default Header;

// import React from "react";
// import { ReactNavbar } from "overlay-navbar";
// import logo from "../../../images/logo.png";

// const options = {
//   burgerColorHover: "#eb4034",
//   logo,
//   logoWidth: "20vmax",
//   navColor1: "white",
//   logoHoverSize: "10px",
//   logoHoverColor: "#eb4034",
//   link1Text: "Home",
//   link2Text: "Products",
//   link3Text: "Contact",
//   link4Text: "About",
//   link1Url: "/",
//   link2Url: "/products",
//   link3Url: "/contact",
//   link4Url: "/about",
//   link1Size: "1.3vmax",
//   link1Color: "rgba(35, 35, 35,0.8)",
//   nav1justifyContent: "flex-end",
//   nav2justifyContent: "flex-end",
//   nav3justifyContent: "flex-start",
//   nav4justifyContent: "flex-start",
//   link1ColorHover: "#eb4034",
//   link1Margin: "1vmax",
//   profileIconUrl: "/login",
//   profileIconColor: "rgba(35, 35, 35,0.8)",
//   searchIconColor: "rgba(35, 35, 35,0.8)",
//   cartIconColor: "rgba(35, 35, 35,0.8)",
//   profileIconColorHover: "#eb4034",
//   searchIconColorHover: "#eb4034",
//   cartIconColorHover: "#eb4034",
//   cartIconMargin: "1vmax",
// };

// const Header = () => {
//   return <ReactNavbar {...options} />;
// };

// export default Header;
