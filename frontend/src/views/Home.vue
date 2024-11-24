<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';
import { authState, userStore } from '../../store/store';
import { useToastNotification } from '../helper/useToastNotification';
import EditUserModal from '../components/EditUserModal.vue';

const useData = ref([]);
const searchQuery = ref('');
const selectedFilter = ref('All');
const currentPage = ref(1);
const itemsPerPage = ref(5);
const token = localStorage.getItem('auth-token');
const showEditModal = ref(false);
const selectedUserId = ref(null);

const { showSuccessToast, showErrorToast } = useToastNotification();

// Fetch user data from the API
const getData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/user/users`);
        // const user = response.data.filter((user) => user.id !== userStore.user.id);
        useData.value = response.data;
    } catch (error) {
        console.error(error);
    }
};

// Filter users based on search query and selected filter
const filteredUsers = computed(() => {
    return useData.value.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesFilter = selectedFilter.value === 'All' || user.role === selectedFilter.value;

        return matchesSearch && matchesFilter;
    });
});

// Pagination logic: Slice the filtered users to only show users for the current page
const paginatedUsers = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    return filteredUsers.value.slice(startIndex, startIndex + itemsPerPage.value);
});

// Handle the next and previous page buttons
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

// Calculate the total number of pages
const totalPages = computed(() => {
    return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
});

const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/api/user/deleteuser/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (response.status === 200) {
            showSuccessToast(response.data.message);
            getData();
        }
        console.log(response);

    } catch (error) {
        if (error.response.status === 404) {
            showErrorToast(error.response.data.message);
            return
        }
        showErrorToast('Internal Server Error');
        console.error(error);
    }
}

const editUser = (userId) => {
  selectedUserId.value = userId;
  showEditModal.value = true;
};

const inviteUser = async (id) => {

}

onMounted(() => {
    getData();
});
</script>

<template>
    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-semibold mb-4">Users List</h1>

        <!-- Search and Filter -->
        <div class="flex gap-4 mb-4">
            <input v-model="searchQuery" class="px-4 py-2 w-[350px] border rounded"
                placeholder="Search by Username or email" />
            <select v-model="selectedFilter" class="px-4 py-2 border rounded">
                <option value="All">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
            </select>
        </div>


        <!-- Users Table -->
        <table class="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
                <tr class="bg-gray-100">
                    <th class="border-b px-4 py-2 text-left">ID</th>
                    <th class="border-b px-4 py-2 text-left">Username</th>
                    <th class="border-b px-4 py-2 text-left">Email</th>
                    <th class="border-b px-4 py-2 text-left" v-if="authState.isLoggedIn">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in paginatedUsers" :key="user.id">
                    <td class="border-b px-4 py-2">{{ user.id }}</td>
                    <td class="border-b px-4 py-2">{{ user.username }}</td>
                    <td class="border-b px-4 py-2">{{ user.email }}</td>
                    <td class="border-b px-4 py-2 flex gap-2">

                        <button @click="editUser(user.id)"
                            v-if="authState.isLoggedIn && (userStore.user?.role === 'admin' || userStore.user?.id === user.id)"
                            class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                            Edit
                        </button>
                        <button @click="deleteUser(user.id)"
                            v-if="authState.isLoggedIn && userStore.user?.role === 'admin' && user.id !== userStore.user.id"
                            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
                            Delete
                        </button>
                        <button @click="inviteUser(user.id)"
                            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400">
                            Invite
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>



        <!-- Pagination -->
        <div class="flex justify-between items-center mt-4">
            <button @click="prevPage" :disabled="currentPage === 1"
                class="px-4 py-2 bg-gray-300 rounded disabled:bg-gray-200">Prev</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages"
                class="px-4 py-2 bg-gray-300 rounded disabled:bg-gray-200">Next</button>
        </div>

        <!-- Edit User Modal -->
        <EditUserModal :showModal="showEditModal" :userId="selectedUserId || null" @close="showEditModal = false" 
            @userUpdated="getData" />
    </div>
</template>
