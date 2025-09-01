<template>
  <div class="user-pr-wrapper">
    <div class="user-pr-header">
      <img src="@/assets/proculogo.png" alt="Procurement System Logo" class="logo" />
      <div class="header-text">
        <h1 class="title">My Purchase Requests</h1>
        <p class="subtitle">View all purchase requests you have submitted.</p>
      </div>
    </div>
    <div class="user-pr-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading your purchase requests...</p>
      </div>
      <div v-else-if="errorMessage" class="error-container">
        <div class="error-box">
          <p>{{ errorMessage }}</p>
        </div>
      </div>
      <div v-else>
        <div v-if="userRequests.length === 0" class="no-requests">
          <p>You have not submitted any purchase requests yet.</p>
        </div>
        <div v-else class="pr-list">
          <div v-for="request in userRequests" :key="request.requestId" class="pr-card">
            <div class="pr-info">
              <div><strong>Item:</strong> {{ request.itemName }}</div>
              <div><strong>Quantity:</strong> {{ request.quantity }}</div>
              <div><strong>Status:</strong> <span :class="statusClass(request.status)">{{ request.status }}</span></div>
              <div><strong>Submitted:</strong> {{ formatDate(request.createdAt) }}</div>
            </div>
            <button class="view-link" @click="openModal(request)">View Details</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">Purchase Request Details</h2>
        <div class="modal-details">
          <div><strong>Item:</strong> {{ modalRequest.itemName }}</div>
          <div><strong>Quantity:</strong> {{ modalRequest.quantity }}</div>
          <div><strong>Status:</strong> <span :class="statusClass(modalRequest.status)">{{ modalRequest.status }}</span></div>
          <div><strong>Submitted:</strong> {{ formatDate(modalRequest.createdAt) }}</div>
          <div><strong>Category:</strong> {{ modalRequest.category }}</div>
          <div><strong>Priority:</strong> {{ modalRequest.priority }}</div>
          <div><strong>Description:</strong> {{ modalRequest.description }}</div>
          <div><strong>Estimated Cost:</strong> ₱{{ modalRequest.estimatedCost }}</div>
          <div><strong>Required By:</strong> {{ formatDate(modalRequest.requiredDate) }}</div>
          <div><strong>Justification:</strong> {{ modalRequest.justification }}</div>
          <div v-if="modalRequest.prDocumentURL">
            <a :href="modalRequest.prDocumentURL" target="_blank" class="view-link">View PR Document (PDF)</a>
          </div>
        </div>
        <button class="modal-close" @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db, auth } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default {
  name: "UserPurchaseRequests",
  setup() {
    const loading = ref(true);
    const errorMessage = ref("");
    const userRequests = ref([]);

    const formatDate = (timestamp) => {
      if (!timestamp) return "N/A";
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch {
        return "N/A";
      }
    };

    const statusClass = (status) => {
      if (!status) return '';
      const s = status.toLowerCase();
      if (s === 'approved') return 'status-approved';
      if (s === 'rejected' || s === 'declined') return 'status-rejected';
      if (s === 'pending') return 'status-pending';
      return 'status-default';
    };

    // Modal state
    const showModal = ref(false);
    const modalRequest = ref({});
    const openModal = (request) => {
      modalRequest.value = request;
      showModal.value = true;
    };
    const closeModal = () => {
      showModal.value = false;
      modalRequest.value = {};
    };

    onMounted(async () => {
      loading.value = true;
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          errorMessage.value = "You must be logged in to view your requests.";
          loading.value = false;
          return;
        }
        const prQuery = query(
          collection(db, "purchaseRequests"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(prQuery);
        userRequests.value = querySnapshot.docs.map(doc => ({ requestId: doc.id, ...doc.data() }));
      } catch (error) {
        errorMessage.value = "Error loading your requests: " + error.message;
      } finally {
        loading.value = false;
      }
    });

    return {
      loading,
      errorMessage,
      userRequests,
      formatDate,
      statusClass,
      showModal,
      modalRequest,
      openModal,
      closeModal
    };
  }
};
</script>

<style scoped>

.user-pr-wrapper {
  max-width: 900px;
  margin: 40px auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  padding: 32px;
  color: #1e293b;
}
.user-pr-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}
.logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
}
.header-text {
  flex: 1;
}
.title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: #0f2942;
  letter-spacing: -0.5px;
}
.subtitle {
  font-size: 1.1rem;
  color: #334155;
  font-weight: 500;
}
.user-pr-content {
  min-height: 200px;
}
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #0f2942;
  font-size: 1.1rem;
  font-weight: 600;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-radius: 50%;
  border-top-color: #0f2942;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.error-container {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}
.error-box {
  background: #fee2e2;
  color: #b91c1c;
  padding: 18px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
}
.no-requests {
  text-align: center;
  color: #0f2942;
  padding: 32px 0;
  font-size: 1.15rem;
  font-weight: 600;
}
.pr-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.pr-card {
  background: #f8fafc;
  border-radius: 10px;
  padding: 18px 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.08rem;
  color: #1e293b;
  font-weight: 600;
}
.pr-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #0f2942;
  font-weight: 700;
}
.status-approved {
  color: #166534;
  font-weight: 700;
}
.status-rejected {
  color: #b91c1c;
  font-weight: 700;
}
.status-pending {
  color: #92400e;
  font-weight: 700;
}
.status-default {
  color: #334155;
  font-weight: 700;
}
.view-link {
  color: #0f2942;
  font-weight: 700;
  text-decoration: underline;
  transition: color 0.2s;
  font-size: 1.08rem;
}
.view-link:hover {
  color: #166534;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 32px 28px;
  max-width: 500px;
  width: 100%;
  color: #1e293b;
}
.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 18px;
  color: #0f2942;
}
.modal-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}
.modal-close {
  background: #0f2942;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-close:hover {
  background: #166534;
}
</style>
