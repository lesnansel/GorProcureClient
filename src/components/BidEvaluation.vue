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
            <h1 class="title">Bid Evaluation</h1>
            <p class="subtitle">Evaluate the selected bid and provide feedback</p>
          </div>
        </div>
      </div>

      <div class="card-content">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading bid details...</p>
        </div>

        <!-- Bid Details -->
        <div v-else>
          <!-- Bid Information Section (add/replace this block) -->
          <div class="detail-section">
            <h3 class="detail-section-title">Bid Information</h3>
            <div class="detail-row">
              <span class="detail-label">Bid Title:</span>
              <span class="detail-value">{{ bid.bidTitle || 'Untitled Bid' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Bidder Name:</span>
              <span class="detail-value">{{ bid.bidderName || 'Anonymous Vendor' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Bid Amount:</span>
              <span class="detail-value">{{ formatCurrency(bid.bidPrice) }} {{ bid.currency || '' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Submission Date:</span>
              <span class="detail-value">{{ formatDate(bid.submissionDate) }}</span>
            </div>
          </div>

          <!-- Attachments Download Section -->
          <div v-if="bid.attachments && bid.attachments.length" class="detail-section">
            <h3 class="detail-section-title">Attachments</h3>
            <ul>
              <li v-for="file in bid.attachments" :key="file.fileName">
                📄 <a :href="file.fileUrl" target="_blank" download>{{ file.fileName }}</a>
                <span v-if="file.fileSize" class="text-gray-500 text-sm ml-2">({{ formatFileSize(file.fileSize) }})</span>
              </li>
            </ul>
          </div>

          <div class="detail-section" v-if="bid.description">
            <h3 class="detail-section-title">Description</h3>
            <p class="detail-value">{{ bid.description }}</p>
          </div>

          <!-- Document Compliance Checklist (RA 9184) -->
          <div class="detail-section">
            <h3 class="detail-section-title">Document Compliance Checklist</h3>
            <div class="checklist-row">
              <label><input type="checkbox" v-model="docs.secDti" /> SEC/DTI Registration</label>
              <label><input type="checkbox" v-model="docs.mayorPermit" /> Mayor's Permit</label>
              <label><input type="checkbox" v-model="docs.taxClearance" /> Tax Clearance</label>
              <label><input type="checkbox" v-model="docs.auditedFs" /> Audited Financial Statement</label>
              <label><input type="checkbox" v-model="docs.technicalForm" /> Technical Proposal/Form</label>
              <label><input type="checkbox" v-model="docs.financialForm" /> Financial Proposal/Form</label>
            </div>
          </div>

          <!-- Scoring Section -->
          <div class="detail-section">
            <h3 class="detail-section-title">Scoring</h3>
            <div class="form-group">
              <label>Technical Score (60%)</label>
              <input type="number" min="0" max="100" v-model.number="technicalScore" class="input-field" />
            </div>
            <div class="form-group">
              <label>Financial Score (40%)</label>
              <input type="number" min="0" max="100" v-model.number="financialScore" class="input-field" />
            </div>
            <div class="form-group">
              <label>Total Score</label>
              <input type="number" :value="totalScore" class="input-field" readonly />
            </div>
            <div class="form-group">
              <span class="score-status" :class="totalScore >= 75 ? 'pass' : 'fail'">
                {{ totalScore >= 75 ? 'PASS' : 'FAIL' }}
              </span>
            </div>
          </div>

          <!-- Evaluation Remarks -->
          <div class="detail-section">
            <h3 class="detail-section-title">Evaluator Remarks</h3>
            <textarea v-model="evaluationRemarks" class="input-field textarea" placeholder="Enter evaluation remarks or summary..."></textarea>
          </div>

          <!-- Evaluation Status & Actions -->
          <div class="evaluation-section">
            <h3 class="detail-section-title">Evaluation Status</h3>
            <div class="form-group">
              <select v-model="evaluationStatus" class="input-field select">
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="needs-review">Needs Further Review</option>
              </select>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button @click="goBack" class="btn-back">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Back
            </button>
            <button @click="confirmAction('approved')" class="btn-submit">Approve</button>
            <button @click="confirmAction('rejected')" class="btn-reject">Reject</button>
            <button @click="confirmAction('needs-review')" class="btn-review">Mark for Review</button>
          </div>

          <!-- Confirmation Modal -->
          <div v-if="showConfirm" class="modal-backdrop">
            <div class="modal-content">
              <h3>Confirm Action</h3>
              <p>
                Are you sure you want to set this bid as <b>{{ confirmStatusLabel }}</b>?
              </p>
              <div class="modal-actions">
                <button @click="submitEvaluation" class="btn-primary">Yes, Confirm</button>
                <button @click="showConfirm = false" class="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const bidId = route.params.id;
    const bid = ref({});
    const loading = ref(true);

    // Document checklist
    const docs = ref({
      secDti: false,
      mayorPermit: false,
      taxClearance: false,
      auditedFs: false,
      technicalForm: false,
      financialForm: false,
    });

    // Scoring
    const technicalScore = ref(0);
    const financialScore = ref(0);
    const totalScore = computed(() => {
      return (Number(technicalScore.value) * 0.6) + (Number(financialScore.value) * 0.4);
    });

    // Remarks and status
    const evaluationRemarks = ref("");
    const evaluationStatus = ref("approved");

    // Confirmation modal
    const showConfirm = ref(false);
    const confirmStatus = ref("approved");
    const confirmStatusLabel = computed(() => {
      if (confirmStatus.value === "approved") return "APPROVED";
      if (confirmStatus.value === "rejected") return "REJECTED";
      if (confirmStatus.value === "needs-review") return "FOR REVIEW";
      return confirmStatus.value;
    });

    // Load bid details
    const fetchBidDetails = async () => {
      try {
        const bidRef = doc(db, "bids", bidId);
        const bidSnapshot = await getDoc(bidRef);
        if (bidSnapshot.exists()) {
          bid.value = bidSnapshot.data();
          // Optionally, load checklist from bid if present
          if (bid.value.docs) docs.value = { ...docs.value, ...bid.value.docs };
          if (bid.value.technicalScore) technicalScore.value = bid.value.technicalScore;
          if (bid.value.financialScore) financialScore.value = bid.value.financialScore;
          if (bid.value.evaluationRemarks) evaluationRemarks.value = bid.value.evaluationRemarks;
          if (bid.value.evaluationStatus) evaluationStatus.value = bid.value.evaluationStatus;
        } else {
          alert("Bid not found");
          router.push("/evaluate-bids");
        }
      } catch (error) {
        console.error("Error fetching bid details:", error);
        alert("Failed to fetch bid details.");
      } finally {
        loading.value = false;
      }
    };

    // Confirm action modal
    const confirmAction = (status) => {
      confirmStatus.value = status;
      evaluationStatus.value = status;
      showConfirm.value = true;
    };

    // Submit evaluation with audit trail
    const submitEvaluation = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const bidRef = doc(db, "bids", bidId);
        await updateDoc(bidRef, {
          docs: docs.value,
          technicalScore: Number(technicalScore.value),
          financialScore: Number(financialScore.value),
          totalScore: Number(totalScore.value),
          evaluationRemarks: evaluationRemarks.value,
          evaluationStatus: evaluationStatus.value,
          evaluatedBy: user ? (user.displayName || user.email || user.uid) : "Unknown",
          evaluatedAt: serverTimestamp(),
        });
        showConfirm.value = false;
        alert("Evaluation submitted successfully!");
        router.push("/evaluate-bids");
      } catch (error) {
        console.error("Error submitting evaluation:", error);
        alert("Failed to submit evaluation.");
      }
    };

    const goBack = () => {
      router.back();
    };

    const formatCurrency = (amount) => {
      if (!amount) return "0.00";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
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

    const formatFileSize = (bytes) => {
      if (!bytes) return "0 Bytes";
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      const sizes = ["Bytes", "KB", "MB", "GB"];
      return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
    };

    onMounted(fetchBidDetails);

    return {
      bid,
      loading,
      docs,
      technicalScore,
      financialScore,
      totalScore,
      evaluationRemarks,
      evaluationStatus,
      showConfirm,
      confirmStatusLabel,
      confirmAction,
      submitEvaluation,
      goBack,
      formatCurrency,
      formatDate,
      formatFileSize,
    };
  },
};
</script>

<style scoped>
/* Admin Wrapper */
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

/* Admin Card */
.admin-card {
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
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
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 0.95rem;
  opacity: 0.8;
  max-width: 500px;
  margin: 0;
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

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #1e293b;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(15, 41, 66, 0.1);
  border-radius: 50%;
  border-top-color: #0f2942;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Detail Section */
.detail-section {
  margin-bottom: 20px;
}

.detail-section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #0f2942;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.detail-label {
  font-weight: 600;
  color: #64748b;
}

.detail-value {
  font-weight: 500;
  color: #334155;
}

/* Evaluation Section */
.evaluation-section {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
  display: block;
}

.input-field {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.textarea {
  min-height: 120px;
  resize: vertical;
}

.select {
  appearance: none;
  background-color: white;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  margin-top: 20px;
}

.btn-back {
  background-color: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 20px;
  transition: all 0.2s;
}

.btn-back:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

.btn-submit {
  background-color: #059669;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 20px;
  transition: all 0.2s;
}

.btn-submit:hover {
  background-color: #047857;
}

.btn-reject {
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 20px;
  transition: all 0.2s;
}

.btn-reject:hover {
  background-color: #b91c1c;
}

.btn-review {
  background-color: #f59e42;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 20px;
  transition: all 0.2s;
}

.btn-review:hover {
  background-color: #d97706;
}

/* Checklist Row */
.checklist-row {
  display: flex;
  flex-wrap: wrap;
  gap: 18px 32px;
  margin-bottom: 16px;
}

.checklist-row label {
  font-size: 1rem;
  color: #334155;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Score Status */
.score-status {
  font-weight: bold;
  font-size: 1.1rem;
  padding: 4px 12px;
  border-radius: 6px;
  display: inline-block;
}

.score-status.pass {
  background: #d1fae5;
  color: #059669;
}

.score-status.fail {
  background: #fee2e2;
  color: #dc2626;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-primary {
  background-color: #059669;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 20px;
  transition: all 0.2s;
}

.btn-primary:hover {
  background-color: #047857;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 20px;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}
</style>
