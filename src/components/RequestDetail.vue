<template>
  <div class="admin-wrapper">
    <!-- Background Pattern -->
    <div class="background-pattern">
      <div class="pattern-overlay"></div>
    </div>

    <!-- Admin Card -->
    <div class="admin-card">
      <div class="card-header">
        <div class="header-content">
          <div class="logo-container">
            <img src="@/assets/proculogo.png" alt="Procurement System Logo" class="logo" />
          </div>
          <div class="header-text align-left">
            <h1 class="title">Request Details</h1>
            <p class="subtitle">View detailed information about the selected purchase request</p>
          </div>
        </div>
      </div>

      <div class="card-content">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading request details...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="errorMessage" class="error-container">
          <div class="error-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="error-icon"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <p>{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Request Details -->
        <div v-else class="details-container">
          <div class="status-banner-row">
            <div class="status-banner" :class="statusClass">
              <span class="status-text">{{ requestDetails.status }}</span>
            </div>
            <select
              v-model="statusDropdownValue"
              @change="onStatusDropdownChange"
              class="status-dropdown"
            >
              <option v-for="step in procurementSteps" :key="step" :value="step">{{ step }}</option>
            </select>
          </div>
          
          <div class="details-grid">
            <div class="detail-section">
              <h3 class="section-title">Request Information</h3>
              <div class="detail-row">
                <span class="detail-label">Request ID</span>
                <span class="detail-value highlight">{{ requestDetails.requestId }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Item Name</span>
                <span class="detail-value">{{ requestDetails.itemName }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Quantity</span>
                <span class="detail-value">{{ requestDetails.quantity }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Description</span>
                <span class="detail-value">{{ requestDetails.description }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Estimated Cost</span>
                <span class="detail-value cost">₱{{ requestDetails.estimatedCost.toLocaleString() }}</span>
              </div>
            </div>
            
            <div class="detail-section">
              <h3 class="section-title">Requester Information</h3>
              <div class="detail-row">
                <span class="detail-label">Requested By</span>
                <span class="detail-value">{{ requestDetails.userEmail }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date Created</span>
                <span class="detail-value">{{ formatDate(requestDetails.createdAt) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Required By</span>
                <span class="detail-value">{{ formatDate(requestDetails.requiredDate) }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section full-width">
            <h3 class="section-title">Justification</h3>
            <div class="justification-box">
              {{ requestDetails.justification }}
            </div>
          </div>

          <div class="detail-section full-width" v-if="requestDetails.prDocumentURL">
            <h3 class="section-title">PR Document Attachment</h3>
            <div class="pdf-viewer-box">
              <iframe
                v-if="requestDetails.prDocumentURL"
                :src="requestDetails.prDocumentURL"
                width="100%"
                height="500px"
                frameborder="0"
                style="border:1px solid #e2e8f0; border-radius:8px;"
                allowfullscreen
              ></iframe>
              <div v-else class="no-attachment">No PR document uploaded.</div>
              <div class="pdf-download-link">
                <a :href="requestDetails.prDocumentURL" target="_blank" rel="noopener" class="btn-primary">
                  Download/View Full PDF
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="actions" v-if="!loading && !errorMessage">
          <button @click="goBack" class="btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="m15 18-6-6 6-6"/></svg>
            Back
          </button>
          <div class="action-buttons">
            <button @click="rejectRequest" class="btn-reject" :disabled="requestDetails.status === 'Rejected'">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              Reject
            </button>
            <button @click="approveRequest" class="btn-approve" :disabled="requestDetails.status === 'Approved'">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M20 6 9 17l-5-5"/></svg>
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "RequestDetail",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const requestId = route.params.id;

    const loading = ref(true);
    const errorMessage = ref("");
    const requestDetails = ref({});
    const procurementSteps = [
      "DATE RECEIVED (PR)",
      "BAC CONTROL NO.",
      "END USER",
      "PARTICULARS",
      "ABC (Approved Budget for Contract)",
      "SUPPLIER",
      "AMOUNT",
      "STATUS",
      "AS OF",
      "Elapsed Time",
      "PREPARED RFQ",
      "ISSUED RFQ",
      "CANVASS FORWARDED TO END USER",
      "ABSTRACT OF CANVASS",
      "BAC RESOLUTION",
      "NOA PREPARED",
      "NOA REVIEWED & SIGNED",
      "FORWARDED TO END USER (NOA)",
      "PO/CONTRACT PREPARED",
      "CONTRACT REVIEWED",
      "CONTRACT SIGNED",
      "PO FORWARDED TO OPA",
      "CONTRACT APPROVED",
      "RET TO BAC",
      "FORWARDED TO END USER",
      "NOTICE TO PROCEED",
      "PREPARATION",
      "REVIEW",
      "FORWARDED TO EA",
      "NTP APPROVED",
      "FORWARDED TO END USER (NTP)",
      "PO/CONTRACT & NTP POSTED",
      "REMARKS"
    ];

    const statusDropdownValue = ref("");

    // Set dropdown value when details are loaded
    onMounted(() => {
      fetchRequestDetails();
      // Wait for fetchRequestDetails to finish, then set dropdown value
      setTimeout(() => {
        statusDropdownValue.value = requestDetails.value.status || procurementSteps[0];
      }, 500);
    });

    // Keep dropdown in sync with status
    watch(requestDetails, (newVal) => {
      statusDropdownValue.value = newVal.status || procurementSteps[0];
    });

    const onStatusDropdownChange = async () => {
      const newStatus = statusDropdownValue.value;
      if (!newStatus || newStatus === requestDetails.value.status) return;
      try {
        loading.value = true;
        const docRef = doc(db, "purchaseRequests", requestId);
        await updateDoc(docRef, { status: newStatus });
        requestDetails.value.status = newStatus;
        loading.value = false;
        alert(`Status updated to ${newStatus}.`);
      } catch (error) {
        alert("Failed to update status. Please try again.");
        loading.value = false;
      }
    };

    const statusClass = computed(() => {
      if (!requestDetails.value.status) return '';
      
      const status = requestDetails.value.status.toLowerCase();
      if (status === 'approved') return 'status-approved';
      if (status === 'rejected') return 'status-rejected';
      if (status === 'pending') return 'status-pending';
      return 'status-default';
    });

    const fetchRequestDetails = async () => {
      try {
        const docRef = doc(db, "purchaseRequests", requestId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          requestDetails.value = docSnap.data();
        } else {
          errorMessage.value = "Request not found.";
        }
      } catch (error) {
        errorMessage.value = "Error fetching request details: " + error.message;
      } finally {
        loading.value = false;
      }
    };

    const goBack = () => {
      router.push("/procurement-plan");
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return "N/A";
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const approveRequest = async () => {
      try {
        loading.value = true;
        const docRef = doc(db, "purchaseRequests", requestId);
        await updateDoc(docRef, { status: "Approved" });
        requestDetails.value.status = "Approved";
        loading.value = false;
        alert("Request approved successfully.");
      } catch (error) {
        console.error("Error approving request:", error);
        alert("Failed to approve request. Please try again.");
        loading.value = false;
      }
    };

    const rejectRequest = async () => {
      try {
        loading.value = true;
        const docRef = doc(db, "purchaseRequests", requestId);
        await updateDoc(docRef, { status: "Rejected" });
        requestDetails.value.status = "Rejected";
        loading.value = false;
        alert("Request rejected successfully.");
      } catch (error) {
        console.error("Error rejecting request:", error);
        alert("Failed to reject request. Please try again.");
        loading.value = false;
      }
    };

    return {
      loading,
      errorMessage,
      requestDetails,
      statusClass,
      goBack,
      formatDate,
      approveRequest,
      rejectRequest,
      procurementSteps,
      statusDropdownValue,
      onStatusDropdownChange,
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
  color: #334155;
}

.background-pattern {
  position: fixed;
  inset: 0;
  background-color: #0f172a;
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
  background-position: 0 0, 0 0, 40px 70px;
  opacity: 0.2;
}

.admin-card {
  width: 100%;
  max-width: 900px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}


.card-header {
  background: linear-gradient(135deg, #0f2942 0%, #102a42 100%);
  padding: 35px 30px;
  color: white;
  position: relative;
  overflow: hidden;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-container {
  flex-shrink: 0;
  margin-bottom: 0;
}

.logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
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
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1rem;
  opacity: 0.9;
  max-width: 500px;
  margin: 0;
}

.card-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.1), transparent 70%);
  pointer-events: none;
}

.logo-container {
  margin-bottom: 20px;
}

.logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1rem;
  opacity: 0.9;
  max-width: 500px;
  margin: 0;
}

.card-content {
  padding: 30px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #64748b;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(15, 41, 66, 0.1);
  border-radius: 50%;
  border-top-color: #0f2942;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  justify-content: center;
  padding: 30px 0;
}

.error-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background-color: #fee2e2;
  border-radius: 8px;
  color: #b91c1c;
  max-width: 500px;
}

.error-icon {
  flex-shrink: 0;
}

.details-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.status-banner-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.status-banner {
  min-width: 110px;
  padding: 6px 18px;
  border-radius: 6px;
  font-weight: 600;
  text-align: center;
  font-size: 1rem;
  background-color: #f1f5f9;
  color: #64748b;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.status-approved {
  background-color: #dcfce7;
  color: #166534;
}

.status-rejected {
  background-color: #fee2e2;
  color: #b91c1c;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-text {
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.detail-section {
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.full-width {
  grid-column: 1 / -1;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f2942;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(15, 41, 66, 0.1);
}

.detail-row {
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  border-bottom: 1px solid #e2e8f0;
}

@media (min-width: 640px) {
  .detail-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.detail-label {
  font-weight: 500;
  color: #64748b;
  margin-bottom: 4px;
}

@media (min-width: 640px) {
  .detail-label {
    margin-bottom: 0;
  }
}

.detail-value {
  color: #1e293b;
  font-weight: 500;
}

.detail-value.highlight {
  color: #0f2942;
  font-weight: 600;
}

.detail-value.cost {
  color: #0f766e;
  font-weight: 600;
}

.justification-box {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  min-height: 100px;
  line-height: 1.6;
}

.pdf-viewer-box {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.pdf-viewer-box iframe {
  width: 100%;
  height: 500px;
  border: none;
}

.no-attachment {
  color: #64748b;
  text-align: center;
  padding: 20px;
}

.pdf-download-link {
  margin-top: 12px;
  text-align: center;
}

.btn-primary {
  display: inline-block;
  padding: 10px 20px;
  background-color: #0f2942;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #0d2330;
}

.actions {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn-secondary, .btn-approve, .btn-reject {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
  color: #334155;
}

.btn-approve {
  background-color: #10b981;
  color: white;
}

.btn-approve:hover:not(:disabled) {
  background-color: #059669;
  transform: translateY(-1px);
}

.btn-reject {
  background-color: #ef4444;
  color: white;
}

.btn-reject:hover:not(:disabled) {
  background-color: #dc2626;
  transform: translateY(-1px);
}

.btn-approve:disabled, .btn-reject:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.icon {
  flex-shrink: 0;
}
</style>