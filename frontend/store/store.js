import { reactive } from "vue";

export const authState = reactive({
  isLoggedIn: false, // Default login state
});

export const setLogin = (state) => {
  authState.isLoggedIn = state;
};

export const userStore = reactive({
  user: JSON.parse(localStorage.getItem("user")) || null, // Load user from localStorage or set null
  setUser(user) {
    this.user = user;
    localStorage.setItem("user", JSON.stringify(user)); // Save to localStorage
  },
  clearUser() {
    this.user = null;
    localStorage.removeItem("user"); // Remove from localStorage
  },
});
