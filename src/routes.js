// src/Routes.js
// import React, { lazy, Suspense } from "react";
// import { Routes, Route } from "react-router-dom";

// // Lazy-loaded components (pages)
// const Home = lazy(() => import("./Pages/Home"));
// const About = lazy(() => import("./Pages/About"));
// const Course = lazy(() => import("./Pages/Course"));
// const SignUp = lazy(() => import("./Pages/SignUp"));
// const CoursesList = lazy(() => import("./Pages/CoursesList"));
// const ProductPage = lazy(() => import("./Pages/Product/ProductPage"));
// const AddToCartComponent = lazy(() => import("./Pages/Product/AddToCartComponent"));
// const YourBasket = lazy(() => import("./Pages/Product/YourBasket"));
// const CheckoutPage = lazy(() => import("./Pages/CheckoutPage"));

// const routes = [
//   { path: "/", element: <Home /> },
//   { path: "/about", element: <About /> },
//   { path: "/course-view", element: <Course /> },
//   { path: "/course/:slug", element: <Course /> }, 
//   { path: "/signup", element: <SignUp /> },
//   { path: "/course-list", element: <CoursesList /> },
//   { path: "/single-product-page", element: <ProductPage /> },
//   { path: "/add-to-cart", element: <AddToCartComponent /> },
//   { path: "/basket", element: <YourBasket /> },
//   { path: "/checkout", element: <CheckoutPage /> },
// ];

// const AppRoutes = () => {
//   return (

//     <Routes>
//       {routes.map((route, i) => (
//         <Route key={i} path={route.path} element={route.element} />
//       ))}
//     </Routes>
//   );
// };

// export default AppRoutes;



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
const OrderConfirmation = lazy(() => import("./Pages/Checkout/OrderConfirmation"));
const MockExams = lazy(() => import("./Pages/MockExams"));


const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/course-list", element: <CoursesList /> },
  { path: "/course-view", element: <Course /> },
  { path: "/course/:slug", element: <Course /> },
  { path: "/mock-exams", element: <MockExams /> },

  // Product Pages
  { path: "/single-product-page", element: <ProductPage /> },
  { path: "/add-to-cart", element: <AddToCartComponent /> },

  // Cart and Checkout
  { path: "/basket", element: <YourBasket /> },
  { path: "/cart", element: <YourBasket /> },               
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/checkout/:slug", element: <CheckoutPage /> },  
   { path: "/order-confirmation", element: <OrderConfirmation /> } 
];

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {routes.map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
