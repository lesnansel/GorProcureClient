<template>
  <div class="admin-wrapper">
    <!-- Background Pattern -->
    <div class="background-pattern">
      <div class="pattern-overlay"></div>
    </div>
    <div class="main-content">
      <div class="admin-card">
        <div class="card-header">
          <div class="header-content">
            <div class="logo-container">
              <img src="@/assets/proculogo.png" alt="Procurement System Logo" class="logo" />
            </div>
            <div class="header-text align-left">
              <h1 class="title">Qualification Details</h1>
              <p class="subtitle">View supplier qualification information</p>
            </div>
          </div>
        </div>
        <div class="card-content">
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading qualification details...</p>
          </div>
          <div v-else-if="!qualification" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <p>Qualification not found.</p>
          </div>
          <div v-else class="qualification-details">
            <div class="detail-row">
              <span class="detail-label">Supplier:</span>
              <span class="detail-value">{{ qualification.supplierName }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Score:</span>
              <span class="detail-value">{{ qualification.evaluationScore }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Remarks:</span>
              <span class="detail-value">{{ qualification.remarks }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">{{ formatDate(qualification.evaluationDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Evaluator:</span>
              <span class="detail-value">{{ qualification.evaluator }}</span>
            </div>
            <div class="detail-row" v-if="qualification.fileUrl">
              <span class="detail-label">Supporting Document:</span>
              <span class="detail-value">
                <a :href="qualification.fileUrl" target="_blank" class="document-link">View File</a>
              </span>
            </div>
            <div class="modal-actions">
              <button class="btn-secondary" @click="goBack">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export default {
  name: "QualificationDetails",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const qualification = ref(null);
    const loading = ref(true);

    const fetchQualification = async () => {
      loading.value = true;
      try {
        const id = route.params.id;
        const docRef = doc(db, "qualifications", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          qualification.value = snapshot.data();
        } else {
          qualification.value = null;
        }
      } catch (err) {
        qualification.value = null;
      }
      loading.value = false;
    };

    const formatDate = (dateValue) => {
      if (!dateValue) return "N/A";
      // Firestore Timestamp or ISO string
      if (typeof dateValue === "object" && dateValue.toDate) {
        return dateValue.toDate().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });
      }
      // ISO string
      return new Date(dateValue).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    };

    const goBack = () => {
      router.back();
    };

    onMounted(fetchQualification);

    return {
      qualification,
      loading,
      formatDate,
      goBack
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
  background: #1a1a2e;
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
    linear-gradient(60deg, rgba(0, 0, 0, 0.1) 25%, transparent 25.5%, transparent 75%, rgba(0, 0, 0, 0.1) 75%, rgba(0, 0, 0, 0.1));
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px;
  opacity: 0.2;
}

.main-content {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  box-shadow: none;
  padding: 0;
}

.admin-card {
  width: 100%;
  max-width: 700px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  margin-top: 40px;
}

.card-header {
  background: linear-gradient(135deg, #0f2942 0%, #102a42 100%);
  padding: 30px;
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
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}
.subtitle {
  font-size: 1rem;
  opacity: 0.8;
  margin: 0;
  max-width: 500px;
}
.card-content {
  padding: 30px;
}
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
.qualification-details {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.detail-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 10px;
}
.detail-label {
  width: 140px;
  font-weight: 600;
  color: #64748b;
  font-size: 1rem;
}
.detail-value {
  flex: 1;
  color: #0f172a;
  font-size: 1rem;
}
.document-link {
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}
.btn-secondary {
  background-color: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 18px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn-secondary:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}
</style>
