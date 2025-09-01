<template>
  <div class="app-container">
    <!-- Background Pattern (always full screen) -->
    <div class="background-pattern">
      <div class="pattern-overlay"></div>
    </div>
    <!-- Sidebar Overlay -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="toggleSidebar"></div>
    <!-- Toggle Button (always visible) -->
    <button class="sidebar-toggle-btn" @click="toggleSidebar">
      <svg v-if="sidebarOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
    </button>
    <!-- Sidebar -->
    <div :class="['sidebar', sidebarOpen ? 'sidebar-open' : 'sidebar-closed']">
      <!-- User Profile Section -->
      <div class="user-profile">
        <div class="user-avatar">
          <span class="avatar-text">JD</span>
        </div>
        <div class="user-info">
          <div class="username">ansel</div>
          <div class="user-role">user</div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="nav-menu">
        <!-- GENERAL Section -->
        <div class="nav-section">
          <div class="section-header">GENERAL</div>
          <ul class="nav-list">
            <li class="nav-item">
              <a href="#" class="nav-link">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span class="nav-text">Home</span>
              </a>
            </li>
            <li class="nav-item">
              <router-link to="/dashboard" class="nav-link">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span class="nav-text">Dashboard</span>
              </router-link>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="nav-text">Profile</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- PROCUREMENT Section -->
        <div class="nav-section">
          <div class="section-header">PROCUREMENT</div>
          <ul class="nav-list">
            <li class="nav-item">
              <a href="#" class="nav-link active">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="nav-text">Request Purchase</span>
              </a>
            </li>
            <li class="nav-item">
              <router-link to="/payment-tracking" class="nav-link">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="nav-text">Track Payments</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/approved-purchases"
                class="nav-link"
                exact
                active-class="active"
              >
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                <span class="nav-text">PR Lists</span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <!-- Main Content Area -->
    <div class="main-content" :style="{ marginLeft: sidebarOpen ? '80px' : '0' }">
      <!-- Purchase Request Form -->
      <div class="content-wrapper">
        <div class="admin-card">
          <div class="card-header header-flex">
            <div class="logo-container">
              <img src="@/assets/proculogo.png" alt="Procurement System Logo" class="logo" />
            </div>
            <div class="header-text">
              <h1 class="title">Purchase Request</h1>
              <p class="subtitle">Submit and manage your purchase requests.</p>
            </div>
          </div>

          <div class="card-content">
            <!-- Success/Error Notification -->
            <div v-if="notification.show" :class="['notification', notification.type]">
              <div class="notification-content">
                <span v-if="notification.type === 'success'" class="notification-icon success">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </span>
                <span v-else class="notification-icon error">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </span>
                <p>{{ notification.message }}</p>
                <button class="notification-close" @click="closeNotification">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>

            <!-- Tab Navigation -->
            <div class="tab-nav">
              <button :class="['tab-btn', activeTab === 'submit' ? 'active' : '']" @click="activeTab = 'submit'">Submit Request</button>
              <button :class="['tab-btn', activeTab === 'my' ? 'active' : '']" @click="activeTab = 'my'">My Requests</button>
            </div>

            <!-- Tab Content -->
            <div v-if="activeTab === 'submit'">
              <!-- Submit Purchase Request Form -->
              <form @submit.prevent="submitRequest" class="form">
                <div class="form-section">
                  <h2 class="section-title">Request Details</h2>
                  
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" for="itemName">Item Name</label>
                      <input 
                        id="itemName"
                        v-model="newRequest.itemName" 
                        type="text" 
                        class="input-field" 
                        placeholder="Enter item name" 
                        required 
                      />
                      <span v-if="validationErrors.itemName" class="error-message">{{ validationErrors.itemName }}</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="quantity">Quantity</label>
                      <input 
                        id="quantity"
                        v-model.number="newRequest.quantity" 
                        type="number" 
                        min="1"
                        class="input-field" 
                        placeholder="Enter quantity" 
                        required 
                      />
                      <span v-if="validationErrors.quantity" class="error-message">{{ validationErrors.quantity }}</span>
                    </div>
                  </div>
                  
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" for="category">Category</label>
                      <select 
                        id="category"
                        v-model="newRequest.category" 
                        class="input-field" 
                        required
                      >
                        <option value="" disabled>Select a category</option>
                        <option v-for="category in categories" :key="category" :value="category">
                          {{ category }}
                        </option>
                      </select>
                      <span v-if="validationErrors.category" class="error-message">{{ validationErrors.category }}</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="priority">Priority</label>
                      <select 
                        id="priority"
                        v-model="newRequest.priority" 
                        class="input-field" 
                        required
                      >
                        <option value="" disabled>Select priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      <span v-if="validationErrors.priority" class="error-message">{{ validationErrors.priority }}</span>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label" for="description">Description</label>
                    <textarea 
                      id="description"
                      v-model="newRequest.description" 
                      class="input-field textarea" 
                      placeholder="Enter detailed description of the item(s)" 
                      required
                    ></textarea>
                    <span v-if="validationErrors.description" class="error-message">{{ validationErrors.description }}</span>
                  </div>
                  
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" for="estimatedCost">Estimated Cost (₱)</label>
                      <input 
                        id="estimatedCost"
                        v-model.number="newRequest.estimatedCost" 
                        type="number" 
                        min="0" 
                        step="0.01"
                        class="input-field" 
                        placeholder="Enter estimated cost" 
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="requiredDate">Required By</label>
                      <input 
                        id="requiredDate"
                        v-model="newRequest.requiredDate" 
                        type="date" 
                        class="input-field" 
                        :min="minDate"
                        required
                      />
                      <span v-if="validationErrors.requiredDate" class="error-message">{{ validationErrors.requiredDate }}</span>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label" for="justification">Justification</label>
                    <textarea 
                      id="justification"
                      v-model="newRequest.justification" 
                      class="input-field textarea" 
                      placeholder="Explain why this purchase is necessary" 
                      required
                    ></textarea>
                    <span v-if="validationErrors.justification" class="error-message">{{ validationErrors.justification }}</span>
                  </div>

                  <!-- File Upload Section -->
                  <div class="form-group">
                    <label class="form-label" for="prDocument">PR Document (PDF)</label>
                    <input 
                      id="prDocument"
                      type="file"
                      accept="application/pdf"
                      class="input-field"
                      @change="e => file = e.target.files[0]"
                      required
                    />
                    <span v-if="fileError" class="error-message">{{ fileError }}</span>
                  </div>
                </div>
                
                <div class="form-actions">
                  <button type="button" class="btn-secondary" @click="resetForm">Reset</button>
                  <button 
                    type="submit" 
                    class="btn-primary" 
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="spinner"></span>
                    {{ isSubmitting ? 'Submitting...' : 'Submit Request' }}
                  </button>
                </div>
              </form>
            </div>
            <div v-else>
              <!-- User's Purchase Requests List -->
              <UserPurchaseRequests />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from "vue";
