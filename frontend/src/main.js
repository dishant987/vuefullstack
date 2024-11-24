import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Contact from "./views/Contact.vue";
import Services from "./views/Services.vue";
import Login from "./views/Login.vue";
import SignUp from "./views/SignUp.vue";
import UserProfile from "./views/UserProfile.vue";
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";

const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/contact", component: Contact, name: "Contact" },
  { path: "/services", component: Services, name: "Services" },
  { path: "/login", component: Login, name: "Login" },
  { path: "/signup", component: SignUp, name: "SignUp" },
  { path: "/userprofile", component: UserProfile, name: "UserProfile" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).use(ToastPlugin).mount("#app");
