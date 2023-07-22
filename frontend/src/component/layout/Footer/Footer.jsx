import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        
        <h4>GET OUR APP </h4>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>CELLKART.</h1>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2023 &copy; SamadurKhan</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://www.facebook.com/samadur.khan.3">Facebook</a>  {/*Improve */}
        <a href="https://www.youtube.com/watch?v=AKtTeEYG2uc&ab_channel=TSports">Youtube</a>
        <a href="https://www.linkedin.com/in/samadur-khan-33143019b/">Instagram</a>
      </div>
    </footer>
  );
};

export default Footer;
