import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// filepath: c:\laragon\www\Capstone\v02\src\main.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Define Vue feature flags
// eslint-disable-next-line no-undef
// globalThis.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;

const auth = getAuth();

let app;
onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App).use(router).mount("#app");
  }
});

// ✅ Ensure Dark Mode is applied when app loads
if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}


//google authinticator/nodemailer