<template>
  <div class="main-content">
    <AdminNavigationBar />
    <div class="admin-wrapper">
      <!-- Background Pattern -->
      <div class="background-pattern">
        <div class="pattern-overlay"></div>
      </div>

      <!-- Admin Card -->
      <div class="admin-card">
        <div class="card-header">
  <div class="logo-container">
    <img src="@/assets/proculogo.png" alt="Procurement System Logo" class="logo" />
  </div>
  <div class="text-container">
    <h1 class="title">User Management</h1>
    <p class="subtitle">Manage system users and their permissions</p>
  </div>
</div>

        <div class="card-content">
          <!-- Search and Filter -->
          <div class="controls">
            <div class="search-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search users..."
                @input="filterUsers"
              >
            </div>
            <select v-model="statusFilter" @change="filterUsers" class="filter-select">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="deactivated">Deactivated</option>
            </select>
            <select v-model="roleFilter" @change="filterUsers" class="filter-select">
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading users...</p>
          </div>

          <!-- Error Message -->
          <div v-else-if="errorMessage" class="error-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="error-icon"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <p>{{ errorMessage }}</p>
            <button @click="fetchUsers" class="retry-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="retry-icon"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
              Retry
            </button>
          </div>

          <!-- Users Table -->
          <div v-else-if="filteredUsers.length" class="table-container">
            <table>
              <thead>
                <tr>
                  <th>
                    <div class="th-content">
                      <span>User</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sort-icon" @click="sortUsers('username')"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                    </div>
                  </th>
                  <th>
                    <div class="th-content">
                      <span>Email</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sort-icon" @click="sortUsers('email')"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                    </div>
                  </th>
                  <th>
                    <div class="th-content">
                      <span>Role</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sort-icon" @click="sortUsers('role')"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                    </div>
                  </th>
                  <th>
                    <div class="th-content">
                      <span>Status</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sort-icon" @click="sortUsers('status')"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                    </div>
                  </th>
                  <th>
                    <div class="th-content">
                      <span>Last Active</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sort-icon" @click="sortUsers('lastActive')"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                    </div>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in paginatedUsers" :key="user.id" :class="{ 'deactivated': user.status === 'deactivated' }">
                  <td>
                    <div class="user-info">
                      <img :src="user.profileImageUrl || defaultAvatar" :alt="user.username">
                      <span>{{ user.username || "Unknown" }}</span>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <div class="role-badge" :class="user.role">
                      <select 
                        v-model="user.role" 
                        @change="updateUserRole(user)"
                        :disabled="user.status === 'deactivated'"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <span class="status-badge" :class="user.status">
                      <svg v-if="user.status === 'active'" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                      {{ user.status === 'deactivated' ? 'Deactivated' : 'Active' }}
                    </span>
                  </td>
                  <td>
                    <span class="last-active">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="clock-icon"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {{ formatLastActive(user.lastLogin) }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button 
                        v-if="user.status === 'active'" 
                        @click="confirmDeactivation(user)" 
                        class="action-btn deactivate"
                        title="Deactivate User"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="4" x2="7" y2="20"/></svg>
                      </button>
                      <button 
                        v-else 
                        @click="confirmReactivation(user)" 
                        class="action-btn reactivate"
                        title="Reactivate User"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
                      </button>
                      <button 
                        @click="confirmDeletion(user)" 
                        class="action-btn delete"
                        title="Delete User"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Pagination -->
            <div class="pagination">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1"
                class="page-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <span>Page {{ currentPage }} of {{ totalPages }}</span>
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                class="page-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>

          <div v-else class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
            <p>No users found</p>
            <span>Try adjusting your search or filters</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header" :class="modalType">
          <h3>
            <svg v-if="modalType === 'deactivate'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="modal-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="4" x2="7" y2="20"/></svg>
            <svg v-else-if="modalType === 'reactivate'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="modal-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
            <svg v-else-if="modalType === 'delete'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="modal-icon"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            {{ modalTitle }}
          </h3>
          <button class="close-btn" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="modal-body">
          <p>{{ modalMessage }}</p>
          <div v-if="modalType === 'deactivate'" class="warning-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="warning-icon"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            <span>This will prevent the user from accessing their account</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button 
            :class="['confirm-btn', modalType]" 
            @click="handleModalConfirm"
          >
            {{ modalConfirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getAuth } from 'firebase/auth';
import { 
  getDoc, 
  doc, 
  collection, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';

// State
const users = ref([]);
const loading = ref(true);
const errorMessage = ref('');
const searchQuery = ref('');
const statusFilter = ref('all');
const roleFilter = ref('all');
const currentPage = ref(1);
const itemsPerPage = 10;
const sortField = ref('username');
const sortDirection = ref('asc');
const defaultAvatar = "https://ui-avatars.com/api/?background=0F2942&color=fff";

// Modal State
const showModal = ref(false);
const modalType = ref('');
const modalUser = ref(null);
const modalTitle = computed(() => {
  switch (modalType.value) {
    case 'deactivate': return 'Deactivate User';
    case 'reactivate': return 'Reactivate User';
    case 'delete': return 'Delete User';
    default: return '';
  }
});
const modalMessage = computed(() => {
  if (!modalUser.value) return '';
  switch (modalType.value) {
    case 'deactivate':
      return `Are you sure you want to deactivate ${modalUser.value.username}?`;
    case 'reactivate':
      return `Are you sure you want to reactivate ${modalUser.value.username}?`;
    case 'delete':
      return `Are you sure you want to delete ${modalUser.value.username}? This action cannot be undone.`;
    default:
      return '';
  }
});
const modalConfirmText = computed(() => {
  switch (modalType.value) {
    case 'deactivate': return 'Deactivate';
    case 'reactivate': return 'Reactivate';
    case 'delete': return 'Delete';
    default: return 'Confirm';
  }
});

// Computed
const filteredUsers = computed(() => {
  let filtered = [...users.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user => 
      user.username?.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(user => user.status === statusFilter.value);
  }
  if (roleFilter.value !== 'all') {
    filtered = filtered.filter(user => user.role === roleFilter.value);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    const aVal = a[sortField.value] || '';
    const bVal = b[sortField.value] || '';
    return sortDirection.value === 'asc' 
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  return filtered;
});

const totalPages = computed(() => 
  Math.ceil(filteredUsers.value.length / itemsPerPage)
);

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

// Methods
const fetchUsers = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const adminRef = doc(db, 'users', currentUser.uid);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists() || adminSnap.data().role !== 'admin') {
      throw new Error('Access denied. Admins only.');
    }

    const usersCollection = collection(db, 'users');
    onSnapshot(usersCollection, (snapshot) => {
      users.value = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      loading.value = false;
    });
  } catch (error) {
    errorMessage.value = error.message;
    loading.value = false;
  }
};

const filterUsers = () => {
  currentPage.value = 1; // Reset to first page when filtering
};

const updateUserRole = async (user) => {
  if (user.status === 'deactivated') {
    errorMessage.value = 'Cannot change role of a deactivated user. Reactivate first.';
    setTimeout(() => {
      errorMessage.value = '';
    }, 3000);
    return;
  }

  try {
    await updateDoc(doc(db, 'users', user.id), { role: user.role });
    // Success message could be shown here
  } catch (error) {
    errorMessage.value = 'Error updating role: ' + error.message;
    setTimeout(() => {
      errorMessage.value = '';
    }, 3000);
  }
};

const deactivateUser = async (user) => {
  try {
    await updateDoc(doc(db, 'users', user.id), { status: 'deactivated' });
    // Success message could be shown here
  } catch (error) {
    errorMessage.value = 'Error deactivating user: ' + error.message;
    setTimeout(() => {
      errorMessage.value = '';
    }, 3000);
  }
};

const reactivateUser = async (user) => {
  try {
    await updateDoc(doc(db, 'users', user.id), { status: 'active' });
    // Success message could be shown here
  } catch (error) {
    errorMessage.value = 'Error reactivating user: ' + error.message;
    setTimeout(() => {
      errorMessage.value = '';
    }, 3000);
  }
};

const deleteUser = async (user) => {
  try {
    await deleteDoc(doc(db, 'users', user.id));
    // Success message could be shown here
  } catch (error) {
    errorMessage.value = 'Error deleting user: ' + error.message;
    setTimeout(() => {
      errorMessage.value = '';
    }, 3000);
  }
};

// Modal handlers
const confirmDeactivation = (user) => {
  modalType.value = 'deactivate';
  modalUser.value = user;
  showModal.value = true;
};

const confirmReactivation = (user) => {
  modalType.value = 'reactivate';
  modalUser.value = user;
  showModal.value = true;
};

const confirmDeletion = (user) => {
  modalType.value = 'delete';
  modalUser.value = user;
  showModal.value = true;
};

const handleModalConfirm = async () => {
  if (!modalUser.value) return;

  switch (modalType.value) {
    case 'deactivate':
      await deactivateUser(modalUser.value);
      break;
    case 'reactivate':
      await reactivateUser(modalUser.value);
      break;
    case 'delete':
      await deleteUser(modalUser.value);
      break;
  }

  closeModal();
};

const closeModal = () => {
  showModal.value = false;
  modalType.value = '';
  modalUser.value = null;
};

// Utility functions
const formatLastActive = (timestamp) => {
  if (!timestamp) return 'Never';
  
  const date = new Date(timestamp.seconds * 1000);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    }
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

const sortUsers = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// Lifecycle
onMounted(fetchUsers);
</script>

<script>
import AdminNavigationBar from './AdminNavigationBar.vue';

export default {
  name: 'AdminManagement',
  components: {
    AdminNavigationBar,
  },
};
</script>

<style scoped>
.admin-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Background Pattern */
.background-pattern {
  position: fixed;
  inset: 0;
  background-color: #1a1a2e;
  z-index: -1;
  overflow: hidden;
}

.pattern-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(30deg, rgba(16, 42, 66, 0.5) 12%, transparent 12.5%, transparent 87%, rgba(16, 42, 66, 0.5) 87.5%, rgba(16, 42, 66, 0.5)),
    linear-gradient(150deg, rgba(16, 42, 66, 0.5) 12%, transparent 12.5%, transparent 87%, rgba(16, 42, 66, 0.5) 87.5%, rgba(16, 42, 66, 0.5)),
    linear-gradient(30deg, rgba(16, 42, 66, 0.5) 12%, transparent 12.5%, transparent 87%, rgba(16, 42, 66, 0.5) 87.5%, rgba(16, 42, 66, 0.5)),
    linear-gradient(150deg, rgba(16, 42, 66, 0.5) 12%, transparent 12.5%, transparent 87%, rgba(16, 42, 66, 0.5) 87.5%, rgba(16, 42, 66, 0.5)),
    linear-gradient(60deg, rgba(0, 0, 0, 0.1) 25%, transparent 25.5%, transparent 75%, rgba(0, 0, 0, 0.1) 75%, rgba(0, 0, 0, 0.1)),
    linear-gradient(60deg, rgba(0, 0, 0, 0.1) 25%, transparent 25.5%, transparent 0,0,0.1),
    linear-gradient(60deg, rgba(0, 0, 0, 0.1) 25%, transparent 25.5%, transparent 75%, rgba(0, 0, 0, 0.1) 75%, rgba(0, 0, 0, 0.1));
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
  opacity: 0.2;
}

