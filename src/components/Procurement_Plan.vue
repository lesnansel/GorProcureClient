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
        <div class="card-header card-header-flex">
          <div class="logo-title-flex">
            <img src="@/assets/proculogo.png" alt="Procurement System Logo" class="logo" />
            <div class="header-texts">
              <h1 class="title">Procurement Plan</h1>
              <p class="subtitle">Manage and review purchase requests efficiently.</p>
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
                placeholder="Search requests..." 
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="filter-icon"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </div>
          </div>

          <!-- Purchase Requests List -->
          <div v-if="filteredRequests.length" class="table-container">
            <table class="requests-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="request in filteredRequests" :key="request.id" class="table-row">
                  <td>{{ request.itemName }}</td>
                  <td>{{ request.quantity }}</td>
                  <td class="description-cell">{{ request.description }}</td>
                  <td>
                    <span :class="['status-badge', `status-${request.status.toLowerCase()}`]">
                      {{ request.status }}
                    </span>
                  </td>
                  <td class="actions-cell">
                    <button @click="navigateToDetails(request.id)" class="btn-icon" title="View Details">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else-if="!requests.length" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><path d="M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2h-4a2 2 0 0 0-2 2v-7"></path><path d="M8 6h3a1 1 0 0 1 1 1v9"></path><path d="M8 22h4a2 2 0 0 0 2-2v-7"></path><path d="M2 19h5"></path><path d="M18 5V3c0-.6-.4-1-1-1h-4a1 1 0 0 0-1 1v2"></path><path d="M10 5V3c0-.6-.4-1-1-1H5a1 1 0 0 0-1 1v2"></path></svg>
            <p class="empty-text">No purchase requests available.</p>
            <p class="empty-subtext">New requests will appear here once submitted.</p>
          </div>
          <div v-else class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path></svg>
            <p class="empty-text">No matching requests found.</p>
            <p class="empty-subtext">Try adjusting your search or filter criteria.</p>
          </div>

          <!-- View Purchase Request Modal - Single consolidated modal -->
          <div v-if="isViewing" class="modal-overlay" @click.self="closeModal">
            <div class="modal">
              <div class="modal-header">
                <h3 class="modal-title">Purchase Request Details</h3>
                <button @click="closeModal" class="close-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                </button>
              </div>
              <div class="modal-body">
                <!-- ProcurementStatusBar removed: implement new status logic here if needed -->
                <div class="detail-row">
                  <div class="detail-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                    <span>Item Name:</span>
                  </div>
                  <div class="detail-value">{{ viewRequestData.itemName }}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path><path d="M12 8v8"></path></svg>
                    <span>Quantity:</span>
                  </div>
                  <div class="detail-value">{{ viewRequestData.quantity }}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
                    <span>Description:</span>
                  </div>
                  <div class="detail-value description">{{ viewRequestData.description }}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 6v6l4 2"></path></svg>
                    <span>Status:</span>
                  </div>
                  <div class="detail-value">
                    <span :class="['status-badge', `status-${viewRequestData.status?.toLowerCase()}`]">
                      {{ viewRequestData.status }}
                    </span>
                  </div>
                </div>
                <div v-if="viewRequestData.approvalDate" class="detail-row">
                  <div class="detail-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span>Approval Date:</span>
                  </div>
                  <div class="detail-value">{{ formatDate(viewRequestData.approvalDate) }}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span>Requested By:</span>
                  </div>
                  <div class="detail-value">{{ viewRequestData.userEmail || 'Unknown' }}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span>Date Created:</span>
                  </div>
                  <div class="detail-value">{{ formatDate(viewRequestData.createdAt) }}</div>
                </div>
                <div v-if="viewRequestData.requiredDate" class="detail-row">
                  <div class="detail-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span>Required By:</span>
                  </div>
                  <div class="detail-value">{{ formatDate(viewRequestData.requiredDate) }}</div>
                </div>
                <div v-if="viewRequestData.estimatedCost" class="detail-row">
                  <div class="detail-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    <span>Est. Cost:</span>
                  </div>
                  <div class="detail-value">₱{{ viewRequestData.estimatedCost.toLocaleString() }}</div>
                </div>
                <div v-if="viewRequestData.justification" class="detail-row">
                  <div class="detail-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
                    <span>Justification:</span>
                  </div>
                  <div class="detail-value description">{{ viewRequestData.justification }}</div>
                </div>
              </div>
              <div class="modal-actions">
                <button type="button" @click="closeModal" class="btn-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                  Close
                </button>
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
import { ref, computed, onMounted } from "vue";
import { db } from "@/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useRouter } from 'vue-router';

