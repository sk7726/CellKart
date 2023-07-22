import WebFont from "webfontloader";
import React, { Fragment, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { useSelector } from "react-redux";

import "./App.css";
import Header from "./component/layout/Header/Header.jsx";
import Footer from "./component/layout/Footer/Footer.jsx";
import Home from "./component/Home/Home.jsx";
import ProductDetails from "./component/Product/ProductDetails.jsx";
import Products from "./component/Product/Products.jsx";
import Search from "./component/Product/Search.jsx";
import store from "./Store.jsx";
import LoginSignup from "./component/User/LoginSignUp";
import Profile from "./component/User/Profile.jsx";
import UpdateProfile from "./component/User/UpdateProfile.jsx";
import UpdatePassword from "./component/User/UpdatePassword.jsx";
import ForgotPassword from "./component/User/ForgotPassword.jsx";
import ResetPassword from "./component/User/ResetPassword.jsx";
import { loadUser } from "./actions/userActions.jsx";
import UserOptions from "./component/layout/Header/UserOptions.jsx";
import Cart from "./component/Cart/Cart.jsx";
import Shipping from "./component/Cart/Shipping.jsx";
import ConfirmOrder from "./component/Cart/ConfirmOrder.jsx";
import Payment from "./component/Cart/Payment.jsx";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.jsx";
import MyOrders from "./component/Order/MyOrders.jsx";
import OrderDetails from "./component/Order/OrderDetails.jsx";
import Dashboard from "./component/Admin/Dashboard.jsx";
import ProductList from "./component/Admin/ProductList.jsx";
import OrderList from "./component/Admin/OrderList.jsx";
import NewProduct from "./component/Admin/NewProduct.jsx";
import UpdateProduct from "./component/Admin/UpdateProduct.jsx";
import ProcessOrder from "./component/Admin/ProcessOrder.jsx";
import UsersList from "./component/Admin/UsersList.jsx";
import UpdateUser from "./component/Admin/UpdateUser.jsx";
import ProductReviews from "./component/Admin/ProductReviews.jsx";
import NotFound from "./component/layout/Not Found/NotFound.jsx";

function App() {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }

  const StripeLayout = ({ stripeApiKey }) => {
    return stripeApiKey ? <Outlet /> : <Navigate to="/process/payment" />;
  };

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);

  // window.addEventListener("contextmenu", (e) => e.preventDefault());

  const Protected = ({ isAdmin, children }) => {
    if (loading === false && isAuthenticated === false) {
      return <Navigate to="/login" />;
    }

    if (loading === false && isAdmin === true && user.role !== "admin") {
      return <Navigate to="/login" />;
    }

    return <Fragment>{loading === false ? children : null}</Fragment>;
  };

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />

        <Route
          path="/account"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />
        <Route path="/login" element={<LoginSignup />} />

        <Route
          path="/me/update"
          element={
            <Protected>
              <UpdateProfile />
            </Protected>
          }
        />
        <Route
          path="/password/update"
          element={
            <Protected>
              <UpdatePassword />
            </Protected>
          }
        />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/shipping"
          element={
            <Protected>
              <Shipping />
            </Protected>
          }
        />

        <Route
          path="/order/confirm"
          element={
            <Protected>
              <ConfirmOrder />
            </Protected>
          }
        />

        {/* <Elements stripe={loadStripe(stripeApiKey)}>
          <Route
            path="/process/payment"
            element={
              <Protected>
                <Payment />
              </Protected>
            }
          />
        </Elements> */}

        <Route element={<StripeLayout {...{ stripeApiKey }} />}>
          <Route
            path="/process/payment"
            element={
              <Elements stripe={loadStripe(stripeApiKey)}>
                <Payment />
              </Elements>
            }
          />
        </Route>

        <Route
          path="/success"
          element={
            <Protected>
              <OrderSuccess />
            </Protected>
          }
        />

        <Route
          path="/orders"
          element={
            <Protected>
              <MyOrders />
            </Protected>
          }
        />

        <Route
          path="/order/:id"
          element={
            <Protected>
              <OrderDetails />
            </Protected>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <Protected isAdmin={true}>
              <Dashboard />
            </Protected>
          }
        />

        <Route
          path="/admin/products"
          element={
            <Protected isAdmin={true}>
              <ProductList />
            </Protected>
          }
        />

        <Route
          path="/admin/product"
          element={
            <Protected isAdmin={true}>
              <NewProduct />
            </Protected>
          }
        />

        <Route
          path="/admin/product/:id"
          element={
            <Protected isAdmin={true}>
              <UpdateProduct />
            </Protected>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <Protected isAdmin={true}>
              <OrderList />
            </Protected>
          }
        />

        <Route
          path="/admin/order/:id"
          element={
            <Protected isAdmin={true}>
              <ProcessOrder />
            </Protected>
          }
        />

        <Route
          path="/admin/users"
          element={
            <Protected isAdmin={true}>
              <UsersList />
            </Protected>
          }
        />

        <Route
          path="/admin/user/:id"
          element={
            <Protected isAdmin={true}>
              <UpdateUser />
            </Protected>
          }
        />

        <Route
          path="/admin/reviews"
          element={
            <Protected isAdmin={true}>
              <ProductReviews />
            </Protected>
          }
        />

        <Route
          path="*"
          element={
            window.location.pathname === "/process/payment" ? null : (
              <NotFound />
            )
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
