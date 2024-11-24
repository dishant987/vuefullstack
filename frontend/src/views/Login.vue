<script setup>
import { onMounted, ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as Yup from 'yup';
import { useToastNotification } from '../helper/useToastNotification';
import axios from 'axios';
import { authState, setLogin, userStore } from '../../store/store';
import { useRouter } from 'vue-router';
// Define validation schema using Yup
const loginSchema = Yup.object({
    email: Yup.string()
        .email('Please enter a valid email')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .required('Password is required'),
});

const router = useRouter();

const { showSuccessToast, showErrorToast } = useToastNotification();
const loading = ref(false); // Loading state

// Set up form with validation schema
const { handleSubmit, errors } = useForm({
    validationSchema: loginSchema,
});

// Define form fields
const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');

// Form submission handler
const onSubmit = handleSubmit(async (values) => {
    loading.value = true; // Start loading
    try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/auth/login`, values);

        if (res.status === 200) {
            showSuccessToast(res.data.message);
            localStorage.setItem('auth-token', res.data.token);
            setLogin(true);
            userStore.setUser(res.data.user);
            setTimeout(() => {
                router.push('/');
            }, 1000);
        }
    } catch (error) {
        if (error.response.status === 401) {
            showErrorToast(error.response.data.message);
            return
        }
        if (error.response.status === 404) {
            showErrorToast(error.response.data.message);
            return
        }
        console.log(error);
        showErrorToast('Internal Server Error');
    } finally {
        loading.value = false; // Stop loading
    }
})
onMounted(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
        router.push('/');
    }
})
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div class="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
            <!-- Title -->
            <h1 class="text-2xl font-bold text-center mb-6 dark:text-white">Login</h1>

            <!-- Form -->
            <form @submit.prevent="onSubmit">
                <!-- Email -->
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                    </label>
                    <input v-model="email" type="email" id="email" placeholder="Enter your email"
                        class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    <p v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</p>
                </div>

                <!-- Password -->
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password
                    </label>
                    <input v-model="password" type="password" id="password" placeholder="Enter your password"
                        class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>
                </div>

                <!-- Submit Button -->

                <button :disabled="loading" type="submit"
                    class="w-full bg-blue-500 text-white py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors focus:ring-4 focus:ring-blue-300 focus:outline-none flex items-center justify-center">
                    <span v-if="loading" class="loader mr-2"></span>
                    <span>{{ loading ? 'Logging In...' : 'Login' }}</span>
                </button>
            </form>

            <!-- Additional Links -->
            <p class="text-center text-sm text-gray-500 mt-6 dark:text-gray-400">
                Don't have an account?
                <router-link to="/signup" class="text-blue-500 hover:underline">
                    Sign up
                </router-link>
            </p>
        </div>
    </div>
</template>

<style>
/* Custom Dark Mode Transition */
body {
    transition: background-color 0.3s, color 0.3s;
}

/* Loading spinner styles */
.loader {
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
