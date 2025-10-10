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
        <!-- Header with logo/title flex and stats -->
        <div class="card-header card-header-flex">
          <div class="logo-title-flex">
            <img src="@/assets/proculogo.png" alt="Procurement System Logo" class="logo" />
            <div class="header-texts">
              <h1 class="title">Admin Bid Review</h1>
              <p class="subtitle">Review and process vendor bid submissions</p>
            </div>
          </div>
          <!-- Stats Overview -->
          <div class="stats-overview">
            <div class="stat-item">
              <div class="stat-value">{{ filteredBids.length }}</div>
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
                placeholder="Search by project, vendor or description..." 
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
                <option value="more-info">Needs More Info</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="loading-icon"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
            </div>
            <p>Loading bids...</p>
          </div>
          
          <div v-else-if="filteredBids.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><path d="M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2h-4a2 2 0 0 0-2 2v-7"></path><path d="M8 6h3a1 1 0 0 1 1 1v9"></path><path d="M8 22h4a2 2 0 0 0 2-2v-7"></path><path d="M2 19h5"></path><path d="M18 5V3c0-.6-.4-1-1-1h-4a1 1 0 0 0-1 1v2"></path><path d="M10 5V3c0-.6-.4-1-1-1H5a1 1 0 0 0-1 1v2"></path></svg>
            <p class="empty-text">No bids available for review.</p>
            <p class="empty-subtext">Bids will appear here once vendors submit them.</p>
          </div>

          <template v-else>
            <!-- Section Header -->
            <div class="section-header">
              <h3 class="section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/></svg>
                Bid Submissions
              </h3>
              <div class="status-count">
                <span>Showing {{ filteredBids.length }} of {{ bids.length }} bids</span>
              </div>
            </div>

            <!-- Bids Cards Grid -->
            <div class="bids-grid">
              <div v-for="bid in filteredBids" :key="bid.id" class="bid-card" :class="`bid-card-${bid.status.toLowerCase()}`">
                <div class="bid-card-header">
                  <div class="bid-header-content">
                    <div class="bid-title">
                      {{ bid.itemName || bid.fileName || 'Unnamed Request' }}
                      <span
                        :class="{
                          'text-green-600': bid.source === 'firestore',
                          'text-red-500': bid.source === 'storage-only'
                        }"
                        style="font-size:0.8em;margin-left:8px;"
                      >
                        {{ bid.source === 'firestore' ? 'Registered' : 'Unregistered' }}
                      </span>
                    </div>
                    <span class="status-badge" :class="`status-${bid.status.toLowerCase()}`">
                      {{ bid.status }}
                    </span>
                  </div>
                  <div class="bid-price-tag">
                    <span class="bid-price">{{ formatCurrency(bid.bidPrice) }}</span>
                    <span class="bid-currency">{{ bid.currency }}</span>
                  </div>
                </div>

                <div class="bid-card-body">
                  <div class="bid-vendor">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span>{{ bid.bidderName || 'Anonymous Vendor' }}</span>
                  </div>
                  <div class="bid-date">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span>{{ formatDate(bid.submissionDate || bid.submittedAt) }}</span>
                  </div>
                  <div class="bid-description">
                    <template v-if="bid.fileUrl">
                      <a :href="bid.fileUrl" target="_blank" class="text-blue-600 underline">Download File</a>
                    </template>
                    <template v-else>
                      {{ truncateDescription(bid.description) || 'No description provided' }}
                    </template>
                  </div>
                </div>

                <div v-if="bid.source === 'firestore'" class="bid-card-actions">
                  <button @click="navigateToBidDetail(bid.id)" class="card-action-btn view" title="View Details">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    Details
                  </button>
                  <button @click="approveBid(bid.id)" class="card-action-btn approve" title="Approve Bid" :enable="bid.status === 'Approved'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                    Approve
                  </button>
                  <button @click="rejectBid(bid.id)" class="card-action-btn reject" title="Reject Bid" :enable="bid.status === 'Rejected'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    Reject
                  </button>
                </div>
                <div v-else class="bid-card-actions">
                  <a v-if="bid.fileUrl" :href="bid.fileUrl" target="_blank" class="card-action-btn view" style="grid-column: 1 / -1;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    Download File
                  </a>
                  <button @click="registerBid(bid)" class="card-action-btn more-info text-blue-600" style="grid-column: 1 / -1;">
                    📝 Register This Bid
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Bid Details Modal -->
      <div v-if="isViewingDetails" class="modal-overlay" @click.self="closeViewModal">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-header-content">
              <h3 class="modal-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                Bid Details
              </h3>
              <span class="status-badge-large" :class="`status-${activeBid.status?.toLowerCase()}`">
                {{ activeBid.status }}
              </span>
            </div>
            <button @click="closeViewModal" class="close-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
          </div>
          <div class="modal-body">
            <!-- Main details -->
            <div class="modal-details-grid">
              <div class="modal-detail-card">
                <div class="detail-card-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/></svg>
                  <span>Purchase Request</span>
                </div>
                <div class="detail-card-content">{{ activeBid.itemName || 'N/A' }}</div>
              </div>
              
              <div class="modal-detail-card">
                <div class="detail-card-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <span>Bidder</span>
                </div>
                <div class="detail-card-content">{{ activeBid.bidderName || 'Anonymous' }}</div>
              </div>
              
              <div class="modal-detail-card">
                <div class="detail-card-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  <span>Bid Amount</span>
                </div>
                <div class="detail-card-content">{{ formatCurrency(activeBid.bidPrice) }} {{ activeBid.currency }}</div>
              </div>
              
              <div class="modal-detail-card">
                <div class="detail-card-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span>Submission Date</span>
                </div>
                <div class="detail-card-content">{{ formatDate(activeBid.submissionDate) }}</div>
              </div>
            </div>
            
            <!-- Description section -->
            <div class="detail-section">
              <h4 class="detail-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
                Description
              </h4>
              <div class="detail-section-content">{{ activeBid.description || 'No description provided' }}</div>
            </div>
            
            <!-- Additional info section if available -->
            <div v-if="activeBid.additionalInfo" class="detail-section">
              <h4 class="detail-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-7l3-7"></path><path d="M18 14v7"></path><path d="M18 14a4 4 0 1 0 0 0"></path></svg>
                Additional Information
              </h4>
              <div class="detail-section-content">{{ activeBid.additionalInfo }}</div>
            </div>
            
            <!-- Info request section if available -->
            <div v-if="activeBid.infoRequested" class="detail-section highlight-section">
              <h4 class="detail-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                Information Requested
              </h4>
              <div class="detail-section-content">{{ activeBid.infoRequested }}</div>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="approveBid(activeBid.id)" class="btn-approve" :enable="activeBid.status === 'Approved'">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
              Approve Bid
            </button>
            <button @click="rejectBid(activeBid.id)" class="btn-reject" :enable="activeBid.status === 'Rejected'">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              Reject Bid
            </button>
            <button @click="showRequestInfoModal" class="btn-info" :enable="activeBid.status === 'More Info Requested'">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
              Request Information
            </button>
            <button @click="closeViewModal" class="btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Request More Info Modal -->
      <div v-if="isRequestingInfo" class="modal-overlay" @click.self="closeRequestInfoModal">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
              Request Additional Information
            </h3>
            <button @click="closeRequestInfoModal" class="close-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
          </div>
          <form @submit.prevent="submitInfoRequest">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
                  Information Requested
                </label>
                <textarea v-model="infoRequestText" class="input-field textarea" placeholder="Specify what additional information you need from the vendor..." required></textarea>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" @click="closeRequestInfoModal" class="btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                Cancel
              </button>
              <button type="submit" class="btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
                Send Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminNavigationBar from './AdminNavigationBar.vue';
