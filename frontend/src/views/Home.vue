<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';

const useData = ref([]);
const searchQuery = ref('');
const selectedFilter = ref('All');
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Fetch user data from the API
const getData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/user/users`);
        useData.value = response.data;
        console.log(response);
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
            <input v-model="searchQuery" class="px-4 py-2 border rounded" placeholder="Search by Username or email" />
            <select v-model="selectedFilter" class="px-4 py-2 border rounded">
                <option value="All">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
            </select>
        </div>


        <!-- Users Table -->
        <table  class="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
                <tr class="bg-gray-100">
                    <th class="border-b px-4 py-2 text-left">ID</th>
                    <th class="border-b px-4 py-2 text-left">Username</th>
                    <th class="border-b px-4 py-2 text-left">Email</th>
                    <th class="border-b px-4 py-2 text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in paginatedUsers" :key="user.id">
                    <td class="border-b px-4 py-2">{{ user.id }}</td>
                    <td class="border-b px-4 py-2">{{ user.username }}</td>
                    <td class="border-b px-4 py-2">{{ user.email }}</td>
                    <td class="border-b px-4 py-2 flex gap-2">

                        <button @click="editUser(user.id)"
                            class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                            Edit
                        </button>
                        <button @click="editUser(user.id)"
                            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
                            Delete
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
    </div>
</template>
