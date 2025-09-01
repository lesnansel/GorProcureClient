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
        <!-- Header with gradient overlay and stats -->
        <div class="card-header">
          <div class="header-content">
            <div class="logo-container">
              <img src="@/assets/proculogo.png" alt="Procurement System Logo" class="logo" />
            </div>
            <div class="header-text align-left">
              <h1 class="title">Contract Management</h1>
              <p class="subtitle">Manage, track, and update procurement contracts</p>
            </div>
          </div>
          
          <!-- Stats Overview -->
          <div class="stats-overview">
            <div class="stat-item">
              <div class="stat-value">{{ contracts.length }}</div>
              <div class="stat-label">Total Contracts</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ pendingContractsCount }}</div>
              <div class="stat-label">Pending</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ activeContractsCount }}</div>
              <div class="stat-label">Active</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ completedContractsCount }}</div>
              <div class="stat-label">Completed</div>
            </div>
          </div>
        </div>

        <div class="card-content">
          <!-- Search and Filter Bar -->
          <div class="action-bar">
            <div class="search-container">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search by supplier or PO number..." 
                class="search-input"
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <div class="filter-container">
              <select v-model="statusFilter" class="filter-select">
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <button @click="navigateToAddContract" class="btn-add">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add Contract
            </button>
          </div>

          <!-- Contracts List -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="loading-icon"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
            </div>
            <p>Loading contracts...</p>
          </div>
          
          <div v-else-if="filteredContracts.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            <p class="empty-text">No contracts available.</p>
            <p class="empty-subtext">Add a new contract to get started.</p>
          </div>
          
          <div v-else class="contracts-grid">
            <div v-for="contract in filteredContracts" :key="contract.id" class="contract-card" :class="`contract-card-${contract.status.toLowerCase()}`">
              <div class="contract-card-header">
                <div class="contract-header-content">
                  <div class="contract-title">{{ contract.supplier }}</div>
                  <span class="status-badge" :class="`status-${contract.status.toLowerCase()}`">
                    {{ contract.status }}
                  </span>
                </div>
                <div class="po-number-tag">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  <span>PO: {{ contract.poNumber }}</span>
                </div>
              </div>
              
              <div class="contract-card-body">
                <div class="contract-details">
                  <div class="detail-item" v-if="contract.startDate">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span>Start: {{ formatDate(contract.startDate) }}</span>
                  </div>
                  <div class="detail-item" v-if="contract.endDate">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span>End: {{ formatDate(contract.endDate) }}</span>
                  </div>
                  <div class="detail-item" v-if="contract.value">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    <span>Value: {{ formatCurrency(contract.value) }}</span>
                  </div>
                </div>
                
                <div class="contract-description" v-if="contract.description">
                  {{ contract.description }}
                </div>
              </div>
              
              <div class="contract-card-actions">
                <button @click="openModal('view', contract)" class="bg-gray-100 text-black px-4 py-2 rounded">
                  👁️ View
                </button>
                <button @click="openModal('edit', contract)" class="bg-blue-100 text-blue-800 px-4 py-2 rounded">
                  ✏️ Edit
                </button>
                <button @click="openModal('delete', contract)" class="bg-red-100 text-red-800 px-4 py-2 rounded">
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Contract Modal -->
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal contract-modal-wide">
          <div class="modal-header">
            <h3 class="modal-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              {{ editMode ? 'Edit Contract' : 'Add New Contract' }}
            </h3>
            <button @click="closeModal" class="close-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
          </div>
          <form @submit.prevent="submitContract" class="modal-form-flex">
            <div class="modal-body contract-modal-scroll">
              <div class="form-row form-row-2col">
                <div class="form-group">
                  <label class="form-label">Supplier</label>
                  <input 
                    v-model="contractData.supplier" 
                    type="text" 
                    class="input-field" 
                    placeholder="Enter supplier name" 
                    required 
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">PO Number</label>
                  <input 
                    v-model="contractData.poNumber" 
                    type="text" 
                    class="input-field" 
                    placeholder="Enter PO number" 
                    required 
                  />
                </div>
              </div>
              
              <div class="form-row form-row-2col">
                <div class="form-group">
                  <label class="form-label">Status</label>
                  <select v-model="contractData.status" class="input-field" required>
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Contract Value</label>
                  <input 
                    v-model="contractData.value" 
                    type="number" 
                    step="0.01" 
                    class="input-field" 
                    placeholder="Enter contract value" 
                  />
                </div>
              </div>
              
              <div class="form-row form-row-2col">
                <div class="form-group">
                  <label class="form-label">Start Date</label>
                  <input 
                    v-model="contractData.startDate" 
                    type="date" 
                    class="input-field" 
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">End Date</label>
                  <input 
                    v-model="contractData.endDate" 
                    type="date" 
                    class="input-field" 
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea 
                  v-model="contractData.description" 
                  class="input-field textarea" 
                  placeholder="Enter contract description"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label class="form-label">Contract Document (Optional)</label>
                <div class="file-upload">
                  <input 
                    type="file" 
                    id="file-upload" 
                    class="file-input" 
                    @change="handleFileUpload" 
                  />
                  <label for="file-upload" class="file-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M12 18v-6"></path><path d="M9 15h6"></path></svg>
                    {{ fileName || 'Choose file' }}
                  </label>
                </div>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                Cancel
              </button>
              <button type="submit" class="btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                {{ editMode ? 'Update Contract' : 'Add Contract' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Overlay and Box -->
      <div v-if="activeModal" class="modal-overlay">
        <div class="modal-centered contract-edit-modal">
          <button class="modal-close" @click="closeModal">&times;</button>

          <!-- View Modal -->
          <div v-if="activeModal === 'view'">
            <h3 class="modal-title">View Contract</h3>
            <div class="modal-details">
              <div class="detail-row"><span class="detail-label">Supplier:</span> <span class="detail-value">{{ contractData.supplier }}</span></div>
              <div class="detail-row"><span class="detail-label">PO Number:</span> <span class="detail-value">{{ contractData.poNumber }}</span></div>
              <div class="detail-row"><span class="detail-label">Status:</span> <span class="detail-value">{{ contractData.status }}</span></div>
              <div class="detail-row"><span class="detail-label">Value:</span> <span class="detail-value">{{ formatCurrency(contractData.value) }}</span></div>
              <div class="detail-row"><span class="detail-label">Start Date:</span> <span class="detail-value">{{ formatDate(contractData.startDate) }}</span></div>
              <div class="detail-row"><span class="detail-label">End Date:</span> <span class="detail-value">{{ formatDate(contractData.endDate) }}</span></div>
              <div class="detail-row"><span class="detail-label">Description:</span> <span class="detail-value">{{ contractData.description }}</span></div>
            </div>
          </div>

          <!-- Edit Modal -->
          <div v-else-if="activeModal === 'edit'">
            <h3 class="modal-title">Edit Contract</h3>
            <form @submit.prevent="saveChanges" class="modal-body">
              <div class="form-group">
                <label class="form-label">Supplier</label>
                <input type="text" v-model="contractData.supplier" class="input-field" required />
              </div>
              <div class="form-group">
                <label class="form-label">PO Number</label>
                <input type="text" v-model="contractData.poNumber" class="input-field" required />
              </div>
              <div class="form-group">
                <label class="form-label">Status</label>
                <select v-model="contractData.status" class="input-field" required>
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Value</label>
                <input type="number" v-model="contractData.value" class="input-field" min="0" step="0.01" required />
              </div>
              <div class="form-group">
                <label class="form-label">Start Date</label>
                <input type="date" v-model="contractData.startDate" class="input-field" required />
              </div>
              <div class="form-group">
                <label class="form-label">End Date</label>
                <input type="date" v-model="contractData.endDate" class="input-field" required />
              </div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea v-model="contractData.description" class="input-field textarea" rows="3"></textarea>
              </div>
              <div class="modal-actions">
                <button type="button" class="btn-secondary" @click="closeModal">Cancel</button>
                <button type="submit" class="btn-primary">Save</button>
              </div>
            </form>
          </div>

          <!-- Delete Modal -->
          <div v-else-if="activeModal === 'delete'">
            <h3 class="modal-title">Confirm Delete</h3>
            <p class="confirm-message">Are you sure you want to delete <b>{{ contractData.supplier }}</b>?</p>
            <div class="modal-actions">
              <button class="btn-secondary" @click="closeModal">Cancel</button>
              <button class="btn-delete" @click="confirmDeleteModal">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminNavigationBar from './AdminNavigationBar.vue';
