<script setup>
import { ref, onMounted } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as Yup from 'yup';
import axios from 'axios'; // Assuming you're using axios for API calls
import { userStore } from '../../store/store';
import { useToastNotification } from '../helper/useToastNotification';

const token = localStorage.getItem('auth-token');
const loading = ref(false); // Loading state
// Define validation schema for the profile form
const profileSchema = Yup.object({
    username: Yup.string()
        .min(3, 'Username must be at least 3 characters long')
        .required('Username is required'),
    email: Yup.string()
        .email('Please enter a valid email')
        .required('Email is required'),
    password: Yup.string().optional()
        .min(6, 'Password must be at least 6 characters long'),
    confirmPassword: Yup.string().optional()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
});


// Setup the form validation
const { handleSubmit, resetForm } = useForm({
    validationSchema: profileSchema,
});
const { showSuccessToast, showErrorToast } = useToastNotification();

// Define the fields
const { value: username, errorMessage: usernameError } = useField('username', userStore.user?.username || '');
const { value: email, errorMessage: emailError } = useField('email', userStore.user?.email || '');
const { value: password, errorMessage: passwordError } = useField('password');
const { value: confirmPassword, errorMessage: confirmPasswordError } = useField('confirmPassword');


// Update user data after form submission
const updateUserProfile = async (values) => {
    loading.value = true

    try {
        const res = await axios.put(`${import.meta.env.VITE_BACKEND_URI}/api/user/userprofile`, values, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }); // Adjust the endpoint as needed
        if (res.status === 200) {
            showSuccessToast(res.data.message);
            userStore.setUser(res.data.user);

        }

    } catch (error) {
        if (error.response.status === 404) {
            showErrorToast(error.response.data.message);
            return
        }
        if (error.response.status === 400) {
            showErrorToast(error.response.data.message);
            return
        }
        console.error('Error updating profile:', error);
        showErrorToast('Error updating profile');
    } finally {
        loading.value = false
    }
};

onMounted(() => {
    resetForm({ values: userStore.user || {} });
});

// Form submission handler
const onSubmit = handleSubmit(updateUserProfile);
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div class="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
            <!-- Profile Picture Section -->
            <div class="text-center">
                <div class="relative inline-block">
                    <img src="/1.png" alt="Profile Picture"
                        class="profile-img w-24 h-24 rounded-full object-cover border-2 border-blue-500 mx-auto mb-4 " />
                </div>
            </div>


            <h1 class="text-2xl font-bold text-center mb-6 dark:text-white">User Profile</h1>

            <!-- Form -->
            <form @submit.prevent="onSubmit">
                <!-- Username -->
                <div class="mb-4">
                    <input v-model="username" type="text" id="username" placeholder="Enter your username"
                        class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    <p v-if="usernameError" class="text-red-500 text-sm mt-1">{{ usernameError }}</p>
                </div>

                <!-- Email -->
                <div class="mb-4">
                    <input v-model="email" type="email" id="email" placeholder="Enter your email"
                        class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    <p v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</p>
                </div>

                <!-- Password -->
                <div class="mb-4">
                    <input v-model="password" type="password" id="password" placeholder="New Password (optional)"
                        class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>
                </div>

                <!-- Confirm Password -->
                <div class="mb-4">
                    <input v-model="confirmPassword" type="password" id="confirmPassword"
                        placeholder="Confirm New Password (if entered)"
                        class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    <p v-if="confirmPasswordError" class="text-red-500 text-sm mt-1">{{ confirmPasswordError }}</p>
                </div>



                <!-- Submit Button -->
                <button :disabled="loading" type="submit"
                    class="w-full bg-blue-500 text-white py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors focus:ring-4 focus:ring-blue-300 focus:outline-none flex items-center justify-center ">
                    <span v-if="loading" class="loader mr-2"></span>
                    <span>{{ loading ? 'Updating...' : 'Update Profile' }}</span>
                </button>
            </form>

            <!-- Additional Links -->
            <p class="text-center text-sm text-gray-500 mt-6 dark:text-gray-400">
                Don't want to update?
                <router-link to="/" class="text-blue-500 hover:underline">
                    Go to Home
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

.profile-img {
    transition: transform 0.3s ease;
    /* Smooth scaling */
}

.profile-img:hover {
    transform: scale(1.1);
    /* Scale up the image on hover */
}
</style>
