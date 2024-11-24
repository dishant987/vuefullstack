<script setup>

import { onMounted } from 'vue';
import Navbar from './components/Navbar.vue'
import { setLogin, userStore } from '../store/store';

onMounted(() => {
    const token = localStorage.getItem("auth-token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
        setLogin(true); // Set login state
        userStore.user = user; // Restore user data
    } else {
        setLogin(false); // Ensure logged-out state if no token/user
        if (userStore.clearUser) {
            userStore.clearUser(); // Clear user data if clearUser method exists
        }
    }
});
</script>

<template>
    <Navbar />
    <router-view></router-view>
</template>