/* Card Design */
.admin-card {
  width: 100%;
  max-width: 1000px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
}

.card-header {
  background: linear-gradient(135deg, #0f2942 0%, #102a42 100%);
  padding: 30px;
  color: white;
  display: flex;
  align-items: center;
  gap: 20px;
  text-align: left;
}

.logo-container {
  margin-bottom: 20px;
}

.logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 0.95rem;
  opacity: 0.8;
}

.card-content {
  padding: 30px;
}

/* Controls */
.controls {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-box input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  min-width: 120px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(15, 41, 66, 0.1);
  border-radius: 50%;
  border-top-color: #0f2942;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error Container */
.error-container {
  text-align: center;
  color: #e53e3e;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.error-icon {
  color: #e53e3e;
}

.retry-btn {
  margin-top: 8px;
  padding: 8px 16px;
  background-color: rgba(15, 41, 66, 0.1);
  border: 1px solid rgba(15, 41, 66, 0.2);
  border-radius: 6px;
  color: #0f2942;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.retry-btn:hover {
  background-color: rgba(15, 41, 66, 0.2);
}

/* Table Styles */
.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #eee;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #f8f9fa;
  color: #333;
  font-weight: 600;
  text-align: left;
  padding: 12px 16px;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-icon {
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.sort-icon:hover {
  opacity: 1;
}

td {
  padding: 12px 16px;
  border-top: 1px solid #eee;
}

tr.deactivated td {
  opacity: 0.6;
  background-color: #f8f9fa;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.role-badge {
  display: inline-block;
}

.role-badge select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  font-size: 0.875rem;
}

.role-badge.admin select {
  background-color: rgba(168, 85, 247, 0.1);
  color: #a855f7;
  border-color: rgba(168, 85, 247, 0.2);
}

.role-badge.user select {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.2);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.875rem;
}

