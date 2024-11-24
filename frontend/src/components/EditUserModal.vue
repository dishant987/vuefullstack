<script setup>
import { ref, watch, onMounted } from 'vue';
import { useToastNotification } from '../helper/useToastNotification';
import axios from 'axios';

const props = defineProps({
    userId: {
        type: String || null,
        required: true
    },
    showModal: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['close', 'userUpdated']);
const userData = ref({ id: '', username: '', email: '' });
const token = localStorage.getItem('auth-token');
const { showSuccessToast, showErrorToast } = useToastNotification();

const fetchUser = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/user/singleuser/${props.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        userData.value = response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

const updateUser = async () => {

    try {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URI}/api/user/updateuser`,
            userData.value,
            {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            }
        );
        if (response.status === 200) {
            showSuccessToast(response.data.message);
            emit('userUpdated'); // Notify parent to refresh data
            emit('close'); // Close the modal
        }

    } catch (error) {
        if (error.response.status === 404) {
            showErrorToast(error.response.data.message);
            return
        }
        console.error('Error updating user:', error);
        showErrorToast('Failed to update user details');
    }
};

watch(
    () => props.showModal,
    (newVal) => {
        if (newVal) {
            fetchUser();
        }
    }
);
</script>

<template>
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white p-6 rounded shadow-lg w-[400px]">
            <h2 class="text-lg font-semibold mb-4">Edit User</h2>
            <form @submit.prevent="updateUser">
                <div class="mb-4">
                    <label for="username" class="block text-sm font-medium mb-1">Username</label>
                    <input required id="username" v-model="userData.username" type="text"
                        class="w-full px-4 py-2 border rounded" />
                </div>
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium mb-1">Email</label>
                    <input required id="email" v-model="userData.email" type="email"
                        class="w-full px-4 py-2 border rounded" />
                </div>
                <div class="flex justify-end gap-4">
                    <button type="button" @click="emit('close')"
                        class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Update
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