import { db, auth, storage } from "@/firebase";
import { collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import UserPurchaseRequests from "./UserPurchaseRequests.vue";

export default {
  name: "PurchaseRequest",
  components: { UserPurchaseRequests },
  setup() {
    // Form data
    const newRequest = reactive({
      itemName: "",
      quantity: 1,
      description: "",
      category: "",
      priority: "",
      estimatedCost: null,
      requiredDate: "",
      justification: ""
    });
    
    // Validation errors
    const validationErrors = reactive({});
    
    // UI state
    const isSubmitting = ref(false);
    const notification = reactive({
      show: false,
      type: "success",
      message: ""
    });
    
    // Available categories
    const categories = [
      "Office Supplies",
      "IT Equipment",
      "Furniture",
      "Maintenance",
      "Services",
      "Other"
    ];
    
    // Minimum date for the required date field (today)
    const minDate = computed(() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    });
    
    // File upload state
    const file = ref(null);
    const fileError = ref("");
    
    // Sidebar state
    const sidebarOpen = ref(true);
    const toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value; };
    
    // Active tab state
    const activeTab = ref('submit');
    
    // Validate form
    const validateForm = () => {
      const errors = {};
      
      if (!newRequest.itemName.trim()) {
        errors.itemName = "Item name is required";
      }
      
      if (!newRequest.quantity || newRequest.quantity < 1) {
        errors.quantity = "Quantity must be at least 1";
      }
      
      if (!newRequest.category) {
        errors.category = "Please select a category";
      }
      
      if (!newRequest.priority) {
        errors.priority = "Please select a priority level";
      }
      
      if (!newRequest.description.trim()) {
        errors.description = "Description is required";
      } else if (newRequest.description.trim().length < 10) {
        errors.description = "Description must be at least 10 characters";
      }
      
      if (!newRequest.requiredDate) {
        errors.requiredDate = "Required date is required";
      }
      
      if (!newRequest.justification.trim()) {
        errors.justification = "Justification is required";
      }
      
      // File validation
      if (!file.value) {
        fileError.value = "Please upload a PR document (PDF).";
      } else if (file.value && file.value.type !== "application/pdf") {
        fileError.value = "Only PDF files are allowed.";
      } else {
        fileError.value = "";
      }
      
      return errors;
    };
    
    // Submit request
    const submitRequest = async () => {
      // Validate form
      const errors = validateForm();
      
      if (Object.keys(errors).length > 0) {
        Object.assign(validationErrors, errors);
        showNotification("error", "Please fix the errors in the form");
        return;
      }
      
      // Clear previous validation errors
      Object.keys(validationErrors).forEach(key => {
        delete validationErrors[key];
      });
      
      // File validation
      if (!file.value || file.value.type !== "application/pdf") {
        fileError.value = !file.value ? "Please upload a PR document (PDF)." : "Only PDF files are allowed.";
        showNotification("error", fileError.value);
        return;
      }
      
      isSubmitting.value = true;
      
      try {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          showNotification("error", "You must be logged in to submit a request");
          isSubmitting.value = false;
          return;
        }
        
        // Upload file to Firebase Storage
        const storagePath = `purchaseRequests/${currentUser.uid}/${Date.now()}_${file.value.name}`;
        const fileStorageRef = storageRef(storage, storagePath);
        await uploadBytes(fileStorageRef, file.value);
        const fileURL = await getDownloadURL(fileStorageRef);
        
        // Prepare request data
        const requestData = {
          ...newRequest,
          userId: currentUser.uid,
          userEmail: currentUser.email,
          status: "pending",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          prDocumentURL: fileURL
        };
        
        // Add document to Firestore
        const docRef = await addDoc(collection(db, "purchaseRequests"), requestData);
        const generatedId = docRef.id; // Retrieve the generated document ID

        // Update the document with the generated ID
        await updateDoc(docRef, { requestId: generatedId });

        // Optionally, you can log or use the generated ID
        console.log("Generated Request ID:", generatedId);
        
        // Show success notification
        showNotification("success", "Purchase request submitted successfully!");
        
        // Reset form
        resetForm();
      } catch (error) {
        console.error("Error submitting purchase request:", error);
        showNotification("error", "Failed to submit request. Please try again.");
      } finally {
        isSubmitting.value = false;
      }
    };
    
    // Reset form
    const resetForm = () => {
      Object.assign(newRequest, {
        itemName: "",
        quantity: 1,
        description: "",
        category: "",
        priority: "",
        estimatedCost: null,
        requiredDate: "",
        justification: ""
      });
      
      // Clear validation errors
      Object.keys(validationErrors).forEach(key => {
        delete validationErrors[key];
      });
      
      file.value = null;
      fileError.value = "";
    };
    
    // Show notification
    const showNotification = (type, message) => {
      notification.type = type;
      notification.message = message;
      notification.show = true;
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        notification.show = false;
      }, 5000);
    };
    
    // Close notification
    const closeNotification = () => {
      notification.show = false;
    };
    
    // Handle file input change
    const onFileChange = (event) => {
      const selectedFile = event.target.files[0];
      file.value = selectedFile || null;
      
      // Validate file type
      if (selectedFile && selectedFile.type !== "application/pdf") {
        fileError.value = "Only PDF files are allowed.";
        file.value = null;
      } else {
        fileError.value = "";
      }
    };
    
    return {
      newRequest,
      validationErrors,
      isSubmitting,
      notification,
      categories,
      minDate,
      submitRequest,
      resetForm,
      closeNotification,
      file,
      fileError,
      onFileChange,
      sidebarOpen,
      toggleSidebar,
      activeTab,
    };
  }
};
</script>