export default {
  components: {
    AdminNavigationBar,
  },
  name: "ProcurementPlan",
  setup() {
    const router = useRouter();

    const requests = ref([]);
    const searchQuery = ref("");
    const statusFilter = ref("all");
    const isViewing = ref(false);
    const viewRequestData = ref({});
    const previousStatuses = ref({});

    const toastContainer = ref(null);

    const createToastContainer = () => {
      if (!toastContainer.value) {
        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.top = "20px";
        container.style.right = "20px";
        container.style.zIndex = "9999";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "10px";
        document.body.appendChild(container);
        toastContainer.value = container;
      }
    };

    // Email service configuration with fallback
    const EMAIL_SERVICE_URLS = [
      'http://127.0.0.1:5000',           // Local development
      'http://192.168.250.164:5000',     // Local network
      'https://govprocurebackend-1.onrender.com'  // Hosted fallback
    ];

    const sendStatusEmailNotification = async (email, prId, newStatus) => {
      console.log('📧 Sending email notification:', { email, prId, newStatus });
      
      // Validate email format
      if (!email || !email.includes('@')) {
        console.error('❌ Invalid email address:', email);
        showNotification('Invalid email address', 'error');
        return;
      }

      // Try each email service URL until one works
      for (let i = 0; i < EMAIL_SERVICE_URLS.length; i++) {
        const serviceUrl = EMAIL_SERVICE_URLS[i];
        console.log(`📤 Trying email service ${i + 1}/${EMAIL_SERVICE_URLS.length}: ${serviceUrl}`);
        
        try {
          // Set different timeouts based on service type
          let timeout;
          if (serviceUrl.includes('127.0.0.1') || serviceUrl.includes('192.168.')) {
            timeout = 10000; // 10 seconds for local services
          } else {
            timeout = 60000; // 60 seconds for hosted services (to handle cold starts)
          }
          
          console.log(`⏱️ Using timeout: ${timeout/1000} seconds for ${serviceUrl}`);
          
          const response = await fetch(`${serviceUrl}/send-pr-status-email`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ 
              email: email,
              prNumber: prId, 
              prId: prId,
              newStatus: newStatus 
            }),
            // Dynamic timeout based on service type
            signal: AbortSignal.timeout(timeout)
          });
          
          console.log(`📧 Email service ${serviceUrl} response status:`, response.status);
          
          const data = await response.json();
          console.log(`📧 Email service ${serviceUrl} response data:`, data);
          
          if (response.ok) {
            console.log(`✅ Email sent successfully via ${serviceUrl}`);
            showNotification(`Status email sent to ${email}!`, 'success');
            return; // Success, no need to try other URLs
          } else {
            console.warn(`⚠️ Email service ${serviceUrl} returned error:`, data.error);
            
            // If this is the last URL, show the error
            if (i === EMAIL_SERVICE_URLS.length - 1) {
              if (response.status === 503) {
                showNotification('Status updated! Email service temporarily unavailable.', 'warning');
              } else if (response.status === 500) {
                showNotification('Status updated! Email service configuration issue.', 'warning');
              } else {
                showNotification(`Status updated! Email error: ${data.error}`, 'warning');
              }
            }
          }
          
        } catch (error) {
          console.error(`❌ Email service ${serviceUrl} failed:`, error.message);
          
          // If this is the last URL, show final error
          if (i === EMAIL_SERVICE_URLS.length - 1) {
            if (error.name === 'TimeoutError') {
              const timeoutSeconds = serviceUrl.includes('127.0.0.1') || serviceUrl.includes('192.168.') ? 10 : 60;
              showNotification(`Status updated! All email services timed out (waited ${timeoutSeconds}s).`, 'warning');
            } else if (error.message.includes('fetch') || error.message.includes('network')) {
              showNotification('Status updated! All email services unreachable.', 'warning');
            } else {
              showNotification('Status updated! Email notification failed.', 'warning');
            }
          }
          // Continue to next URL
        }
      }
    };

    const showNotification = (message, type = "success") => {
      createToastContainer();

      const toast = document.createElement("div");
      toast.textContent = message;
      toast.style.minWidth = "250px";
      toast.style.padding = "12px 20px";
      toast.style.borderRadius = "8px";
      toast.style.color = "#fff";
      toast.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.4s ease";

      // Different colors for different types
      if (type === "success") {
        toast.style.backgroundColor = "#4CAF50";
      } else if (type === "error") {
        toast.style.backgroundColor = "#F44336";
      } else if (type === "warning") {
        toast.style.backgroundColor = "#FF9800";
      } else {
        toast.style.backgroundColor = "#333";
      }

      toastContainer.value.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(0)";
      }, 10);

      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        setTimeout(() => {
          toastContainer.value.removeChild(toast);
        }, 400);
      }, 5000);
    };

    const viewRequest = (userId) => {
      const request = requests.value.find((req) => req.userId === userId);
      if (request) {
        viewRequestData.value = { ...request };
        isViewing.value = true;
      } else {
        console.warn("Request not found for userId:", userId);
      }
    };

    const navigateToDetails = (id) => {
      router.push({ name: 'RequestDetail', params: { id } });
    };

    const setupRealtimeListener = () => {
      const unsubscribe = onSnapshot(collection(db, "purchaseRequests"), (snapshot) => {
        const newRequests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        newRequests.forEach(req => {
          const prevStatus = previousStatuses.value[req.id];
          
          // Enhanced debug logging
          console.log('📊 Request data:', {
            id: req.id,
            userEmail: req.userEmail,
            itemName: req.itemName,
            currentStatus: req.status,
            previousStatus: prevStatus
          });
          
          // Only send email if status actually changed and we have a valid email
          if (req.userEmail && 
              req.userEmail.includes('@') && 
              prevStatus && 
              req.status !== prevStatus) {
            
            console.log(`📧 Status changed for ${req.itemName}: ${prevStatus} → ${req.status}`);
            console.log(`📧 Sending email notification to ${req.userEmail} for PR ${req.id}`);
            
            // Send email notification
            sendStatusEmailNotification(req.userEmail, req.id, req.status);
            
            // Show local notification
            showNotification(`Status for "${req.itemName}" updated to ${req.status}`, "success");
          }
          
          // Update previous status
          previousStatuses.value[req.id] = req.status;
        });

        requests.value = newRequests;
      }, (error) => {
        console.error("❌ Firestore listener error:", error);
        showNotification('Database connection error', 'error');
      });

      return unsubscribe;
    };

    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "purchaseRequests"));
        requests.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching requests from Firestore:", error);
      }
    };

    const filteredRequests = computed(() => {
      let filtered = [...requests.value];

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (request) =>
            request.itemName.toLowerCase().includes(query) ||
            request.description.toLowerCase().includes(query)
        );
      }

      if (statusFilter.value !== "all") {
        filtered = filtered.filter(
          (request) => request.status.toLowerCase() === statusFilter.value
        );
      }

      return filtered;
    });

    const closeModal = () => {
      isViewing.value = false;
      viewRequestData.value = {};
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

    onMounted(() => {
      fetchRequests();
      setupRealtimeListener();
    });

    return {
      requests,
      searchQuery,
      statusFilter,
      filteredRequests,
      isViewing,
      viewRequestData,
      viewRequest,
      closeModal,
      formatDate,
      navigateToDetails
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
    linear-gradient(60deg, rgba(0, 0, 0, 0.1) 25%, transparent 25.5%, transparent 75%, rgba(0, 0, 0, 0.1) 75%, rgba(0, 0, 0, 0.1));
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px;
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

.card-header.card-header-flex {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #0f2942 0%, #102a42 100%);
  padding: 30px;
  color: white;
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

.card-content {
  padding: 30px;
}

/* Action Bar */
.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
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
  padding: 10px 15px 10px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.filter-container {
  position: relative;
  width: 180px;
}

.filter-select {
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  appearance: none;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.filter-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

/* Table Design */
.table-container {
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.requests-table {
  width: 100%;
  border-collapse: collapse;
}

.requests-table th,
.requests-table td {
  padding: 14px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.requests-table th {
  background-color: #0f2942;
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.requests-table td {
  color: #2d3748;
  font-size: 14px;
}

.table-row {
  transition: background-color 0.2s;
}

.table-row:hover td {
  background-color: #f8fafc;
}

.description-cell {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions-cell {
  white-space: nowrap;
  display: flex;
  gap: 8px;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-approved {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-pending {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-rejected {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  color: #94a3b8;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: 14px;
  color: #64748b;
}

/* Button Styles */
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: none;
  background-color: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
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
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger:hover {
  background-color: #dc2626;
  transform: translateY(-1px);
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
  max-width: 500px;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  color: #0f2942;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-button:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.detail-row {
  display: flex;
  margin-bottom: 16px;
}

.detail-label {
  width: 140px;
  font-weight: 600;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-value {
  flex: 1;
  color: #1e293b;
}

.detail-value.description {
  white-space: pre-wrap;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
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
  padding: 12px 20px;
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

/* Responsive Adjustments */
@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
  }
  
  .search-container, .filter-container {
    width: 100%;
  }
  
  .detail-row {
    flex-direction: column;
  }
  
  .detail-label {
    margin-bottom: 4px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-actions button {
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