import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import { ThemeWrapper } from "./components/theme/Theme.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <HelmetProvider>
      <ThemeWrapper>
        <div onContextMenu={(e) => e.preventDefault()}>
          <App />
        </div>
      </ThemeWrapper>
    </HelmetProvider>
    <Toaster />
  </Provider>
);
