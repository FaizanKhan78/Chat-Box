import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import { ThemeWrapper } from "./components/theme/Theme.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { Toaster } from "react-hot-toast";

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register(`${process.env.PUBLIC_URL}/firebase-messaging-sw.js`)
//     .then((registration) => {
//       console.log("Service Worker registered with scope:", registration.scope);
//     })
//     .catch((error) => console.error("Service Worker registration failed:", error));
// }

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
