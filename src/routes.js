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
const AddToCartMockExam = lazy(() => import("./Pages/Product/AddToCartMockExam"));
const AddToCartPaper = lazy(() => import("./Pages/Product/AddToCartPaper"));
const YourBasket = lazy(() => import("./Pages/Product/YourBasket"));
const CheckoutPage = lazy(() => import("./Pages/CheckoutPage"));
const OrderConfirmation = lazy(() => import("./Pages/Checkout/OrderConfirmation"));
const MockExams = lazy(() => import("./Pages/MockExams"));
const Papers = lazy(() => import("./Pages/Papers"));
const MyPapers = lazy(() => import("./Pages/Student/MyPapers"));
const MyPaperPurchases = lazy(() => import("./Pages/Student/MyPaperPurchases"));
const StartPaper = lazy(() => import("./Pages/Student/StartPaper"));
const TakePaper = lazy(() => import("./Pages/Student/TakePaper"));
const PaperResults = lazy(() => import("./Pages/Student/PaperResults"));
const PaymentSuccess = lazy(() => import("./Pages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./Pages/PaymentCancel"));
const RegistrationSuccess = lazy(() => import("./Pages/RegistrationSuccess"));


const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/course-list", element: <CoursesList /> },
  { path: "/course-view", element: <Course /> },
  { path: "/course/:slug", element: <Course /> },
  { path: "/mock-exams", element: <MockExams /> },
  { path: "/papers", element: <Papers /> },

  // Student Paper Pages
  { path: "/student/my-papers", element: <MyPapers /> },
  { path: "/student/paper/purchases", element: <MyPaperPurchases /> },
  { path: "/student/paper/:paperId/start", element: <StartPaper /> },
  { path: "/student/paper/:purchaseId/take", element: <TakePaper /> },
  { path: "/student/paper/:purchaseId/results", element: <PaperResults /> },

  // Product Pages
  { path: "/single-product-page", element: <ProductPage /> },
  { path: "/add-to-cart", element: <AddToCartComponent /> },
  { path: "/add-to-cart/mock-exam/:slug", element: <AddToCartMockExam /> },
  { path: "/add-to-cart/paper/:slug", element: <AddToCartPaper /> },

  // Cart and Checkout
  { path: "/basket", element: <YourBasket /> },
  { path: "/cart", element: <YourBasket /> },               
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/checkout/:slug", element: <CheckoutPage /> },  
  { path: "/order-confirmation", element: <OrderConfirmation /> },

  // Payment Pages
  { path: "/payment-success", element: <PaymentSuccess /> },
  { path: "/payment-cancel", element: <PaymentCancel /> },
  { path: "/paper/payment-success", element: <PaymentSuccess /> },
  { path: "/parent/paper/payment-success", element: <PaymentSuccess /> },
  
  // Registration Success
  { path: "/registration-success", element: <RegistrationSuccess /> } 
];

const AppRoutes = () => {
  return (
    <Suspense fallback={<div></div>}>
      <Routes>
        {routes.map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
