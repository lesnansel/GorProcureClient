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
              <h1 class="title">Payment Processing</h1>
              <p class="subtitle">Manage and track all procurement payments</p>
            </div>
          </div>
          
          <!-- Stats Overview -->
          <div class="stats-overview">
            <div class="stat-item">
              <div class="stat-value">{{ payments.length }}</div>
              <div class="stat-label">Total Payments</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ pendingPaymentsCount }}</div>
              <div class="stat-label">Pending</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ paidPaymentsCount }}</div>
              <div class="stat-label">Paid</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ formatCurrency(totalPaymentAmount) }}</div>
              <div class="stat-label">Total Amount</div>
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
                placeholder="Search by supplier..." 
                class="search-input"
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <div class="filter-container">
              <select v-model="statusFilter" class="filter-select">
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            <button @click="navigateToAddPayment" class="btn-add">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add Payment
            </button>
          </div>

          <!-- Payments List -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="loading-icon"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
            </div>
            <p>Loading payments...</p>
          </div>
          
          <div v-else-if="filteredPayments.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><path d="M12 2v6m0 0v14m0-14h6m-6 0H6"></path><path d="M17 20H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2Z"></path></svg>
            <p class="empty-text">No payments available.</p>
            <p class="empty-subtext">Add a new payment to get started.</p>
          </div>
          
          <div v-else class="payments-grid">
            <div v-for="payment in filteredPayments" :key="payment.id" class="payment-card" :class="`payment-card-${payment.status.toLowerCase()}`">
              <div class="payment-card-header">
                <div class="payment-header-content">
                  <div class="payment-title">{{ payment.supplier }}</div>
                  <span class="status-badge" :class="`status-${payment.status.toLowerCase()}`">
                    {{ payment.status }}
                  </span>
                </div>
                <div class="payment-amount-tag">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  <span>{{ formatCurrency(payment.amount) }}</span>
                </div>
              </div>
              
              <div class="payment-card-body">
                <div class="payment-details">
                  <div class="detail-item" v-if="payment.paymentDate">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span>Date: {{ formatDate(payment.paymentDate) }}</span>
                  </div>
                  <div class="detail-item" v-if="payment.paymentMethod">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                    <span>Method: {{ payment.paymentMethod }}</span>
                  </div>
                  <div class="detail-item" v-if="payment.invoiceNumber">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
                    <span>Invoice: {{ payment.invoiceNumber }}</span>
                  </div>
                </div>
                
                <div class="payment-description" v-if="payment.description">
                  {{ payment.description }}
                </div>
              </div>
              
              <div class="payment-card-actions">
                <button @click="viewPayment(payment)" class="card-action-btn view">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  View
                </button>
                <button @click="editPayment(payment)" class="card-action-btn edit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  Edit
                </button>
                <button @click="confirmDelete(payment)" class="card-action-btn delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Payment Modal -->
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              {{ editMode ? 'Edit Payment' : 'Add New Payment' }}
            </h3>
            <button @click="closeModal" class="close-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
          </div>
          
          <form @submit.prevent="submitPayment" class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Supplier</label>
                <input 
                  v-model="paymentData.supplier" 
                  type="text" 
                  class="input-field" 
                  placeholder="Enter supplier name" 
                  required 
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">Amount</label>
                <input 
                  v-model="paymentData.amount" 
                  type="number" 
                  step="0.01" 
                  class="input-field" 
                  placeholder="Enter payment amount" 
                  required 
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Status</label>
                <select v-model="paymentData.status" class="input-field" required>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Payment Method</label>
                <select v-model="paymentData.paymentMethod" class="input-field">
                  <option value="">Select payment method</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Check">Check</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Payment Date</label>
                <input 
                  v-model="paymentData.paymentDate" 
                  type="date" 
                  class="input-field" 
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">Invoice Number</label>
                <input 
                  v-model="paymentData.invoiceNumber" 
                  type="text" 
                  class="input-field" 
                  placeholder="Enter invoice number" 
                />
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea 
                v-model="paymentData.description" 
                class="input-field textarea" 
                placeholder="Enter payment description"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Receipt Document (Optional)</label>
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
            
            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                Cancel
              </button>
              <button type="submit" class="btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                {{ editMode ? 'Update Payment' : 'Add Payment' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- View Payment Modal -->
      <div v-if="isViewingDetails" class="modal-overlay" @click.self="closeViewModal">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Payment Details
            </h3>
            <button @click="closeViewModal" class="close-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="payment-details-view">
              <div class="detail-row">
                <div class="detail-label">Supplier</div>
                <div class="detail-value">{{ activePayment.supplier }}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Amount</div>
                <div class="detail-value">{{ formatCurrency(activePayment.amount) }}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Status</div>
                <div class="detail-value">
                  <span class="status-badge" :class="`status-${activePayment.status?.toLowerCase()}`">
                    {{ activePayment.status }}
                  </span>
                </div>
              </div>
              
              <div class="detail-row" v-if="activePayment.paymentMethod">
                <div class="detail-label">Method</div>
                <div class="detail-value">{{ activePayment.paymentMethod }}</div>
              </div>
              
              <div class="detail-row" v-if="activePayment.paymentDate">
                <div class="detail-label">Payment Date</div>
                <div class="detail-value">{{ formatDate(activePayment.paymentDate) }}</div>
              </div>
              
              <div class="detail-row" v-if="activePayment.invoiceNumber">
                <div class="detail-label">Invoice #</div>
                <div class="detail-value">{{ activePayment.invoiceNumber }}</div>
              </div>
              
              <div class="detail-section" v-if="activePayment.description">
                <h4 class="detail-section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
                  Description
                </h4>
                <div class="detail-section-content">{{ activePayment.description }}</div>
              </div>
              
              <div class="detail-section" v-if="activePayment.receiptURL">
                <h4 class="detail-section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
                  Receipt
                </h4>
                <div class="detail-section-content">
                  <a :href="activePayment.receiptURL" target="_blank" class="document-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    View Receipt
                  </a>
                </div>
              </div>
              
              <div class="detail-row" v-if="activePayment.createdAt">
                <div class="detail-label">Created On</div>
                <div class="detail-value">{{ formatDate(activePayment.createdAt) }}</div>
              </div>
              
              <div class="detail-row" v-if="activePayment.updatedAt">
                <div class="detail-label">Last Updated</div>
                <div class="detail-value">{{ formatDate(activePayment.updatedAt) }}</div>
              </div>
            </div>
            
            <div class="modal-actions">
              <button @click="editPayment(activePayment)" class="btn-edit">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Edit
              </button>
              <button @click="confirmDelete(activePayment)" class="btn-delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                Delete
              </button>
              <button @click="closeViewModal" class="btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirmation Modal -->
      <div v-if="isConfirmingDelete" class="modal-overlay" @click.self="cancelDelete">
        <div class="modal modal-sm">
          <div class="modal-header">
            <h3 class="modal-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Confirm Deletion
            </h3>
          </div>
          
          <div class="modal-body">
            <p class="confirm-message">Are you sure you want to delete this payment? This action cannot be undone.</p>
            
            <div class="modal-actions">
              <button @click="cancelDelete" class="btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                Cancel
              </button>
              <button @click="deletePayment" class="btn-delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                Delete
              </button>
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
    const payments = ref([]);
    const loading = ref(true);
    const isModalOpen = ref(false);
    const isViewingDetails = ref(false);
    const isConfirmingDelete = ref(false);
    const editMode = ref(false);
    const searchQuery = ref("");
    const statusFilter = ref("all");
    const fileName = ref("");
    const selectedFile = ref(null);
    
    const activePayment = ref({});
    const paymentData = ref({
      supplier: "",
      amount: "",
      status: "Pending",
      paymentMethod: "",
      paymentDate: "",
      invoiceNumber: "",
      description: ""
    });

    const router = useRouter();

    const navigateToAddPayment = () => {
      router.push({ name: "AddPayment" });
    };

    // Computed values for stats
    const pendingPaymentsCount = computed(() => 
      payments.value.filter(payment => payment.status === "Pending").length
    );
    
    const paidPaymentsCount = computed(() => 
      payments.value.filter(payment => payment.status === "Paid").length
    );
    
    const totalPaymentAmount = computed(() => 
      payments.value.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
    );

    const filteredPayments = computed(() => {
      let result = [...payments.value];
      
      // Apply status filter
      if (statusFilter.value !== "all") {
        result = result.filter(payment => payment.status === statusFilter.value);
      }
      
      // Apply search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(payment => 
          payment.supplier.toLowerCase().includes(query) ||
          (payment.invoiceNumber && payment.invoiceNumber.toLowerCase().includes(query)) ||
          (payment.description && payment.description.toLowerCase().includes(query))
        );
      }
      
      return result;
    });

    const fetchPayments = async () => {
      try {
        loading.value = true;
        
        // Set up real-time listener for payments collection
        const unsubscribe = onSnapshot(collection(db, "payments"), (snapshot) => {
          payments.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          loading.value = false;
        });

        // Return unsubscribe function for cleanup
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching payments:", error);
        showNotification("Failed to fetch payments. Please try again.", "error");
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
    };

    const viewPayment = (payment) => {
      activePayment.value = { ...payment };
      isViewingDetails.value = true;
    };

    const closeViewModal = () => {
      isViewingDetails.value = false;
    };

    const resetForm = () => {
      paymentData.value = {
        supplier: "",
        amount: "",
        status: "Pending",
        paymentMethod: "",
        paymentDate: "",
        invoiceNumber: "",
        description: ""
      };
      fileName.value = "";
      selectedFile.value = null;
    };

    const editPayment = (payment) => {
      editMode.value = true;
      paymentData.value = { ...payment };
      
      // Close view modal if open
      if (isViewingDetails.value) {
        isViewingDetails.value = false;
      }
      
      isModalOpen.value = true;
    };

    const submitPayment = async () => {
      try {
        if (editMode.value) {
          // Update existing payment
          const paymentRef = doc(db, "payments", paymentData.value.id);
          await updateDoc(paymentRef, {
            ...paymentData.value,
            updatedAt: serverTimestamp()
          });
          showNotification("Payment updated successfully!");
        } else {
          // Add new payment
          await addDoc(collection(db, "payments"), {
            ...paymentData.value,
            createdAt: serverTimestamp()
          });
          showNotification("Payment added successfully!");
        }
        
        closeModal();
      } catch (error) {
        console.error("Error saving payment:", error);
        showNotification("Failed to save payment. Please try again.", "error");
      }
    };

    const confirmDelete = (payment) => {
      activePayment.value = payment;
      isConfirmingDelete.value = true;
      
      // Close view modal if open
      if (isViewingDetails.value) {
        isViewingDetails.value = false;
      }
    };

    const cancelDelete = () => {
      isConfirmingDelete.value = false;
    };

    const deletePayment = async () => {
      try {
        const paymentRef = doc(db, "payments", activePayment.value.id);
        await deleteDoc(paymentRef);
        showNotification("Payment deleted successfully!");
        isConfirmingDelete.value = false;
      } catch (error) {
        console.error("Error deleting payment:", error);
        showNotification("Failed to delete payment. Please try again.", "error");
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

    onMounted(fetchPayments);

    return {
      payments,
      loading,
      isModalOpen,
      isViewingDetails,
      isConfirmingDelete,
      editMode,
      searchQuery,
      statusFilter,
      paymentData,
      activePayment,
      fileName,
      pendingPaymentsCount,
      paidPaymentsCount,
      totalPaymentAmount,
      filteredPayments,
      showAddModal,
      closeModal,
      viewPayment,
      closeViewModal,
      editPayment,
      submitPayment,
      confirmDelete,
      cancelDelete,
      deletePayment,
      handleFileUpload,
      formatDate,
      formatCurrency,
      navigateToAddPayment
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

/* Payment Cards Grid */
.payments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.payment-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
}

.payment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* Card color accents based on status */
.payment-card-pending {
  border-top: 3px solid #fbbf24;
}

.payment-card-paid {
  border-top: 3px solid #10b981;
}

.payment-card-failed {
  border-top: 3px solid #ef4444;
}

.payment-card-header {
  padding: 15px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.payment-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.payment-title {
  font-weight: 600;
  color: #0f2942;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.payment-amount-tag {
  background-color: #0f2942;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  font-weight: 600;
}

.payment-card-body {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-details {
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

.payment-description {
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

.payment-card-actions {
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

.status-paid {
  background-color: #d1fae5;
  color: #065f46;
}

.status-failed {
  background-color: #fee2e2;
  color: #b91c1c;
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;
}

.modal {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 700px;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

.modal-sm {
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.modal-title {
  color: #0f2942;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-button {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-button:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.modal-body {
  padding: 20px;
}

/* Form Styling */
.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.textarea {
  min-height: 120px;
  resize: vertical;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
  display: block;
}

/* File Upload */
.file-upload {
  position: relative;
  margin-top: 8px;
}

.file-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.file-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 15px;
  background-color: #f1f5f9;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.file-label:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

/* Modal actions */
.modal-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Button Styles */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

.btn-edit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit:hover {
  background-color: #0284c7;
  transform: translateY(-1px);
}

.btn-delete {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-delete:hover {
  background-color: #dc2626;
  transform: translateY(-1px);
}

/* Payment Details View */
.payment-details-view {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detail-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 10px;
}

.detail-label {
  width: 120px;
  font-weight: 600;
  color: #64748b;
  font-size: 0.9rem;
}

.detail-value {
  flex: 1;
  color: #0f172a;
}

.detail-section {
  margin-bottom: 15px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.detail-section-title {
  background-color: #0f2942;
  color: white;
  padding: 10px 15px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.9rem;
}

.detail-section-content {
  padding: 15px;
  color: #334155;
  line-height: 1.5;
  white-space: pre-wrap;
}

.document-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.document-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.confirm-message {
  color: #334155;
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 20px;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Notification */
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #0f2942;
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s ease;
}

.notification.show {
  transform: translateY(0);
  opacity: 1;
}

.notification.error {
  background-color: #ef4444;
}

.notification.success {
  background-color: #10b981;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
  }

  .search-container,
  .filter-container {
    width: 100%;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }

  .payments-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal {
    width: 95%;
  }

  .modal-actions button {
    width: 100%;
  }

  .stats-overview {
    flex-direction: column;
  }

  .stats-overview .stat-item {
    width: 100%;
  }
}

.main-content {
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

.main-content.collapsed {
  margin-left: 0;
}
</style>