<style scoped>
/* Main App Container */
.app-container {
  display: flex;
  height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
}

/* Background Pattern */
.background-pattern {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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
    linear-gradient(60deg, rgba(0, 0, 0, 0.1) 25%, transparent 25.5%, transparent 75%, rgba(0, 0, 0, 0.1) 75%, rgba(0, 0, 0, 0.1));
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
  opacity: 0.2;
}

/* Fixed Left Sidebar */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  background-color: #0e2235;
  color: white;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s cubic-bezier(.4,0,.2,1);
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #22334a transparent;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}
.sidebar::-webkit-scrollbar {
  width: 6px;
  height: 40px;
}
.sidebar::-webkit-scrollbar-thumb {
  background: #22334a;
  border-radius: 6px;
}
.sidebar::-webkit-scrollbar-track {
  background: transparent;
}
.sidebar-open {
  transform: translateX(0);
}
.sidebar-closed {
  transform: translateX(-100%);
}
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 999;
  transition: opacity 0.3s;
}
.sidebar-toggle-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1100;
  background: #22334a;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* User Profile Section */
.user-profile {
  padding: 24px;
  border-bottom: 1px solid #2d4a6b;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  background-color: #4a90e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-weight: bold;
  font-size: 18px;
  color: white;
}

.user-info {
  flex: 1;
}

