import React, { Fragment, useEffect } from "react";
import ProductCard from "./ProductCard.jsx";
import "./Home.css";
import MetaData from "../layout/MetaData.jsx";
import { clearErrors, getProduct } from "../../actions/productActions.jsx";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader.jsx";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, products } = useSelector((state) => state.products);

  const productPageRedirect = () => {
    navigate("/products");
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="CellKart.- The best online store for mobile phones" />
          <div title="Click here to view all products">
            <div
              
              className="banner"
              onClick={productPageRedirect}
            >
              <p>Welcome to The Cellkart</p>
              <h1>The best online store for mobile phones</h1>
              <a href="#homeHeading">
              </a>
              
            </div>
          </div>

          <h2 className="homeHeading" id="homeHeading">
            Featured Products
          </h2>

          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
