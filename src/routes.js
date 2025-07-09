// src/Routes.js
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy-loaded components (pages)
const Home = lazy(() => import("./Pages/Home"));
const About = lazy(() => import("./Pages/About"));
const Course = lazy(() => import("./Pages/Course"));
const SignUp = lazy(() => import("./Pages/SignUp"));
const CoursesList = lazy(() => import("./Pages/CoursesList"));
const ProductPage = lazy(() => import("./Pages/Product/ProductPage"));
const AddToCartComponent = lazy(() => import("./Pages/Product/AddToCartComponent"));
const YourBasket = lazy(() => import("./Pages/Product/YourBasket"));
const CheckoutPage = lazy(() => import("./Pages/CheckoutPage"));
const AddToCartPage = lazy(() => import("./Pages/AddToCart"));
const PaymentSuccess = lazy(() => import("./Pages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./Pages/PaymentCancel"));
const ProductCard = lazy(() => import("./Pages/ProductCard"));

// const CheckoutPage = lazy(() => import("./Pages/CheckoutPage"));
const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/course-view", element: <Course /> },
  { path: "/course/:slug", element: <Course /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/course-list", element: <CoursesList /> },
  { path: "/single-product-page", element: <ProductPage /> },
  { path: "/add-to-cart", element: <AddToCartComponent /> },
  { path: "/basket", element: <YourBasket /> },
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/add-to-cart-1", element: <AddToCartPage /> },
  { path: "/payment-success", element: <PaymentSuccess /> },
  { path: "/payment-cancel", element: <PaymentCancel /> },
  { path: "/payment-card", element: <ProductCard /> },
];

const AppRoutes = () => {
  return (

    <Routes>
      {routes.map((route, i) => (
        <Route key={i} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default AppRoutes;