import { ref, onMounted, computed } from "vue";
import { db } from "@/firebase";
import { collection, doc, updateDoc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { storage } from "@/firebase";
import { ref as storageRef, listAll, getDownloadURL } from "firebase/storage";
import { useRouter } from "vue-router";

export default {
  components: {
    AdminNavigationBar,
  },
  setup() {
    const router = useRouter();
    const bids = ref([]);
    const loading = ref(true);
    const searchQuery = ref("");
    const statusFilter = ref("all");
    const isViewingDetails = ref(false);
    const isRequestingInfo = ref(false);
    const activeBid = ref({});
    const infoRequestText = ref("");

    // Computed values for stats
    const pendingBidsCount = computed(() => 
      bids.value.filter(bid => bid.status === "Pending").length
    );
    
    const approvedBidsCount = computed(() => 
      bids.value.filter(bid => bid.status === "Approved").length
    );
    
    const rejectedBidsCount = computed(() => 
      bids.value.filter(bid => bid.status === "Rejected").length
    );

    // Fetch bids from Firestore and also scan Storage for unregistered bids
    const fetchBids = async () => {
      try {
        loading.value = true;

        // --- Firestore listener ---
        const unsubscribe = onSnapshot(collection(db, "bids"), async (snapshot) => {
          const firestoreBids = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              status: data.status || "Pending",
              source: "firestore"
            };
          });

          // --- Storage fallback ---
          const storageBids = [];
          const folderRef = storageRef(storage, "bids");

          try {
            const folders = await listAll(folderRef);

            for (const userFolderRef of folders.prefixes) {
              const files = await listAll(userFolderRef);

              for (const fileRef of files.items) {
                const fileUrl = await getDownloadURL(fileRef);
                const alreadyInFirestore = firestoreBids.some(bid =>
                  bid.fileUrl === fileUrl || bid.id === userFolderRef.name
                );

                if (!alreadyInFirestore) {
                  storageBids.push({
                    id: userFolderRef.name + "_" + fileRef.name,
                    fileName: fileRef.name,
                    fileUrl,
                    status: "Unregistered",
                    submittedAt: null,
                    source: "storage-only"
                  });
                }
              }
            }
          } catch (err) {
            console.warn("⚠️ Could not fetch storage-only bids:", err);
          }

          bids.value = [...firestoreBids, ...storageBids];
          loading.value = false;
        });

        return unsubscribe;
      } catch (error) {
        console.error("❌ Error fetching bids:", error);
        showNotification("Failed to fetch bids. Please try again.", "error");
        loading.value = false;
      }
    };

    const filteredBids = computed(() => {
      let result = [...bids.value];
      
      // Apply status filter
      if (statusFilter.value !== "all") {
        result = result.filter(bid => 
          bid.status.toLowerCase() === statusFilter.value.toLowerCase()
        );
      }
      
      // Apply search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(bid => 
          (bid.itemName && bid.itemName.toLowerCase().includes(query)) ||
          (bid.bidderName && bid.bidderName.toLowerCase().includes(query)) ||
          (bid.description && bid.description.toLowerCase().includes(query))
        );
      }
      
      return result;
    });

    const truncateDescription = (text, maxLength = 100) => {
      if (!text) return "";
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    };

    const formatCurrency = (amount) => {
      if (!amount) return "Php 0.00";
      return "Php " + new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
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

    const viewBidDetails = (bid) => {
      activeBid.value = { ...bid };
      isViewingDetails.value = true;
    };

    const closeViewModal = () => {
      isViewingDetails.value = false;
    };

    const showRequestInfoModal = () => {
      isRequestingInfo.value = true;
      infoRequestText.value = "";
    };

    const closeRequestInfoModal = () => {
      isRequestingInfo.value = false;
    };

    const approveBid = async (bidId) => {
      try {
        const bidRef = doc(db, "bids", bidId);
        await updateDoc(bidRef, {
          status: "Approved",
          reviewDate: new Date()
        });
        
        // Update local state
        const index = bids.value.findIndex(bid => bid.id === bidId);
        if (index !== -1) {
          bids.value[index].status = "Approved";
          
          // Also update active bid if we're viewing it
          if (isViewingDetails.value && activeBid.value.id === bidId) {
            activeBid.value.status = "Approved";
          }
        }
        
        showNotification("Bid approved successfully!");
      } catch (error) {
        console.error("Error approving bid:", error);
        showNotification("Failed to approve bid. Please try again.", "error");
      }
    };

    const rejectBid = async (bidId) => {
      try {
        const bidRef = doc(db, "bids", bidId);
        await updateDoc(bidRef, {
          status: "Rejected",
          reviewDate: new Date()
        });
        
        // Update local state
        const index = bids.value.findIndex(bid => bid.id === bidId);
        if (index !== -1) {
          bids.value[index].status = "Rejected";
          
          // Also update active bid if we're viewing it
          if (isViewingDetails.value && activeBid.value.id === bidId) {
            activeBid.value.status = "Rejected";
          }
        }
        
        showNotification("Bid rejected successfully!");
      } catch (error) {
        console.error("Error rejecting bid:", error);
        showNotification("Failed to reject bid. Please try again.", "error");
      }
    };

    const requestMoreInfo = async (bidId) => {
      viewBidDetails(bids.value.find(bid => bid.id === bidId));
      showRequestInfoModal();
    };

    const submitInfoRequest = async () => {
      try {
        const bidRef = doc(db, "bids", activeBid.value.id);
        await updateDoc(bidRef, {
          status: "More Info Requested",
          infoRequested: infoRequestText.value,
          infoRequestDate: new Date()
        });
        
        // Update local state
        const index = bids.value.findIndex(bid => bid.id === activeBid.value.id);
        if (index !== -1) {
          bids.value[index].status = "More Info Requested";
          bids.value[index].infoRequested = infoRequestText.value;
          
          // Also update active bid
          activeBid.value.status = "More Info Requested";
          activeBid.value.infoRequested = infoRequestText.value;
        }
        
        closeRequestInfoModal();
        showNotification("Information request sent successfully!");
      } catch (error) {
        console.error("Error requesting information:", error);
        showNotification("Failed to send information request. Please try again.", "error");
      }
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

    const navigateToBidDetail = (bidId) => {
      router.push({ name: "BidDetail", params: { id: bidId } });
    };

    // Register a storage-only bid into Firestore
    const registerBid = async (bid) => {
      const bidId = bid.id;
      try {
        await setDoc(doc(db, "bids", bidId), {
          fileName: bid.fileName,
          fileUrl: bid.fileUrl,
          status: "Pending",
          submittedBy: "admin",
          submittedAt: serverTimestamp(),
          description: "Imported from storage",
          itemName: "Unnamed Request",
          bidderName: "Anonymous Vendor"
        });
        showNotification("Bid registered successfully!", "success");
      } catch (err) {
        console.error("❌ Failed to register bid:", err);
        showNotification("Failed to register bid.", "error");
      }
    };

    onMounted(fetchBids);

    return {
      bids,
      loading,
      searchQuery,
      statusFilter,
      filteredBids,
      isViewingDetails,
      isRequestingInfo,
      activeBid,
      infoRequestText,
      pendingBidsCount,
      approvedBidsCount,
      rejectedBidsCount,
      truncateDescription,
      formatCurrency,
      formatDate,
      viewBidDetails,
      closeViewModal,
      showRequestInfoModal,
      closeRequestInfoModal,
      approveBid,
      rejectBid,
      requestMoreInfo,
      submitInfoRequest,
      navigateToBidDetail,
      registerBid
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

.card-header.card-header-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #0f2942 0%, #102a42 100%);
  padding: 30px;
  color: white;
  gap: 30px;
  flex-wrap: wrap;
}

.logo-title-flex {
  display: flex;
  align-items: center;
  gap: 18px;
}

.logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
}

.header-texts {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: #fff;
}

.subtitle {
  font-size: 0.95rem;
  opacity: 0.8;
  color: #e0e7ef;
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

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f2942;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-count {
  font-size: 14px;
  color: #64748b;
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

.bid-card-more-info-requested {
  border-top: 3px solid #3b82f6;
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

.bid-vendor, .bid-date {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.9rem;
}

.bid-vendor svg, .bid-date svg {
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

.card-action-btn.view {
  background-color: #f1f5f9;
  color: #0f2942;
  grid-column: 1 / -1;
}

.card-action-btn.view:hover {
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

.card-action-btn.more-info {
  background-color: #dbeafe;
  color: #1e40af;
  grid-column: 1 / -1;
}

.card-action-btn.more-info:hover {
  background-color: #bfdbfe;
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

.status-badge-large {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
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

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 15px;
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

.highlight-section {
  background-color: #dbeafe;
  border-color: #93c5fd;
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

.modal-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

/* Form Styling */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
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

.btn-approve {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #059669;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-approve:hover {
  background-color: #047857;
  transform: translateY(-1px);
}

.btn-approve:enable {
  background-color: #d1fae5;
  color: #065f46;
  cursor: not-allowed;
  transform: none;
}

.btn-reject {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reject:hover {
  background-color: #b91c1c;
  transform: translateY(-1px);
}

.btn-reject:enable {
  background-color: #fee2e2;
  color: #b91c1c;
  cursor: not-allowed;
  transform: none;
}

.btn-info {
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

.btn-info:hover {
  background-color: #0284c7;
  transform: translateY(-1px);
}

.btn-info:enable {
  background-color: #e0f2fe;
  color: #0369a1;
  cursor: not-allowed;
  transform: none;
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