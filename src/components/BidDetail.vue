<template>
  <div>
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
            <div class="header-text">
              <h1 class="title">Bid Details</h1>
              <p class="subtitle">View detailed information about the selected bid</p>
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
                <span class="detail-value">{{ formatCurrency(bid.bidPrice) }} {{ bid.currency }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Validity Period:</span>
                <span class="detail-value">{{ bid.validityPeriod || 'N/A' }} days</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Delivery Time:</span>
                <span class="detail-value">{{ bid.deliveryTime || 'N/A' }} days</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Submission Date:</span>
                <span class="detail-value">{{ formatDate(bid.submissionDate) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="status-badge" :class="`status-${bid.status?.toLowerCase()}`">
                  {{ bid.status || 'Pending' }}
                </span>
              </div>
              <!-- Attachments (multiple files) -->
              <div class="detail-row" v-if="bid.attachments && bid.attachments.length">
                <span class="detail-label">Attachments:</span>
                <span class="detail-value">
                  <ul>
                    <li v-for="file in bid.attachments" :key="file.name">
                      📄 <a :href="file.url" target="_blank">{{ file.name }}</a>
                    </li>
                  </ul>
                </span>
              </div>
              <!-- Single Bid Document fallback -->
              <div class="detail-row" v-else-if="bid.documentUrl">
                <span class="detail-label">Bid Document:</span>
                <span class="detail-value"><a :href="bid.documentUrl" target="_blank">View Submitted Bid Document</a></span>
              </div>
            </div>

            <!-- Scoring Breakdown -->
            <div class="detail-section" v-if="bid.technicalScore !== undefined || bid.financialScore !== undefined">
              <h3 class="detail-section-title">Scoring Breakdown</h3>
              <div class="detail-row" v-if="bid.technicalScore !== undefined">
                <span class="detail-label">Technical Score:</span>
                <span class="detail-value">{{ bid.technicalScore }}%</span>
              </div>
              <div class="detail-row" v-if="bid.financialScore !== undefined">
                <span class="detail-label">Financial Score:</span>
                <span class="detail-value">{{ bid.financialScore }}%</span>
              </div>
              <div class="detail-row" v-if="bid.technicalScore !== undefined && bid.financialScore !== undefined">
                <span class="detail-label">Total Score:</span>
                <span class="detail-value">{{ (bid.technicalScore * 0.6 + bid.financialScore * 0.4).toFixed(2) }}%</span>
              </div>
            </div>

            <!-- Evaluator Remarks -->
            <div class="detail-section" v-if="bid.remarks">
              <h3 class="detail-section-title">Evaluator Remarks</h3>
              <p class="detail-value">"{{ bid.remarks }}"</p>
            </div>

            <!-- Checklist Status -->
            <div class="detail-section" v-if="bid.checklist">
              <h3 class="detail-section-title">Document Checklist</h3>
              <ul>
                <li>Mayor’s Permit: <span v-if="bid.checklist.mayorsPermit">✅</span><span v-else>❌</span></li>
                <li>Tax Clearance: <span v-if="bid.checklist.taxClearance">✅</span><span v-else>❌</span></li>
                <li>Audited FS: <span v-if="bid.checklist.auditedFS">✅</span><span v-else>❌</span></li>
                <li>Technical Specs: <span v-if="bid.checklist.technicalSpecs">✅</span><span v-else>❌</span></li>
              </ul>
            </div>

            <!-- Timeline / Audit Trail -->
            <div class="detail-section">
              <h3 class="detail-section-title">Timeline / Audit Trail</h3>
              <div class="detail-row">
                <span class="detail-label">Submitted:</span>
                <span class="detail-value">{{ formatDate(bid.submissionDate) }}</span>
              </div>
              <div class="detail-row" v-if="bid.evaluatedByName">
                <span class="detail-label">Evaluated by:</span>
                <span class="detail-value">{{ bid.evaluatedByName }}</span>
              </div>
              <div class="detail-row" v-if="bid.evaluatedAt">
                <span class="detail-label">Evaluated on:</span>
                <span class="detail-value">{{ bid.evaluatedAt?.toDate ? bid.evaluatedAt.toDate().toLocaleString() : formatDate(bid.evaluatedAt) }}</span>
              </div>
              <div class="detail-row" v-if="bid.approvedAt">
                <span class="detail-label">Approved on:</span>
                <span class="detail-value">{{ bid.approvedAt?.toDate ? bid.approvedAt.toDate().toLocaleString() : formatDate(bid.approvedAt) }}</span>
              </div>
              <div class="detail-row" v-if="bid.rejectedAt">
                <span class="detail-label">Rejected on:</span>
                <span class="detail-value">{{ bid.rejectedAt?.toDate ? bid.rejectedAt.toDate().toLocaleString() : formatDate(bid.rejectedAt) }}</span>
              </div>
            </div>

            <!-- Bid Description -->
            <div class="detail-section" v-if="bid.description">
              <h3 class="detail-section-title">Bid Description</h3>
              <p class="detail-value">{{ bid.description }}</p>
            </div>

            <!-- Terms and Conditions -->
            <div class="detail-section" v-if="bid.termsAndConditions">
              <h3 class="detail-section-title">Terms and Conditions</h3>
              <p class="detail-value">{{ bid.termsAndConditions }}</p>
            </div>

            <div class="detail-section" v-if="bid.notes">
              <h3 class="detail-section-title">Notes</h3>
              <p class="detail-value">{{ bid.notes }}</p>
            </div>

            <!-- Bid Attachments Download Section -->
            <div v-if="bid.attachments && bid.attachments.length" class="detail-section">
              <h3 class="detail-section-title">📎 Bid Attachments</h3>
              <ul>
                <li v-for="file in bid.attachments" :key="file.fileName" class="mb-2">
                  <a
                    :href="file.fileUrl"
                    target="_blank"
                    class="text-blue-600 underline hover:text-blue-800"
                    download
                  >
                    ⬇️ {{ file.fileName }}
                  </a>
                  <span class="text-gray-500 text-sm ml-2">({{ formatFileSize(file.fileSize) }})</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button @click="goBack" class="btn-back">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Back
            </button>
            <button @click="showApproveModal = true" class="btn-approve">
              Approve Bid
            </button>
            <button @click="showRejectModal = true" class="btn-reject">
              Reject Bid
            </button>
            <button @click="requestMoreInfo" class="btn-info">
              Request More Info
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Approve Confirmation Modal -->
    <div v-if="showApproveModal" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;">
      <div style="background:#fff;padding:32px 24px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.25);min-width:320px;max-width:90vw;text-align:center;">
        <h2 style="margin-bottom:16px;font-size:2rem;font-weight:700;color:#0f2942;">Confirm Approval</h2>
        <p style="margin-bottom:24px;font-size:1.15rem;font-weight:500;color:#1e293b;">Are you sure you want to approve this bid?</p>
        <div style="display:flex;gap:12px;justify-content:center;">
          <button @click="approveBid" style="background:#059669;color:#fff;padding:10px 20px;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:1.1rem;">Yes, Approve</button>
          <button @click="showApproveModal = false" style="background:#f1f5f9;color:#64748b;padding:10px 20px;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:1.1rem;">Cancel</button>
        </div>
      </div>
    </div>
    <!-- Reject Confirmation Modal -->
    <div v-if="showRejectModal" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;">
      <div style="background:#fff;padding:32px 24px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.25);min-width:320px;max-width:90vw;text-align:center;">
        <h2 style="margin-bottom:16px;font-size:2rem;font-weight:700;color:#b91c1c;">Confirm Rejection</h2>
        <p style="margin-bottom:24px;font-size:1.15rem;font-weight:500;color:#b91c1c;">Are you sure you want to reject this bid?</p>
        <div style="display:flex;gap:12px;justify-content:center;">
          <button @click="rejectBid" style="background:#dc2626;color:#fff;padding:10px 20px;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:1.1rem;">Yes, Reject</button>
          <button @click="showRejectModal = false" style="background:#f1f5f9;color:#64748b;padding:10px 20px;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:1.1rem;">Cancel</button>
        </div>
      </div>
    </div>
    <!-- Request More Info Modal -->
    <div v-if="showRequestInfoModal" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;">
      <div style="background:#fff;padding:32px 24px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.25);min-width:320px;max-width:90vw;text-align:center;">
        <h2 style="margin-bottom:16px;font-size:2rem;font-weight:700;color:#2563eb;">Request More Information</h2>
        <p style="margin-bottom:16px;font-size:1.15rem;font-weight:500;color:#1e293b;">Enter the additional information you need from the bidder:</p>
        <textarea v-model="requestInfoText" style="width:100%;min-height:80px;margin-bottom:24px;padding:8px 12px;border-radius:6px;border:1px solid #ccc;resize:vertical;font-size:1.1rem;"></textarea>
        <div style="display:flex;gap:12px;justify-content:center;">
          <button @click="submitRequestInfo" style="background:#2563eb;color:#fff;padding:10px 20px;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:1.1rem;">Send Request</button>
          <button @click="showRequestInfoModal = false" style="background:#f1f5f9;color:#64748b;padding:10px 20px;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:1.1rem;">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const bidId = route.params.id;
    const bid = ref({});
    const loading = ref(true);
    const showApproveModal = ref(false);
    const showRejectModal = ref(false);
    const showRequestInfoModal = ref(false);
    const requestInfoText = ref("");

    const fetchBidDetails = async () => {
      try {
        const bidRef = doc(db, "bids", bidId);
        const bidSnapshot = await getDoc(bidRef);
        if (bidSnapshot.exists()) {
          bid.value = bidSnapshot.data();
        } else {
          alert("Bid not found");
          router.push("/admin-bid-review");
        }
      } catch (error) {
        console.error("Error fetching bid details:", error);
        alert("Failed to fetch bid details.");
      } finally {
        loading.value = false;
      }
    };

    const approveBid = async () => {
      try {
        const bidRef = doc(db, "bids", bidId);
        await updateDoc(bidRef, { status: "Approved", approvedAt: new Date() });
        alert("Bid approved successfully!");
        router.push("/admin-bid-review");
      } catch (error) {
        console.error("Error approving bid:", error);
        alert("Failed to approve bid.");
      }
    };

    const rejectBid = async () => {
      try {
        const bidRef = doc(db, "bids", bidId);
        await updateDoc(bidRef, { status: "Rejected", rejectedAt: new Date() });
        alert("Bid rejected successfully!");
        router.push("/admin-bid-review");
      } catch (error) {
        console.error("Error rejecting bid:", error);
        alert("Failed to reject bid.");
      }
    };

    const requestMoreInfo = () => {
      showRequestInfoModal.value = true;
      requestInfoText.value = "";
    };

    const submitRequestInfo = async () => {
      try {
        if (!requestInfoText.value.trim()) {
          alert("Please enter your request.");
          return;
        }
        const bidRef = doc(db, "bids", bidId);
        await updateDoc(bidRef, { status: "More Info Requested", infoRequested: requestInfoText.value });
        alert("Information request sent successfully!");
        showRequestInfoModal.value = false;
        router.push("/admin-bid-review");
      } catch (error) {
        console.error("Error requesting more information:", error);
        alert("Failed to request more information.");
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
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
    };

    onMounted(fetchBidDetails);

    return {
      bid,
      loading,
      approveBid,
      rejectBid,
      requestMoreInfo,
      goBack,
      formatCurrency,
      formatDate,
      formatFileSize,
      showApproveModal,
      showRejectModal,
      showRequestInfoModal,
      requestInfoText,
      submitRequestInfo,
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
  text-align: center;
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

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-approved {
  background-color: #d1fae5;
  color: #065f46;
}

.status-rejected {
  background-color: #fee2e2;
  color: #b91c1c;
}

.status-more-info-requested {
  background-color: #e0f2fe;
  color: #0369a1;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-start; /* Align buttons to the left */
  margin-top: 20px; /* Add spacing from the content above */
}

.btn-approve {
  background-color: #059669;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-reject {
  background-color: #dc2626;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-info {
  background-color: #2563eb;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
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
</style>
