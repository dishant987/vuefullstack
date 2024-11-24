<script setup>
import { ref, onMounted } from 'vue';
import { authState, setLogin } from '../../store/store';
import axios from 'axios';
import { useToastNotification } from '../helper/useToastNotification';

const { showSuccessToast } = useToastNotification();
const isMenuOpen = ref(false);
const isLoading = ref(false); // Loading state
const token = ref(localStorage.getItem('auth-token'));
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const logout = async () => {
  isLoading.value = true; // Start loading
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URI}/api/auth/logout`,
      {},
      {
        headers: {
          "Authorization": `Bearer ${token.value}`,
          "content-type": 'application/json',
        },
      }
    );
    showSuccessToast(res.data.message);
    localStorage.removeItem('auth-token'); // Clear the token from localStorage
    setLogin(false); // Update the global login state
  } catch (error) {
    console.error('Logout failed:', error);
    showSuccessToast("Logout failed");
    // localStorage.removeItem('auth-token'); // Clear the token from localStorage
    // setLogin(false); // Update the global login state
  } finally {
    isLoading.value = false; // Stop loading
  }
};


const checkTokenValidity = () => {
  const token = localStorage.getItem('auth-token');
  if (!token) {
    setLogin(false);
    return;
  }

  try {
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const isTokenExpired = tokenPayload.exp * 1000 < Date.now(); // Compare expiration time
    if (isTokenExpired) {
      logout(); // Call logout if token is expired
    } else {
      setLogin(true); // Token is valid
    }
  } catch (error) {
    console.error('Invalid token:', error);
    logout(); // Logout on error
  }
};

onMounted(() => {
  checkTokenValidity();
});

</script>

<template>
  <nav class="bg-gray-800 text-white shadow-md">
    <div class="container mx-auto flex items-center justify-between p-4">
      <!-- Logo or Title -->
      <h1 class="text-3xl font-bold">Auth</h1>

      <!-- Desktop Menu -->
      <ul class="hidden md:flex gap-6 items-center">
        <router-link class="hover:text-gray-300 transition duration-300" to="/">
          Dashboard
        </router-link>
        <router-link class="hover:text-gray-300 transition duration-300" to="/services">
          Services
        </router-link>
        <router-link class="hover:text-gray-300 transition duration-300" to="/contact">
          Contact
        </router-link>
        <router-link v-if="authState.isLoggedIn" class="hover:text-gray-300 transition duration-300" to="/userprofile">
          Profile
        </router-link>


        <!-- Login/Signup or Logout Buttons -->
        <template v-if="!authState.isLoggedIn">
          <router-link to="/login"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition duration-300">
            Login
          </router-link>
          <router-link to="/signup"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition duration-300">
            Signup
          </router-link>
        </template>
        <button v-else @click="logout"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition duration-300 flex items-center gap-2"
          :disabled="isLoading">
          <span v-if="isLoading" class="loader"></span>
          <span v-else>Logout</span>
        </button>
      </ul>


      <button @click="toggleMenu"
        class="md:hidden flex items-center px-3 py-2 border rounded text-gray-400 border-gray-600 hover:text-white hover:border-white">
        <svg class="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path v-if="!isMenuOpen" d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          <path v-if="isMenuOpen"
            d="M4.293 16.707a1 1 0 001.414 0L10 12.414l4.293 4.293a1 1 0 101.414-1.414L11.414 11l4.293-4.293a1 1 0 00-1.414-1.414L10 9.586 5.707 5.293a1 1 0 00-1.414 1.414L8.586 11l-4.293 4.293a1 1 0 000 1.414z" />
        </svg>
      </button>
    </div>

    <!-- Mobile Menu -->
    <transition name="dropdown">
      <ul v-if="isMenuOpen" class="flex flex-col gap-4 items-center bg-gray-700 md:hidden px-4 py-6">
        <router-link class="hover:text-gray-300 transition duration-300" to="/">
          Dashboard
        </router-link>
        <router-link class="hover:text-gray-300 transition duration-300" to="/services">
          Services
        </router-link>
        <router-link class="hover:text-gray-300 transition duration-300" to="/contact">
          Contact
        </router-link>

        <!-- Login/Signup or Logout Buttons (Mobile) -->
        <template v-if="!isLoggedIn">
          <router-link to="/login"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition duration-300 w-full text-center">
            Login
          </router-link>
          <router-link to="/signup"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition duration-300 w-full text-center">
            Signup
          </router-link>
        </template>
        <button v-else @click="logout"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition duration-300 flex items-center gap-2"
          :disabled="isLoading">
          <span v-if="isLoading" class="loader"></span>
          <span v-else>Logout</span>
        </button>
      </ul>
    </transition>
  </nav>
</template>

<style>
/* Dropdown Transition Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease-in-out;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
