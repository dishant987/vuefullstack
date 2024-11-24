<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useForm, useField, Form } from 'vee-validate';
import * as Yup from 'yup';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import {useRouter} from 'vue-router';

// Define validation schema
const signupSchema = Yup.object({
    username: Yup.string()
        .min(3, 'Username must be at least 3 characters long')
        .required('Username is required'),
    email: Yup.string()
        .email('Please enter a valid email')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .required('Password is required'),
});

const router = useRouter();

const toast = useToast();
const loading = ref(false); // Loading state

// Setup form with validation schema
const { handleSubmit } = useForm({
    validationSchema: signupSchema,
});

// Define form fields
const { value: username, errorMessage: usernameError } = useField('username');
const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');

// Form submission handler
const onSubmit = handleSubmit(async (values) => {
    loading.value = true; // Start loading
    try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/auth/signup`, values);
        console.log(res);
        if (res.status === 201) {
            toast.success(res.data.message,{
                position: 'top-right'
            })
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        }
    } catch (error) {
        console.log(error);
        if (error.response.status === 400) {
            toast.error(error.response.data.message);
            return  
        }
        toast.error('Internal Server Error');
    } finally {
        loading.value = false; // Stop loading
    }
});

onMounted(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
        router.push('/');
    }
})

</script>


<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div class="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
            <!-- Title -->
            <h1 class="text-2xl font-bold text-center mb-6 dark:text-white">Sign Up</h1>

            <!-- Form -->
            <form @submit.prevent="onSubmit">
                <!-- Username -->
                <div class="mb-4">
                    <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Username
                    </label>
                    <input v-model="username" type="text" id="username" placeholder="Enter your username"
                        class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    <p v-if="usernameError" class="text-red-500 text-sm mt-1">{{ usernameError }}</p>
                </div>

                <!-- Email -->
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Email
                    </label>
                    <input v-model="email" type="email" id="email" placeholder="Enter your email"
                        class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    <p v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</p>
                </div>

                <!-- Password -->
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
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
                    <span>{{ loading ? 'Signing Up...' : 'Sign Up' }}</span>
                </button>
            </form>

            <!-- Additional Links -->
            <p class="text-center text-sm text-gray-500 mt-6 dark:text-gray-400">
                Already have an account?
                <router-link to="/login" class="text-blue-500 hover:underline">
                    Login
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