import { ref, computed, onMounted } from "vue";
import { db } from "@/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useRouter } from "vue-router";

export default {
  components: {
    AdminNavigationBar,
  },
  setup() {
    const contracts = ref([]);
    const loading = ref(true);
    const isModalOpen = ref(false);
    const isConfirmingDelete = ref(false);
    const editMode = ref(false);
    const searchQuery = ref("");
    const statusFilter = ref("all");
    const fileName = ref("");
    const selectedFile = ref(null);
    
    const activeContract = ref({});
    const contractData = ref({
      supplier: "",
      poNumber: "",
      status: "Pending",
      value: "",
      startDate: "",
      endDate: "",
      description: ""
    });

    // Modal state for minimal modal
    const activeModal = ref(null); // 'view' | 'edit' | 'delete' | null
    const selectedContract = ref(null);

    // Minimal modal handlers
    async function saveChanges() {
      if (selectedContract.value && selectedContract.value.id) {
        try {
          const contractRef = doc(db, "contracts", selectedContract.value.id);
          await updateDoc(contractRef, {
            ...selectedContract.value,
            updatedAt: serverTimestamp()
          });
          showNotification("Contract updated successfully!");
        } catch (error) {
          console.error("Error updating contract:", error);
          showNotification("Failed to update contract. Please try again.", "error");
        }
      }
      activeModal.value = null;
      selectedContract.value = null;
    }
    async function confirmDeleteModal() {
      if (selectedContract.value && selectedContract.value.id) {
        try {
          const contractRef = doc(db, "contracts", selectedContract.value.id);
          await deleteDoc(contractRef);
          showNotification("Contract deleted successfully!");
        } catch (error) {
          console.error("Error deleting contract:", error);
          showNotification("Failed to delete contract. Please try again.", "error");
        }
      }
      activeModal.value = null;
      selectedContract.value = null;
    }

    const router = useRouter();

    const navigateToAddContract = () => {
      router.push({ name: "AddContract" });
    };

    // Computed values for stats
    const pendingContractsCount = computed(() => 
      contracts.value.filter(contract => contract.status === "Pending").length
    );
    
    const activeContractsCount = computed(() => 
      contracts.value.filter(contract => contract.status === "Active").length
    );
    
    const completedContractsCount = computed(() => 
      contracts.value.filter(contract => contract.status === "Completed").length
    );

    const filteredContracts = computed(() => {
      let result = [...contracts.value];
      
      // Apply status filter
      if (statusFilter.value !== "all") {
        result = result.filter(contract => contract.status === statusFilter.value);
      }
      
      // Apply search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(contract => 
          contract.supplier.toLowerCase().includes(query) ||
          contract.poNumber.toLowerCase().includes(query) ||
          (contract.description && contract.description.toLowerCase().includes(query))
        );
      }
      
      return result;
    });

    const fetchContracts = async () => {
      try {
        loading.value = true;
        
        // Set up real-time listener for contracts collection
        const unsubscribe = onSnapshot(collection(db, "contracts"), (snapshot) => {
          contracts.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          loading.value = false;
        });

        // Return unsubscribe function for cleanup
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching contracts:", error);
        showNotification("Failed to fetch contracts. Please try again.", "error");
        loading.value = false;
      }
    };

    const showAddModal = () => {
      editMode.value = false;
      resetForm();
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
      activeModal.value = null;
      selectedContract.value = null;
    };

    const resetForm = () => {
      contractData.value = {
        supplier: "",
        poNumber: "",
        status: "Pending",
        value: "",
        startDate: "",
        endDate: "",
        description: ""
      };
      fileName.value = "";
      selectedFile.value = null;
    };

    // Replace openModal logic to use minimalistic modal
    const openModal = (type, contract) => {
      activeModal.value = type; // 'view', 'edit', or 'delete'
      selectedContract.value = { ...contract };
      contractData.value = { ...contract };
    };

    const submitContract = async () => {
      try {
        if (editMode.value) {
          // Update existing contract
          const contractRef = doc(db, "contracts", contractData.value.id);
          await updateDoc(contractRef, {
            ...contractData.value,
            updatedAt: serverTimestamp()
          });
          showNotification("Contract updated successfully!");
        } else {
          // Add new contract
          await addDoc(collection(db, "contracts"), {
            ...contractData.value,
            createdAt: serverTimestamp()
          });
          showNotification("Contract added successfully!");
        }
        
        closeModal();
      } catch (error) {
        console.error("Error saving contract:", error);
        showNotification("Failed to save contract. Please try again.", "error");
      }
    };

    const confirmDelete = (contract) => {
      activeContract.value = contract;
      isConfirmingDelete.value = true;
    };

    const cancelDelete = () => {
      isConfirmingDelete.value = false;
    };

    const deleteContract = async () => {
      try {
        const contractRef = doc(db, "contracts", activeContract.value.id);
        await deleteDoc(contractRef);
        showNotification("Contract deleted successfully!");
        isConfirmingDelete.value = false;
      } catch (error) {
        console.error("Error deleting contract:", error);
        showNotification("Failed to delete contract. Please try again.", "error");
      }
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        selectedFile.value = file;
        fileName.value = file.name;
      }
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return "N/A";
      
      // If timestamp is a Firestore Timestamp, convert to JS Date
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    };

    const formatCurrency = (amount) => {
      if (!amount) return "$0.00";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    };

    const showNotification = (message, type = "success") => {
      // Create notification element
      const notification = document.createElement("div");
      notification.className = `notification ${type}`;
      notification.textContent = message;
      document.body.appendChild(notification);
      
      // Add animation class after a short delay
      setTimeout(() => {
        notification.classList.add("show");
      }, 10);
      
      // Remove notification after timeout
      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    };

    onMounted(fetchContracts);

    return {
      contracts,
      loading,
      isModalOpen,
      isConfirmingDelete,
      editMode,
      searchQuery,
      statusFilter,
      contractData,
      activeContract,
      fileName,
      pendingContractsCount,
      activeContractsCount,
      completedContractsCount,
      filteredContracts,
      showAddModal,
      closeModal,
      openModal,
      submitContract,
      confirmDelete,
      cancelDelete,
      deleteContract,
      handleFileUpload,
      formatDate,
      formatCurrency,
      navigateToAddContract,
      activeModal,
      selectedContract,
      saveChanges,
      confirmDeleteModal,
    };
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
    linear-gradient(60deg, rgba(0, 0, 0, 0.1) 25%, transparent 25.5%, transparent 75%, rgba(0, 0, 0, 0.1) 75%, rgba(0, 0, 0, 0.1));
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
  opacity: 0.2;
}

