<template>
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
        <h1 class="title">Submit Bid</h1>
        <p class="subtitle">Provide your bid details for the selected purchase request</p>
      </div>

      <div class="card-content">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading purchase details...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="error-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <p>{{ error }}</p>
          <button @click="goBack" class="retry-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg>
            Return to Purchases
          </button>
        </div>

        <!-- Success State -->
        <div v-else-if="bidSubmitted" class="success-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="success-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <h2>Bid Submitted Successfully!</h2>
          <p>Your bid has been submitted for review. You will be notified of any updates.</p>
          <div class="success-actions">
            <button @click="goBack" class="btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg>
              Return to Purchases
            </button>
            <button @click="resetForm" class="btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path></svg>
              Submit Another Bid
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div v-else class="bid-container">
          <!-- Purchase Details Section -->
          <div class="purchase-details-section">
            <h2 class="section-title">Purchase Details</h2>
            <div class="purchase-details-card">
              <div class="purchase-header">
                <div class="purchase-id">
                  <span class="id-label">Request ID:</span>
                  <span class="id-badge">{{ purchase.requestId || purchase.id?.substring(0, 8) || 'N/A' }}</span>
                </div>
                <span class="status-badge approved">Approved</span>
              </div>
              
              <div class="purchase-info-grid">
                <div class="info-group">
                  <h3 class="info-title">Item</h3>
                  <p class="info-value">{{ purchase.itemName || 'N/A' }}</p>
                </div>
                
                <div class="info-group">
                  <h3 class="info-title">Category</h3>
                  <p class="info-value">{{ purchase.category || 'N/A' }}</p>
                </div>
                
                <div class="info-group">
                  <h3 class="info-title">Quantity</h3>
                  <p class="info-value">{{ purchase.quantity || 'N/A' }}</p>
                </div>
                
                <div class="info-group">
                  <h3 class="info-title">Date Approved</h3>
                  <p class="info-value">{{ formatDate(purchase.dateApproved || purchase.updatedAt) }}</p>
                </div>
                
                <div class="info-group full-width">
                  <h3 class="info-title">Description</h3>
                  <p class="info-value description">{{ purchase.description || 'No description provided' }}</p>
                </div>
                
                <div class="info-group" v-if="purchase.estimatedCost">
                  <h3 class="info-title">Estimated Cost</h3>
                  <p class="info-value">₱{{ purchase.estimatedCost.toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Bid Form Section -->
          <div class="bid-form-section">
            <h2 class="section-title">Bid Information</h2>
            <form @submit.prevent="submitBid" class="bid-form">
              <div class="form-grid">
                <div class="form-group full-width">
                  <label for="bidTitle">Bid Title <span class="required">*</span></label>
                  <input 
                    type="text" 
                    id="bidTitle" 
                    v-model="bidForm.title" 
                    class="form-input" 
                    placeholder="Enter a title for your bid"
                    required
                  />
                  <span v-if="validationErrors.title" class="error-message">{{ validationErrors.title }}</span>
                </div>
                
                <div class="form-group">
                  <label for="bidAmount">Bid Amount (₱) <span class="required">*</span></label>
                  <input 
                    type="number" 
                    id="bidAmount" 
                    v-model="bidForm.amount" 
                    class="form-input" 
                    placeholder="Enter bid amount"
                    min="0"
                    step="0.01"
                    required
                  />
                  <span v-if="validationErrors.amount" class="error-message">{{ validationErrors.amount }}</span>
                </div>
                
                <div class="form-group">
                  <label for="bidValidity">Validity Period (days) <span class="required">*</span></label>
                  <input 
                    type="number" 
                    id="bidValidity" 
                    v-model="bidForm.validityDays" 
                    class="form-input" 
                    placeholder="How long is this bid valid"
                    min="1"
                    required
                  />
                  <span v-if="validationErrors.validityDays" class="error-message">{{ validationErrors.validityDays }}</span>
                </div>
                
                <div class="form-group">
                  <label for="deliveryTime">Delivery Time (days) <span class="required">*</span></label>
                  <input 
                    type="number" 
                    id="deliveryTime" 
                    v-model="bidForm.deliveryDays" 
                    class="form-input" 
                    placeholder="Estimated delivery time"
                    min="1"
                    required
                  />
                  <span v-if="validationErrors.deliveryDays" class="error-message">{{ validationErrors.deliveryDays }}</span>
                </div>
                
                <div class="form-group full-width">
                  <label for="bidDescription">Description</label>
                  <textarea 
                    id="bidDescription" 
                    v-model="bidForm.description" 
                    class="form-textarea" 
                    placeholder="Provide details about your bid, including specifications, terms, and any other relevant information"
                    rows="4"
                  ></textarea>
                  <span v-if="validationErrors.description" class="error-message">{{ validationErrors.description }}</span>
                </div>
                
                <div class="form-group full-width">
                  <label>Attachments <span class="required">*</span></label>
                  <div 
                    class="file-upload-area" 
                    @click="triggerFileInput" 
                    @dragover.prevent 
                    @drop.prevent="onFileDrop"
                    :class="{ 'drag-over': isDragging }"
                    @dragenter.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false"
                  >
                    <input 
                      type="file" 
                      ref="fileInput" 
                      @change="onFileChange" 
                      class="file-input" 
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      multiple
                    />
                    <div v-if="bidForm.files.length === 0" class="file-upload-placeholder">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      <p>Drag and drop files here or click to browse</p>
                      <span class="file-types">PDF, Word, Excel, or Image files</span>
                    </div>
                  </div>
                  <span v-if="validationErrors.files" class="error-message">{{ validationErrors.files }}</span>
                  
                  <!-- File Preview Section -->
                  <div v-if="bidForm.files.length > 0" class="file-preview-list">
                    <div v-for="(file, index) in bidForm.files" :key="index" class="file-preview-item">
                      <div class="file-preview-info">
                        <svg v-if="isImageFile(file)" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        <svg v-else-if="isPdfFile(file)" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        <div class="file-details">
                          <span class="file-name">{{ file.name }}</span>
                          <span class="file-size">{{ formatFileSize(file.size) }}</span>
                        </div>
                      </div>
                      <button type="button" @click="removeFile(index)" class="remove-file-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div class="form-group full-width">
                  <label for="bidTerms">Terms and Conditions</label>
                  <textarea 
                    id="bidTerms" 
                    v-model="bidForm.terms" 
                    class="form-textarea" 
                    placeholder="Enter any additional terms and conditions for your bid"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              
              <div class="form-actions">
                <button type="button" @click="goBack" class="btn-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg>
                  Cancel
                </button>
                <button type="submit" class="btn-primary" :disabled="isSubmitting">
                  <span v-if="isSubmitting">
                    <div class="spinner-small"></div>
                    Submitting...
                  </span>
                  <span v-else>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    Submit Bid
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { db, storage } from '@/firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  Timestamp,
  setDoc // <-- add this import
} from 'firebase/firestore';
import { 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';

export default {
  name: 'SubmitBid',
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    // State variables
    const purchase = ref({});
    const loading = ref(true);
    const error = ref(null);
    const bidSubmitted = ref(false);
    const isSubmitting = ref(false);
    const fileInput = ref(null);
    const isDragging = ref(false);
    
    // Form state
    const bidForm = reactive({
      title: '',
      amount: null,
      description: '',
      validityDays: 30,
      deliveryDays: 14,
      terms: '',
      files: []
    });
    
    // Validation errors
    const validationErrors = reactive({
      title: '',
      amount: '',
      validityDays: '',
      deliveryDays: '',
      description: '',
      files: ''
    });
    
    // Get purchase ID from route params or localStorage
    const purchaseId = computed(() => {
      return route.params.purchaseId || localStorage.getItem('selectedPurchaseId');
    });
    
    // Fetch purchase details
    const fetchPurchaseDetails = async () => {
      if (!purchaseId.value) {
        error.value = 'No purchase selected. Please go back and select a purchase.';
        loading.value = false;
        return;
      }
      
      try {
        const purchaseRef = doc(db, 'purchaseRequests', purchaseId.value);
        const purchaseDoc = await getDoc(purchaseRef);
        
        if (!purchaseDoc.exists()) {
          error.value = 'Purchase not found. It may have been deleted or you do not have access.';
        } else {
          const data = purchaseDoc.data();
          
          // Handle Timestamp objects
          const createdAt = data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate() 
            : (data.createdAt ? new Date(data.createdAt) : new Date());
            
          const updatedAt = data.updatedAt instanceof Timestamp 
            ? data.updatedAt.toDate() 
            : (data.updatedAt ? new Date(data.updatedAt) : new Date());
            
          const approvalDate = data.approvalDate instanceof Timestamp 
            ? data.approvalDate.toDate() 
            : (data.approvalDate ? new Date(data.approvalDate) : updatedAt);
          
          purchase.value = { 
            id: purchaseDoc.id, 
            ...data,
            createdAt: createdAt,
            updatedAt: updatedAt,
            dateApproved: approvalDate
          };
        }
      } catch (err) {
        console.error('Error fetching purchase details:', err);
        error.value = 'Failed to load purchase details. Please try again.';
      } finally {
        loading.value = false;
      }
    };
    
    // Format date
    const formatDate = (date) => {
      if (!date) return 'N/A';
      
      const dateObj = date instanceof Date ? date : new Date(date);
      
      if (isNaN(dateObj.getTime())) return 'Invalid Date';
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };
    
    // Format file size
    const formatFileSize = (bytes) => {
      if (!bytes) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    // Trigger file input
    const triggerFileInput = () => {
      fileInput.value.click();
    };
    
    // Handle file change
    const onFileChange = (event) => {
      const newFiles = Array.from(event.target.files);
      bidForm.files = [...bidForm.files, ...newFiles];
      validationErrors.files = '';
    };
    
    // Handle file drop
    const onFileDrop = (event) => {
      isDragging.value = false;
      const newFiles = Array.from(event.dataTransfer.files);
      bidForm.files = [...bidForm.files, ...newFiles];
      validationErrors.files = '';
    };
    
    // Remove file
    const removeFile = (index) => {
      bidForm.files.splice(index, 1);
    };
    
    // Check if file is an image
    const isImageFile = (file) => {
      return file.type.startsWith('image/');
    };
    
    // Check if file is a PDF
    const isPdfFile = (file) => {
      return file.type === 'application/pdf';
    };
    
    // Validate form
    const validateForm = () => {
      let isValid = true;
      
      // Reset validation errors
      Object.keys(validationErrors).forEach(key => {
        validationErrors[key] = '';
      });
      
      // Validate title
      if (!bidForm.title.trim()) {
        validationErrors.title = 'Bid title is required';
        isValid = false;
      } else if (bidForm.title.trim().length < 5) {
        validationErrors.title = 'Bid title must be at least 5 characters';
        isValid = false;
      }
      
      // Validate amount
      if (!bidForm.amount) {
        validationErrors.amount = 'Bid amount is required';
        isValid = false;
      } else if (bidForm.amount <= 0) {
        validationErrors.amount = 'Bid amount must be greater than zero';
        isValid = false;
      }
      
      // Validate validity days
      if (!bidForm.validityDays) {
        validationErrors.validityDays = 'Validity period is required';
        isValid = false;
      } else if (bidForm.validityDays < 1) {
        validationErrors.validityDays = 'Validity period must be at least 1 day';
        isValid = false;
      }
      
      // Validate delivery days
      if (!bidForm.deliveryDays) {
        validationErrors.deliveryDays = 'Delivery time is required';
        isValid = false;
      } else if (bidForm.deliveryDays < 1) {
        validationErrors.deliveryDays = 'Delivery time must be at least 1 day';
        isValid = false;
      }
      
      // Validate files
      if (bidForm.files.length === 0) {
        validationErrors.files = 'At least one attachment is required';
        isValid = false;
      }
      
      return isValid;
    };
    
    // Submit bid
    const submitBid = async () => {
      if (!validateForm()) {
        // Scroll to the first error
        const firstError = document.querySelector('.error-message');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      isSubmitting.value = true;
      try {
        const uploadedFiles = [];
        
        // Upload each file to Firebase Storage
        for (const file of bidForm.files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `bids/${purchaseId.value}/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
          const fileRef = storageRef(storage, fileName);
          
          const snapshot = await uploadBytes(fileRef, file);
          const fileUrl = await getDownloadURL(snapshot.ref);
          
          uploadedFiles.push({
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            fileUrl: fileUrl,
            filePath: fileName,
            uploadedAt: new Date().toISOString()
          });
        }
        
        // Create bid attachment object
        const bidAttachment = {
          title: bidForm.title,
          amount: parseFloat(bidForm.amount),
          description: bidForm.description,
          validityDays: parseInt(bidForm.validityDays),
          deliveryDays: parseInt(bidForm.deliveryDays),
          terms: bidForm.terms,
          files: uploadedFiles,
          submittedAt: new Date().toISOString(),
          submittedBy: "Current User", // Replace with actual user info when available
          status: "pending"
        };
        
        // Update purchase document in Firestore
        const purchaseRef = doc(db, 'purchaseRequests', purchaseId.value);
        await updateDoc(purchaseRef, {
          bidAttachments: arrayUnion(bidAttachment),
          lastBidDate: new Date().toISOString()
        });

        // --- ADD: Save bid to global bids collection ---
        const bidId = `${purchaseId.value}_${Date.now()}`;
        const bidRef = doc(db, 'bids', bidId);
        await setDoc(bidRef, {
          id: bidId,
          purchaseRequestId: purchaseId.value,
          bidTitle: bidForm.title,
          bidPrice: parseFloat(bidForm.amount),
          validityPeriod: parseInt(bidForm.validityDays),
          deliveryTime: parseInt(bidForm.deliveryDays),
          description: bidForm.description,
          termsAndConditions: bidForm.terms,
          attachments: uploadedFiles,
          submissionDate: new Date(),
          status: 'Pending',
          submittedBy: 'Current User' // Replace with actual user name or ID
        });
        // --- END ADD ---

        bidSubmitted.value = true;
      } catch (err) {
        console.error('Error submitting bid:', err);
        error.value = 'Failed to submit bid. Please try again.';
      } finally {
        isSubmitting.value = false;
      }
    };
    
    // Go back to purchases page
    const goBack = () => {
      router.push({ name: 'ApprovedPurchases' });
    };
    
    // Reset form for another bid
    const resetForm = () => {
      bidForm.title = '';
      bidForm.amount = null;
      bidForm.description = '';
      bidForm.validityDays = 30;
      bidForm.deliveryDays = 14;
      bidForm.terms = '';
      bidForm.files = [];
      bidSubmitted.value = false;
    };
    
    // Fetch purchase details on component mount
    onMounted(fetchPurchaseDetails);
    
    return {
      purchase,
      loading,
      error,
      bidSubmitted,
      isSubmitting,
      bidForm,
      validationErrors,
      fileInput,
      isDragging,
      formatDate,
      formatFileSize,
      triggerFileInput,
      onFileChange,
      onFileDrop,
      removeFile,
      isImageFile,
      isPdfFile,
      submitBid,
      goBack,
      resetForm
    };
  }
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
  text-align: center;
  color: white;
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

/* Loading, Error, and Success States */
.loading-state,
.error-state,
.empty-state,
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  color: #4a5568;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(49, 130, 206, 0.2);
  border-radius: 50%;
  border-top-color: #3182ce;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1s ease-in-out infinite;
  display: inline-block;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  color: #e53e3e;
  margin-bottom: 16px;
}

.success-icon {
  color: #38a169;
  margin-bottom: 16px;
}

.success-state h2 {
  color: #2f855a;
  margin-bottom: 12px;
}

.success-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.retry-button {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background-color: #edf2f7;
  color: #2d3748;
}

/* Bid Container */
.bid-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Section Titles */
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #edf2f7;
}

/* Purchase Details Card */
.purchase-details-card {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
}

.purchase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.purchase-id {
  display: flex;
  align-items: center;
  gap: 8px;
}

.id-label {
  font-weight: 500;
  color: #4a5568;
}

.id-badge {
  display: inline-block;
  padding: 4px 8px;
  background-color: #ebf8ff;
  color: #2b6cb0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  font-family: monospace;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.approved {
  background-color: #c6f6d5;
  color: #2f855a;
}

.purchase-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.info-group {
  margin-bottom: 8px;
}

.info-group.full-width {
  grid-column: 1 / -1;
}

.info-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #718096;
  margin-bottom: 4px;
}

.info-value {
  color: #2d3748;
  font-size: 1rem;
}

.info-value.description {
  white-space: pre-line;
}

/* Bid Form */
.bid-form-section {
  margin-top: 16px;
}

.bid-form {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #2d3748;
}

.required {
  color: #e53e3e;
}

.form-input,
.form-textarea {
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  background-color: #ffffff;
  color: #2d3748;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.error-message {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 2px;
}

/* File Upload */
.file-upload-area {
  border: 2px dashed #e2e8f0;
  border-radius: 6px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-upload-area:hover {
  border-color: #cbd5e0;
  background-color: #f7fafc;
}

.file-upload-area.drag-over {
  border-color: #3182ce;
  background-color: #ebf8ff;
}

.file-input {
  display: none;
}

.file-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #718096;
}

.file-upload-placeholder svg {
  color: #a0aec0;
}

.file-types {
  font-size: 12px;
  color: #a0aec0;
}

/* File Preview */
.file-preview-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-preview-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: #ffffff;
}

.file-preview-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-details {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 2px;
}

.file-size {
  font-size: 12px;
  color: #718096;
}

.remove-file-btn {
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-file-btn:hover {
  background-color: #fed7d7;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

/* Buttons */
.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #0f2942;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: #1a4971;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #edf2f7;
  color: #4a5568;
  padding: 10px 20px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
  color: #2d3748;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .purchase-info-grid {
    grid-template-columns: 1fr;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
  
  .success-actions {
    flex-direction: column;
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .loading-spinner,
  .spinner-small {
    animation: none;
  }
}
</style>