.username {
  font-weight: 600;
  font-size: 16px;
  color: white;
  margin-bottom: 2px;
}

.user-role {
  font-size: 14px;
  color: #94a3b8;
}

/* Navigation Menu */
.nav-menu {
  padding: 16px 0;
}

.nav-section {
  margin-bottom: 32px;
}

.section-header {
  padding: 0 24px 12px;
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  background-color: #2d4a6b;
  color: white;
}

.nav-link.active {
  background-color: #2d4a6b;
  color: white;
  border-right: 3px solid #4a90e2;
}

.nav-link.logout {
  color: #fca5a5;
}

.nav-link.logout:hover {
  background-color: #dc2626;
  color: white;
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
}

/* Main Content Area */
.main-content {
  flex: 1;
  position: relative;
  overflow-y: auto; /* Allow vertical scrolling */
  transition: margin-left 0.3s cubic-bezier(.4,0,.2,1);
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}
.main-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* When sidebar is closed, remove margin */
.sidebar-closed ~ .main-content {
  margin-left: 0;
}

/* Content Wrapper */
.content-wrapper {
  padding: 24px;
  min-height: 100vh;
}

/* Card Design */
.admin-card {
  width: 100%;
  max-width: 1200px; /* Increased from 800px */
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
  margin: 0 auto;
}

@media (max-width: 1300px) {
  .admin-card {
    max-width: 98vw;
  }
}

@media (max-width: 900px) {
  .content-wrapper {
    padding: 8px;
  }
  .admin-card {
    max-width: 100vw;
    border-radius: 0;
  }
}

.card-header {
  background: linear-gradient(135deg, #0f2942 0%, #102a42 100%);
  padding: 30px;
  text-align: center;
  color: white;
}

.card-header.header-flex {
  display: flex;
  align-items: center;
  gap: 24px;
  background: linear-gradient(135deg, #0f2942 0%, #102a42 100%);
  padding: 30px;
  color: white;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
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

/* Form Styling */
.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f2942;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
    gap: 16px;
  }
}

.form-group {
  flex: 1;
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 6px;
}

/* Input Field Styling */
.input-field {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 14px;
  color: #2d3748;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.input-field:focus {
  border-color: #3182ce;
  outline: none;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.textarea {
  min-height: 100px;
  resize: vertical;
}

.error-message {
  display: block;
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
}

/* Button Styling */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #4a5568;
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: #cbd5e0;
}

.btn-primary {
  background-color: #0f2942;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;
}

.btn-primary:hover {
  background-color: #1a4971;
}

.btn-primary:disabled {
  background-color: #90cdf4;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Notification */
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  max-width: 400px;
  min-width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background-color: #ebf8ff;
  border-left: 4px solid #3182ce;
}

.notification.error {
  background-color: #fff5f5;
  border-left: 4px solid #e53e3e;
}

.notification-content {
  display: flex;
  align-items: center;
  padding: 16px;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
}

.notification-icon.success {
  background-color: #bee3f8;
  color: #2b6cb0;
}

.notification-icon.error {
  background-color: #fed7d7;
  color: #c53030;
}

.notification p {
  flex: 1;
  margin: 0;
  color: #2d3748;
  font-size: 14px;
}

.notification-close {
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  color: #718096;
  background-color: #edf2f7;
}

.notification-close:hover {
  background-color: #e2e8f0;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Tab Navigation */
.tab-nav {
  display: flex;
  gap: 12px;
  margin: 24px 0 16px 0;
  justify-content: flex-start;
}

.tab-btn {
  background: #f1f5f9;
  color: #0f2942;
  border: none;
  border-radius: 8px 8px 0 0;
  padding: 12px 28px;
  font-size: 1.08rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.tab-btn.active {
  background: #0f2942;
  color: #fff;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .background-pattern {
    left: 0;
  }
  
  .content-wrapper {
    padding: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .notification {
    animation: none;
  }
  .spinner {
    animation: none;
  }
}
</style>