/* Card Design */
.admin-card {
  width: 100%;
  max-width: 1200px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
}

/* Card Header with Stats */
.card-header {
  background: linear-gradient(135deg, #0f2942 0%, #102a42 100%);
  padding: 30px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-container {
  flex-shrink: 0;
}

.logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
}

.header-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.header-text.align-left {
  align-items: flex-start;
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

/* Stats Overview */
.stats-overview {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat-item {
  flex: 1;
  min-width: 120px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: transform 0.2s;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.card-content {
  padding: 30px;
}

/* Action Bar */
.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.search-container {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.filter-container {
  width: auto;
  min-width: 200px;
}

.filter-select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  color: #1e293b;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #0f2942;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-add:hover {
  background-color: #1a365d;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Contract Cards Grid */
.contracts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.contract-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
}

.contract-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* Card color accents based on status */
.contract-card-pending {
  border-top: 3px solid #fbbf24;
}

.contract-card-active {
  border-top: 3px solid #10b981;
}

.contract-card-completed {
  border-top: 3px solid #3b82f6;
}

.contract-card-header {
  padding: 15px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.contract-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.contract-title {
  font-weight: 600;
  color: #0f2942;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.po-number-tag {
  background-color: #f1f5f9;
  color: #64748b;
  padding: 5px 10px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
}

.contract-card-body {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contract-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.9rem;
}

.contract-description {
  font-size: 0.9rem;
  color: #334155;
  line-height: 1.5;
  margin-top: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3; /* Added standard property */
  -webkit-box-orient: vertical;
}

.contract-card-actions {
  padding: 15px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.card-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.card-action-btn svg {
  width: 16px;
  height: 16px;
}

.card-action-btn.view {
  background-color: #f1f5f9;
  color: #0f2942;
}

.card-action-btn.view:hover {
  background-color: #e2e8f0;
}

.card-action-btn.edit {
  background-color: #e0f2fe;
  color: #0369a1;
}

.card-action-btn.edit:hover {
  background-color: #bae6fd;
}

.card-action-btn.delete {
  background-color: #fee2e2;
  color: #b91c1c;
}

.card-action-btn.delete:hover {
  background-color: #fca5a5;
}

/* Status Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-active {
  background-color: #d1fae5;
  color: #065f46;
}

.status-completed {
  background-color: #dbeafe;
  color: #1e40af;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
}

.empty-icon {
  color: #94a3b8;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: 16px;
  color: #64748b;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #1e293b;
}

.loading-spinner {
  margin-bottom: 16px;
}

.loading-icon {
  animation: spin 2s linear infinite;
  color: #2563eb;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  min-width: 320px;
  max-width: 95vw;
  min-height: 120px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  animation: fadeIn 0.2s;
  display: flex;
  flex-direction: column;
}
.modal-centered {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  position: relative;
  color: #1e293b; /* Make modal text dark and readable */
}

.modal-centered h3,
.modal-centered strong,
.modal-centered label {
  color: #0f2942;
}

.modal-centered p,
.modal-centered input,
.modal-centered button {
  color: #1e293b;
}

.modal-centered input {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 12px;
  width: 100%;
}

.modal-centered button {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  margin-top: 8px;
  cursor: pointer;
  font-weight: 600;
}

.modal-centered button:hover {
  background: #1d4ed8;
}

/* Modal Overlay and Box */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-centered {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.main-content {
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

.main-content.collapsed {
  margin-left: 0;
}

.contract-edit-modal {
  background: #fff;
  padding: 32px 28px 24px 28px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  position: relative;
  animation: fadeIn 0.2s;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.contract-edit-modal .modal-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f2942;
  margin-bottom: 18px;
  text-align: center;
}

.contract-edit-modal .modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contract-edit-modal .form-group {
  margin-bottom: 12px;
}

.contract-edit-modal .form-label {
  font-size: 0.98rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
  display: block;
}

.contract-edit-modal .input-field,
.contract-edit-modal .textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin-bottom: 0;
}

.contract-edit-modal .input-field:focus,
.contract-edit-modal .textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.contract-edit-modal .textarea {
  min-height: 60px;
  resize: vertical;
}

.contract-edit-modal .modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

.contract-edit-modal .btn-primary {
  background-color: #2563eb;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.contract-edit-modal .btn-primary:hover {
  background-color: #1d4ed8;
}

.contract-edit-modal .btn-secondary {
  background-color: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 18px;
  transition: all 0.2s;
}

.contract-edit-modal .btn-secondary:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

.contract-edit-modal .btn-delete {
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 18px;
  transition: all 0.2s;
}

.contract-edit-modal .btn-delete:hover {
  background-color: #dc2626;
}

.contract-edit-modal .modal-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

.contract-edit-modal .detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 6px;
}

.contract-edit-modal .detail-label {
  width: 120px;
  font-weight: 600;
  color: #64748b;
  font-size: 0.95rem;
}

.contract-edit-modal .detail-value {
  flex: 1;
  color: #0f172a;
  font-size: 0.98rem;
}

.contract-edit-modal .confirm-message {
  color: #334155;
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
  margin: 18px 0 10px 0;
}

/* New styles for wide contract modal */
.contract-modal-wide {
  max-height: 90vh;
  overflow-y: auto;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fff;
  padding: 24px 28px 18px 28px;
  border-radius: 18px;
  width: 100%;
  max-width: 700px;
  min-width: 350px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  animation: fadeIn 0.2s;
  align-items: stretch;
}

@media (max-width: 900px) {
  .contract-modal-wide {
    max-width: 98vw;
    padding: 14px 4px;
    max-height: 85vh;
  }
}

.modal-form-flex {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.contract-modal-scroll,
.modal-body {
  overflow-y: auto;
  max-height: 70vh;
  padding-right: 4px;
  /* Prevents modal from exceeding viewport */
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
  background: #fff;
  position: sticky;
  bottom: 0;
  z-index: 2;
  padding-top: 12px;
}
</style>