.status-badge.active {
  background-color: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.status-badge.deactivated {
  background-color: rgba(229, 62, 62, 0.1);
  color: #e53e3e;
  border: 1px solid rgba(229, 62, 62, 0.2);
}

.last-active {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 0.875rem;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.deactivate {
  background-color: rgba(234, 179, 8, 0.1);
  color: #eab308;
}

.action-btn.reactivate {
  background-color: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.action-btn.delete {
  background-color: rgba(229, 62, 62, 0.1);
  color: #e53e3e;
}

.action-btn:hover {
  transform: translateY(-2px);
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}

.page-btn {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  background-color: #f8f9fa;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #666;
  gap: 12px;
}

.empty-icon {
  color: #ccc;
}

.empty-state span {
  font-size: 0.875rem;
  color: #999;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-header.deactivate h3 {
  color: #eab308;
}

.modal-header.reactivate h3 {
  color: #16a34a;
}

.modal-header.delete h3 {
  color: #e53e3e;
}

.close-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
}

.modal-body {
  padding: 20px;
  color: #666;
}

.warning-box {
  margin-top: 16px;
  padding: 12px;
  background-color: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #eab308;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #333;
  cursor: pointer;
}

.confirm-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  color: white;
  cursor: pointer;
}

.confirm-btn.deactivate {
  background-color: #eab308;
}

.confirm-btn.reactivate {
  background-color: #16a34a;
}

.confirm-btn.delete {
  background-color: #e53e3e;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Styles */
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
  }
  
  .card-content {
    padding: 20px;
  }
  
  th:nth-child(4),
  th:nth-child(5),
  td:nth-child(4),
  td:nth-child(5) {
    display: none;
  }
}

@media (max-width: 480px) {
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .action-btn {
    width: 28px;
    height: 28px;
  }
  
  .title {
    font-size: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }
  
  .modal-overlay,
  .modal-content {
    animation: none;
  }
  
  .action-btn:hover {
    transform: none;
  }
}

.user-info span {
  color: #222;
  font-weight: 500;
}

/* Make email text in the second column more visible */
td:nth-child(2) {
  color: #222;
  font-weight: 500;
}

.main-content {
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

.main-content.collapsed {
  margin-left: 0;
}
</style>