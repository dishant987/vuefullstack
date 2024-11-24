<script setup>
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as Yup from 'yup';
import { useToastNotification } from '../helper/useToastNotification';
import axios from 'axios';

const token = localStorage.getItem('auth-token');
// Define validation schema using Yup
const addUserSchema = Yup.object({
    username: Yup.string()
        .min(3, 'Username must be at least 3 characters long')
        .required('Username is required'),
    email: Yup.string()
        .email('Please enter a valid email')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .required('Password is required'),
    role: Yup.string()
        .oneOf(['admin', 'user'], 'Invalid role selected')
        .required('Role is required'),
});

const isModalOpen = ref(false); // Modal visibility state
const loading = ref(false); // Loading state
const emit = defineEmits(['userAdded']);
const { showSuccessToast, showErrorToast } = useToastNotification();

// Set up form with validation schema
const { handleSubmit, resetForm } = useForm({
    validationSchema: addUserSchema,
});

// Define form fields
const { value: username, errorMessage: usernameError } = useField('username');
const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');
const { value: role, errorMessage: roleError } = useField('role');

// Open modal
const openModal = () => {
    isModalOpen.value = true;
};

// Close modal
const closeModal = () => {
    isModalOpen.value = false;
    resetForm(); // Reset form fields when closing the modal
};

// Form submission handler
const onSubmit = handleSubmit(async (values) => {
    loading.value = true; // Start loading
    try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/user/add`, values, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status === 201) {
            showSuccessToast(res.data.message);
            emit('userAdded');
            closeModal();
        }
    } catch (error) {
        console.error(error);
        if (error.response.status === 401) {
            showErrorToast(error.response.data.message);
            return
        }
        if (error.response.status === 400) {
            showErrorToast(error.response.data.message);
            return
        }
        showErrorToast('Failed to add user');
    } finally {
        loading.value = false; // Stop loading
    }
});
</script>

<template>
    <div>
        <!-- Add User Button -->
        <button @click="openModal"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg  hover:bg-blue-600 duration-300 transition-colors">
            Add User
        </button>

        <!-- Modal -->
        <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-lg shadow-lg">
                <!-- Modal Header -->
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-bold dark:text-white">Add User</h2>
                    <button @click="closeModal" class="text-gray-500 hover:text-red-500">
                        ✖
                    </button>
                </div>

                <!-- Form -->
                <form @submit.prevent="onSubmit">
                    <!-- Username -->
                    <div class="mb-4">
                        <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Username
                        </label>
                        <input v-model="username" type="text" id="username" placeholder="Enter username"
                            class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                        <p v-if="usernameError" class="text-red-500 text-sm mt-1">{{ usernameError }}</p>
                    </div>

                    <!-- Email -->
                    <div class="mb-4">
                        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <input v-model="email" type="email" id="email" placeholder="Enter email"
                            class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                        <p v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</p>
                    </div>

                    <!-- Password -->
                    <div class="mb-4">
                        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Password
                        </label>
                        <input v-model="password" type="password" id="password" placeholder="Enter password"
                            class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                        <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>
                    </div>

                    <!-- Role -->
                    <div class="mb-4">
                        <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Role
                        </label>
                        <select v-model="role" id="role"
                            class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                            <option value="" disabled>Select role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                        <p v-if="roleError" class="text-red-500 text-sm mt-1">{{ roleError }}</p>
                    </div>

                    <!-- Submit Button -->
                    <button :disabled="loading" type="submit"
                        class="w-full bg-blue-500 text-white py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors focus:ring-4 focus:ring-blue-300 focus:outline-none flex items-center justify-center">
                        <span v-if="loading" class="loader mr-2"></span>
                        <span>{{ loading ? 'Adding...' : 'Add User' }}</span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<style>
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
