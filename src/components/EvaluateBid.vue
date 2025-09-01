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
          <div class="header-content">
            <div class="logo-container">
              <img src="@/assets/proculogo.png" alt="Procurement System Logo" class="logo" />
            </div>
            <div class="header-text align-left">
              <h1 class="title">Bid Evaluation</h1>
              <p class="subtitle">Score, approve, or reject vendor bid submissions</p>
            </div>
          </div>
          <!-- Stats Overview -->
          <div class="stats-overview">
            <div class="stat-item">
              <div class="stat-value">{{ bids.length }}</div>
              <div class="stat-label">Total Bids</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ pendingBidsCount }}</div>
              <div class="stat-label">Pending</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ approvedBidsCount }}</div>
              <div class="stat-label">Approved</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ rejectedBidsCount }}</div>
              <div class="stat-label">Rejected</div>
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
                placeholder="Search by bidder name..." 
                class="search-input"
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <div class="filter-container">
              <select v-model="statusFilter" class="filter-select">
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <!-- Bids List -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="loading-icon"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
            </div>
            <p>Loading bids...</p>
          </div>
          
          <div v-else-if="filteredBids.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><path d="M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2h-4a2 2 0 0 0-2 2v-7"></path><path d="M8 6h3a1 1 0 0 1 1 1v9"></path><path d="M8 22h4a2 2 0 0 0 2-2v-7"></path><path d="M2 19h5"></path><path d="M18 5V3c0-.6-.4-1-1-1h-4a1 1 0 0 0-1 1v2"></path><path d="M10 5V3c0-.6-.4-1-1-1H5a1 1 0 0 0-1 1v2"></path></svg>
            <p class="empty-text">No bids available for evaluation.</p>
            <p class="empty-subtext">Bids will appear here once vendors submit them.</p>
          </div>
          
          <div v-else class="bids-grid">
            <div v-for="bid in filteredBids" :key="bid.id" class="bid-card" :class="`bid-card-${bid.status?.toLowerCase()}`">
              <div class="bid-card-header">
                <div class="bid-header-content">
                  <div class="bid-title">{{ bid.bidderName || 'Anonymous Vendor' }}</div>
                  <span class="status-badge" :class="`status-${bid.status?.toLowerCase()}`">
                    {{ bid.status || 'Pending' }}
                  </span>
                </div>
                <div class="bid-price-tag">
                  <span class="bid-price">{{ formatCurrency(bid.bidPrice) }}</span>
                  <span class="bid-currency">{{ bid.currency }}</span>
                </div>
              </div>
              
              <div class="bid-card-body">
                <div class="bid-score">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <span>Score: <strong>{{ bid.score || 'Not evaluated' }}</strong></span>
                </div>
                
                <div class="bid-date" v-if="bid.submissionDate">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span>{{ formatDate(bid.submissionDate) }}</span>
                </div>
                
                <div class="bid-description">{{ truncateDescription(bid.description) || 'No description provided' }}</div>
              </div>
              
              <div class="bid-card-actions">
                <button @click="navigateToBidEvaluation(bid.id)" class="card-action-btn evaluate">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  Evaluate
                </button>
                <button @click="approveBid(bid.id)" class="card-action-btn approve">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                  Approve
                </button>
                <button @click="rejectBid(bid.id)" class="card-action-btn reject">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                  Reject
                </button>
              </div>
            </div>
          </div>

          <!-- Evaluate Bid Modal -->
          <div v-if="isEvaluating" class="modal-overlay" @click.self="isEvaluating = false">
            <div class="modal">
              <div class="modal-header">
                <h3 class="modal-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  Evaluate Bid
                </h3>
                <button @click="isEvaluating = false" class="close-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                </button>
              </div>
              
              <div class="modal-body">
                <!-- Bid details section -->
                <div class="modal-details-grid">
                  <div class="modal-detail-card">
                    <div class="detail-card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      <span>Bidder</span>
                    </div>
                    <div class="detail-card-content">{{ selectedBid.bidderName || 'Anonymous' }}</div>
                  </div>
                  
                  <div class="modal-detail-card">
                    <div class="detail-card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      <span>Bid Amount</span>
                    </div>
                    <div class="detail-card-content">{{ formatCurrency(selectedBid.bidPrice) }} {{ selectedBid.currency }}</div>
                  </div>
                  
                  <div class="modal-detail-card" v-if="selectedBid.submissionDate">
                    <div class="detail-card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      <span>Submission Date</span>
                    </div>
                    <div class="detail-card-content">{{ formatDate(selectedBid.submissionDate) }}</div>
                  </div>
                  
                  <div class="modal-detail-card" v-if="selectedBid.status">
                    <div class="detail-card-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      <span>Status</span>
                    </div>
                    <div class="detail-card-content">
                      <span class="status-badge" :class="`status-${selectedBid.status?.toLowerCase()}`">
                        {{ selectedBid.status || 'Pending' }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- Description section -->
                <div class="detail-section" v-if="selectedBid.description">
                  <h4 class="detail-section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
                    Description
                  </h4>
                  <div class="detail-section-content">{{ selectedBid.description }}</div>
                </div>
                
                <!-- Notes section -->
                <div class="detail-section" v-if="selectedBid.notes">
                  <h4 class="detail-section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    Additional Notes
                  </h4>
                  <div class="detail-section-content">{{ selectedBid.notes }}</div>
                </div>
                
                <!-- Evaluation form -->
                <form @submit.prevent="submitEvaluation" class="evaluation-form">
                  <h4 class="form-section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    Evaluation Score
                  </h4>
                  
                  <div class="score-input-container">
                    <input 
                      v-model="evaluationScore" 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="1" 
                      class="score-slider" 
                      required 
                    />
                    <div class="score-display">
                      <span class="score-value">{{ evaluationScore }}</span>
                      <span class="score-max">/100</span>
                    </div>
                  </div>
                  
                  <div class="score-labels">
                    <span>Poor</span>
                    <span>Average</span>
                    <span>Excellent</span>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Evaluation Notes</label>
                    <textarea 
                      v-model="evaluationNotes" 
                      class="input-field textarea" 
                      placeholder="Add notes about your evaluation (optional)"
                    ></textarea>
                  </div>
                  
                  <div class="modal-actions">
                    <button type="button" @click="isEvaluating = false" class="btn-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                      Cancel
                    </button>
                    <button type="submit" class="btn-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                      Submit Evaluation
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminNavigationBar from './AdminNavigationBar.vue';
import { ref, computed, onMounted } from "vue"; // Import Vue functions
import { db } from "@/firebase"; // Import Firestore database instance
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore"; // Import Firestore functions
import { useRouter } from "vue-router";

export default {
  components: {
    AdminNavigationBar,
  },
  setup() {
    const bids = ref([]);
    const loading = ref(true); // Define 'loading' as a ref
    const isEvaluating = ref(false);
    const selectedBid = ref({});
    const evaluationScore = ref(50);
    const evaluationNotes = ref("");
    const searchQuery = ref("");
    const statusFilter = ref("all");
    const router = useRouter();

    // Computed values for stats
    const pendingBidsCount = computed(() => 
      bids.value.filter(bid => !bid.status || bid.status === "pending").length
    );
    
    const approvedBidsCount = computed(() => 
      bids.value.filter(bid => bid.status === "approved").length
    );
    
    const rejectedBidsCount = computed(() => 
      bids.value.filter(bid => bid.status === "rejected").length
    );

    const filteredBids = computed(() => {
      let result = [...bids.value];
      
      // Apply status filter
      if (statusFilter.value !== "all") {
        result = result.filter(bid => 
          (!bid.status && statusFilter.value === "pending") || 
          (bid.status?.toLowerCase() === statusFilter.value.toLowerCase())
        );
      }
      
      // Apply search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(bid => 
          (bid.bidderName && bid.bidderName.toLowerCase().includes(query)) ||
          (bid.description && bid.description.toLowerCase().includes(query))
        );
      }
      
      return result;
    });

    const fetchBids = async () => {
      try {
        loading.value = true;
        
        // Set up real-time listener for bids collection
        const unsubscribe = onSnapshot(collection(db, "bids"), (snapshot) => {
          bids.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            submissionDate: doc.data().submissionDate || null,
            description: doc.data().description || "",
            notes: doc.data().notes || "",
          }));
          loading.value = false;
        });

        // Return unsubscribe function for cleanup
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching bids:", error);
        showNotification("Failed to fetch bids. Please try again.", "error");
        loading.value = false;
      }
    };

    const evaluateBid = (index) => {
      // Ensure the selected bid is set correctly
      selectedBid.value = { ...bids.value[index] };
      evaluationScore.value = selectedBid.value.score || 50; // Default score to 50 if not set
      evaluationNotes.value = selectedBid.value.evaluationNotes || ""; // Default notes to empty if not set
      isEvaluating.value = true; // Open the modal
    };

    const submitEvaluation = async () => {
      try {
        const bidRef = doc(db, "bids", selectedBid.value.id);
        await updateDoc(bidRef, { 
          score: parseInt(evaluationScore.value),
          evaluationNotes: evaluationNotes.value,
          evaluationDate: new Date()
        });
        
        showNotification("Bid evaluation submitted successfully!");
        isEvaluating.value = false;
      } catch (error) {
        console.error("Error submitting evaluation:", error);
        showNotification("Failed to submit evaluation. Please try again.", "error");
      }
    };

    const approveBid = async (id) => {
      try {
        const bidRef = doc(db, "bids", id);
        await updateDoc(bidRef, { 
          status: "approved",
          approvalDate: new Date()
        });
        
        showNotification("Bid approved successfully!");
      } catch (error) {
        console.error("Error approving bid:", error);
        showNotification("Failed to approve bid. Please try again.", "error");
      }
    };

    const rejectBid = async (id) => {
      try {
        const bidRef = doc(db, "bids", id);
        await updateDoc(bidRef, { 
          status: "rejected",
          rejectionDate: new Date()
        });
        
        showNotification("Bid rejected successfully!");
      } catch (error) {
        console.error("Error rejecting bid:", error);
        showNotification("Failed to reject bid. Please try again.", "error");
      }
    };

    const formatCurrency = (amount) => {
      if (!amount) return "$0.00";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
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

    const truncateDescription = (text, maxLength = 100) => {
      if (!text) return "";
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
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

    const navigateToBidEvaluation = (bidId) => {
      router.push({ name: "BidEvaluation", params: { id: bidId } });
    };

    onMounted(fetchBids);

    return {
      bids,
      loading,
      isEvaluating,
      selectedBid,
      evaluationScore,
      evaluationNotes,
      searchQuery,
      statusFilter,
      filteredBids,
      pendingBidsCount,
      approvedBidsCount,
      rejectedBidsCount,
      evaluateBid,
      submitEvaluation,
      approveBid,
      rejectBid,
      formatCurrency,
      formatDate,
      truncateDescription,
      navigateToBidEvaluation
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

/* Bids Grid */
.bids-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.bid-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
}

.bid-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* Card color accents based on status */
.bid-card-pending {
  border-top: 3px solid #fbbf24;
}

.bid-card-approved {
  border-top: 3px solid #10b981;
}

.bid-card-rejected {
  border-top: 3px solid #ef4444;
}

.bid-card-header {
  padding: 15px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.bid-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.bid-title {
  font-weight: 600;
  color: #0f2942;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.bid-price-tag {
  background-color: #0f2942;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  font-size: 0.9rem;
}

.bid-price {
  font-weight: 600;
}

.bid-currency {
  margin-left: 3px;
  opacity: 0.8;
  font-size: 0.8rem;
}

.bid-card-body {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bid-score, .bid-date {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.9rem;
}

.bid-score svg, .bid-date svg {
  color: #94a3b8;
}

.bid-description {
  font-size: 0.9rem;
  color: #334155;
  line-height: 1.5;
  margin-top: auto;
}

.bid-card-actions {
  padding: 15px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

.card-action-btn.evaluate {
  background-color: #f1f5f9;
  color: #0f2942;
  grid-column: 1 / -1;
}

.card-action-btn.evaluate:hover {
  background-color: #e2e8f0;
}

.card-action-btn.approve {
  background-color: #d1fae5;
  color: #065f46;
}

.card-action-btn.approve:hover {
  background-color: #a7f3d0;
}

.card-action-btn.reject {
  background-color: #fee2e2;
  color: #b91c1c;
}

.card-action-btn.reject:hover {
  background-color: #fca5a5;
}

.card-action-btn:enable {
  opacity: 0.6;
  cursor: not-allowed;
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

.status-approved {
  background-color: #d1fae5;
  color: #065f46;
}

.status-rejected {
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

/* Modal details grid */
.modal-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.modal-detail-card {
  background-color: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.detail-card-header {
  background-color: #0f2942;
  color: white;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.9rem;
}

.detail-card-content {
  padding: 15px;
  color: #334155;
}

/* Detail sections */
.detail-section {
  margin-bottom: 20px;
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

/* Evaluation form */
.evaluation-form {
  margin-top: 30px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 20px;
}

.form-section-title {
  color: #0f2942;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-input-container {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.score-slider {
  flex: 1;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(to right, #fecaca, #fef3c7, #d1fae5);
  border-radius: 8px;
  outline: none;
}

.score-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0f2942;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.score-display {
  display: flex;
  align-items: baseline;
  min-width: 70px;
}

.score-value {
  font-size: 2rem;
  font-weight: 700;
  color: #0f2942;
}

.score-max {
  font-size: 1rem;
  color: #64748b;
}

.score-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: #64748b;
  font-size: 0.8rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
  display: block;
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

  .search-container {
    width: 100%;
  }

  .filter-container {
    width: 100%;
  }

  .bids-grid {
    grid-template-columns: 1fr;
  }

  .modal-details-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
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