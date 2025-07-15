// src/App.js
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Provider } from "react-redux"; // ✅ Redux Provider
import { store } from "./redux/store";  // ✅ Your Redux store

import Navbar from "./Pages/Navbar";
import AppRoutes from "./routes";
import Footer from "./Pages/Footer";
import theme from "./Pages/theme";

function App() {
  return (
    <Provider store={store}> {/* ✅ Wrap your entire app in Redux provider */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Navbar />
          <AppRoutes />
          <Footer />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
