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
              <h1 class="title">Post Qualification</h1>
              <p class="subtitle">Evaluate and manage post-qualification processes</p>
            </div>
          </div>
          
          <!-- Stats Overview -->
          <div class="stats-overview">
            <div class="stat-item">
              <div class="stat-value">{{ postQualifications.length }}</div>
              <div class="stat-label">Total Records</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ averageScore }}</div>
              <div class="stat-label">Avg. Score</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ highestScore }}</div>
              <div class="stat-label">Highest</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ lowestScore }}</div>
              <div class="stat-label">Lowest</div>
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
                placeholder="Search by supplier name..." 
                class="search-input"
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <div class="filter-container">
              <select v-model="scoreFilter" class="filter-select">
                <option value="all">All Scores</option>
                <option value="high">High (&gt;80)</option> <!-- Escaped '>' as '&gt;' -->
                <option value="medium">Medium (50-80)</option>
                <option value="low">Low (&lt;50)</option> <!-- Escaped '<' as '&lt;' -->
              </select>
            </div>
            <button @click="navigateToAddQualification" class="btn-add">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add New
            </button>
          </div>

          <!-- Post Qualification List -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="loading-icon"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
            </div>
            <p>Loading post-qualification records...</p>
          </div>
          
          <div v-else-if="filteredQualifications.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><path d="M9 11h6"></path><path d="M9 15h6"></path><path d="M14.5 4h-5L7 7H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-3l-2.5-3z"></path></svg>
            <p class="empty-text">No post-qualification records available.</p>
            <p class="empty-subtext">Add a new record to get started.</p>
          </div>
          
          <div v-else class="qualifications-grid">
            <div v-for="qualification in filteredQualifications" :key="qualification.id" class="qualification-card" :class="getScoreClass(qualification.evaluationScore)">
              <div class="qualification-header">
                <div class="qualification-title">{{ qualification.supplierName }}</div>
                <div class="score-badge" :class="getScoreClass(qualification.evaluationScore)">
                  <div class="score-value">{{ qualification.evaluationScore }}</div>
                </div>
              </div>
              
              <div class="qualification-body">
                <div class="qualification-remarks">
                  <div class="remarks-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
                    Remarks
                  </div>
                  <div class="remarks-content">{{ qualification.remarks }}</div>
                </div>
                
                <div class="qualification-date" v-if="qualification.createdAt">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span>{{ formatDate(qualification.createdAt) }}</span>
                </div>
              </div>
              
              <div class="qualification-actions">
                <button @click="navigateToQualificationDetails(qualification.id)" class="card-action-btn view">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  Details
                </button>
                <button @click="navigateToEditQualification(qualification.id)" class="card-action-btn edit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  Edit
                </button>
                <button @click="confirmDelete(qualification)" class="card-action-btn delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Modal -->
      <div v-if="isViewingDetails" class="modal-overlay" @click.self="closeViewModal">
        <div class="modal modal-md">
          <div class="modal-header">
            <h3 class="modal-title">Post-Qualification Details</h3>
            <button class="close-button" @click="closeViewModal">&times;</button>
          </div>
          <div class="modal-body qualification-details">
            <div class="detail-row"><span class="detail-label">Supplier:</span><span class="detail-value">{{ activeQualification.supplierName }}</span></div>
            <div class="detail-row"><span class="detail-label">Score:</span><span class="detail-value">{{ activeQualification.evaluationScore }}</span></div>
            <div class="detail-row"><span class="detail-label">Remarks:</span><span class="detail-value">{{ activeQualification.remarks }}</span></div>
            <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">{{ formatDate(activeQualification.evaluationDate) }}</span></div>
            <div class="detail-row"><span class="detail-label">Evaluator:</span><span class="detail-value">{{ activeQualification.evaluator }}</span></div>
            <div class="detail-row" v-if="activeQualification.fileUrl"><span class="detail-label">Report:</span><span class="detail-value"><a :href="activeQualification.fileUrl" target="_blank" class="document-link">View File</a></span></div>
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" @click="closeViewModal">Close</button>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal modal-md">
          <div class="modal-header">
            <h3 class="modal-title">{{ editMode ? 'Edit' : 'Add' }} Post-Qualification</h3>
            <button class="close-button" @click="closeModal">&times;</button>
          </div>
          <form @submit.prevent="submitPostQualification" class="modal-body">
            <div class="form-group">
              <label class="form-label">Supplier Name</label>
              <input v-model="postQualification.supplierName" class="input-field" required />
            </div>
            <div class="form-group">
              <label class="form-label">Score</label>
              <input v-model.number="postQualification.evaluationScore" type="number" min="0" max="100" class="input-field" required />
            </div>
            <div class="form-group">
              <label class="form-label">Remarks</label>
              <textarea v-model="postQualification.remarks" class="input-field textarea" rows="4"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Date</label>
              <input v-model="postQualification.evaluationDate" type="date" class="input-field" required />
            </div>
            <div class="form-group">
              <label class="form-label">Evaluator</label>
              <input v-model="postQualification.evaluator" class="input-field" required />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="closeModal">Cancel</button>
              <button type="submit" class="btn-primary">{{ editMode ? 'Update' : 'Submit' }}</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="isConfirmingDelete" class="modal-overlay" @click.self="cancelDelete">
        <div class="modal modal-sm">
          <div class="modal-header">
            <h3 class="modal-title">Delete Confirmation</h3>
            <button class="close-button" @click="cancelDelete">&times;</button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this qualification?</p>
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" @click="cancelDelete">Cancel</button>
            <button class="btn-delete" @click="deleteQualification">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminNavigationBar from './AdminNavigationBar.vue';
import { ref, computed, onMounted } from "vue";
import { db, storage } from "@/firebase";
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from 'vue-router';
import { getAuth } from "firebase/auth";

export default {
  components: {
    AdminNavigationBar,
  },
  setup() {
    const postQualifications = ref([]);
    const loading = ref(true);
    const isModalOpen = ref(false);
    const isViewingDetails = ref(false);
    const isConfirmingDelete = ref(false);
    const editMode = ref(false);
    const searchQuery = ref("");
    const scoreFilter = ref("all");
    const fileName = ref("");
    const selectedFile = ref(null);
    const pqFileName = ref("");
    const pqFile = ref(null);
    const pqFileURL = ref("");
    const postQualificationChecklist = ref({
      mayorsPermit: false,
      taxClearance: false,
      philgeps: false,
      auditedFs: false,
      technicalSpec: false,
      siteVisit: false,
    });
    const decisionModal = ref({ show: false, status: "" });
    
    const activeQualification = ref({});
    const postQualification = ref({
      supplierName: "",
      evaluationScore: 50,
      remarks: "",
      evaluationDate: new Date().toISOString().split('T')[0],
      evaluator: "",
    });

    // Computed values for stats
    const averageScore = computed(() => {
      if (postQualifications.value.length === 0) return 0;
      const total = postQualifications.value.reduce(
        (sum, qual) => sum + Number(qual.evaluationScore || 0), 0
      );
      return Math.round(total / postQualifications.value.length);
    });
    
    const highestScore = computed(() => {
      if (postQualifications.value.length === 0) return 0;
      return Math.max(...postQualifications.value.map(qual => Number(qual.evaluationScore || 0)));
    });
    
    const lowestScore = computed(() => {
      if (postQualifications.value.length === 0) return 0;
      return Math.min(...postQualifications.value.map(qual => Number(qual.evaluationScore || 0)));
    });

    const filteredQualifications = computed(() => {
      let result = [...postQualifications.value];
      
      // Apply score filter
      if (scoreFilter.value !== "all") {
        if (scoreFilter.value === "high") {
          result = result.filter(qual => Number(qual.evaluationScore) > 80);
        } else if (scoreFilter.value === "medium") {
          result = result.filter(qual => Number(qual.evaluationScore) >= 50 && Number(qual.evaluationScore) <= 80);
        } else if (scoreFilter.value === "low") {
          result = result.filter(qual => Number(qual.evaluationScore) < 50);
        }
      }
      
      // Apply search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(qual => 
          qual.supplierName.toLowerCase().includes(query) ||
          qual.evaluator?.toLowerCase().includes(query) ||
          qual.remarks.toLowerCase().includes(query)
        );
      }
      
      return result;
    });

    const fetchPostQualifications = async () => {
      try {
        loading.value = true;

        // Update collection name to match Firestore
        const unsubscribe = onSnapshot(collection(db, "qualifications"), (snapshot) => {
          postQualifications.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          loading.value = false;
        });

        // Return unsubscribe function for cleanup
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching post-qualifications:", error);
        showNotification("Failed to fetch records. Please try again.", "error");
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

    const viewDetails = (qualification) => {
      console.log("View Details clicked:", qualification); // Debugging log
      activeQualification.value = { ...qualification }; // Set the active qualification
      isViewingDetails.value = true; // Open the details modal
    };

    const closeViewModal = () => {
      isViewingDetails.value = false;
    };

    const resetForm = () => {
      postQualification.value = {
        supplierName: "",
        evaluationScore: 50,
        remarks: "",
        evaluationDate: new Date().toISOString().split('T')[0],
        evaluator: "",
      };
      fileName.value = "";
      selectedFile.value = null;
    };

    const editQualification = (qualification) => {
      console.log("Edit clicked:", qualification); // Debugging log
      editMode.value = true; // Set edit mode
      postQualification.value = { ...qualification }; // Populate the form with the qualification data
      isModalOpen.value = true; // Open the edit modal
    };

    const submitPostQualification = async () => {
      try {
        if (editMode.value) {
          // Update existing record
          const docRef = doc(db, "qualifications", postQualification.value.id);
          await updateDoc(docRef, {
            ...postQualification.value,
            updatedAt: serverTimestamp()
          });
          showNotification("Post-qualification updated successfully!");
        } else {
          // Add new record
          await addDoc(collection(db, "qualifications"), {
            ...postQualification.value,
            createdAt: serverTimestamp()
          });
          showNotification("Post-qualification added successfully!");
        }
        
        closeModal();
      } catch (error) {
        console.error("Error saving post-qualification:", error);
        showNotification("Failed to save record. Please try again.", "error");
      }
    };

    const confirmDelete = (qualification) => {
      activeQualification.value = qualification;
      isConfirmingDelete.value = true;
    };

    const cancelDelete = () => {
      isConfirmingDelete.value = false;
    };

    const deleteQualification = async () => {
      try {
        const docRef = doc(db, "qualifications", activeQualification.value.id);
        await deleteDoc(docRef);
        showNotification("Post-qualification deleted successfully!", "success");
        isConfirmingDelete.value = false;
        // Remove from local list immediately for UI feedback
        postQualifications.value = postQualifications.value.filter(q => q.id !== activeQualification.value.id);
      } catch (error) {
        showNotification("Failed to delete record. Please try again.", "error");
      }
    };

    // File upload for PQ report
    const handlePQFileUpload = async (event) => {
      const file = event.target.files[0];
      if (file) {
        pqFile.value = file;
        pqFileName.value = file.name;
        // Upload to Firebase Storage
        const storagePath = `postQualificationReports/${Date.now()}_${file.name}`;
        const fileRef = storageRef(storage, storagePath);
        await uploadBytes(fileRef, file);
        pqFileURL.value = await getDownloadURL(fileRef);
      }
    };

    // Show decision modal
    const showDecisionModal = (status) => {
      decisionModal.value.status = status;
      decisionModal.value.show = true;
    };

    // Save decision to Firestore (with audit trail)
    const saveDecision = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        // Save/update post-qualification record with checklist, file, and metadata
        const docRef = editMode.value
          ? doc(db, "postQualifications", postQualification.value.id)
          : await addDoc(collection(db, "postQualifications"), {});
        const dataToSave = {
          ...postQualification.value,
          checklist: { ...postQualificationChecklist.value },
          pqReportURL: pqFileURL.value || "",
          status: decisionModal.value.status,
          remarks: postQualification.value.remarks,
          evaluatedBy: user ? user.uid : "Unknown",
          evaluatedAt: serverTimestamp(),
        };
        await updateDoc(docRef, dataToSave);

        // Audit trail (subcollection)
        await addDoc(collection(docRef, "postQualHistory"), {
          ...dataToSave,
          action: decisionModal.value.status,
          timestamp: serverTimestamp(),
        });

        showNotification(`Supplier marked as ${decisionModal.value.status}!`);
        decisionModal.value.show = false;
        closeModal();
      } catch (error) {
        showNotification("Failed to save decision.", "error");
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

    const getScoreClass = (score) => {
      const numericScore = Number(score);
      if (numericScore > 80) return "high-score";
      if (numericScore >= 50) return "medium-score";
      return "low-score";
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

    const router = useRouter();

    const navigateToAddQualification = () => {
      router.push({ name: 'AddQualification' });
    };

    const navigateToEditQualification = (id) => {
      router.push({ name: 'EditQualification', params: { id } });
    };

    // Replace the old viewDetails with navigation
    const navigateToQualificationDetails = (id) => {
      router.push({ name: 'QualificationDetails', params: { id } });
    };

    onMounted(fetchPostQualifications);

    return {
      postQualifications,
      loading,
      isModalOpen,
      isViewingDetails,
      isConfirmingDelete,
      editMode,
      searchQuery,
      scoreFilter,
      postQualification,
      activeQualification,
      fileName,
      pqFileName,
      pqFileURL,
      postQualificationChecklist,
      averageScore,
      highestScore,
      lowestScore,
      filteredQualifications,
      showAddModal,
      closeModal,
      viewDetails,
      closeViewModal,
      editQualification,
      submitPostQualification,
      confirmDelete,
      cancelDelete,
      deleteQualification,
      handlePQFileUpload,
      showDecisionModal,
      decisionModal,
      saveDecision,
      handleFileUpload,
      formatDate,
      getScoreClass,
      navigateToAddQualification,
      navigateToEditQualification,
      navigateToQualificationDetails
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

/* Qualification Cards Grid */
.qualifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.qualification-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
}

.qualification-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.qualification-card.high-score {
  border-top: 3px solid #10b981;
}

.qualification-card.medium-score {
  border-top: 3px solid #fbbf24;
}

.qualification-card.low-score {
  border-top: 3px solid #ef4444;
}

.qualification-header {
  padding: 15px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.qualification-title {
  font-weight: 600;
  color: #0f2942;
  font-size: 1.1rem;
}

.score-badge {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.score-badge.high-score {
  background-color: #d1fae5;
  color: #065f46;
}

.score-badge.medium-score {
  background-color: #fef3c7;
  color: #92400e;
}

.score-badge.low-score {
  background-color: #fee2e2;
  color: #b91c1c;
}

.qualification-body {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.qualification-remarks {
  font-size: 0.9rem;
  color: #334155;
}

.remarks-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 5px;
}

.remarks-content {
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3; /* Add this for compatibility */
  -webkit-box-orient: vertical;
}

.qualification-date {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.9rem;
  margin-top: auto;
}

.qualification-actions {
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

/* Score Slider */
.score-input-container {
  display: flex;
  align-items: center;
  gap: 20px;
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

/* Qualification Details */
.qualification-details {
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

.score-pill {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.high-score {
  background-color: #d1fae5;
  color: #065f46;
}

.medium-score {
  background-color: #fef3c7;
  color: #92400e;
}

.low-score {
  background-color: #fee2e2;
  color: #b91c1c;
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

  .qualifications-grid {
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

.post-qualification-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
}
.pq-item-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  margin-bottom: 32px;
  padding: 24px 20px;
}
.pq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.pq-bidder {
  font-size: 1.2rem;
  font-weight: 700;
}
.pq-status-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.95rem;
  font-weight: 600;
  background: #f1f5f9;
  color: #64748b;
}
.status-post-qualified {
  background: #d1fae5;
  color: #065f46;
}
.status-disqualified {
  background: #fee2e2;
  color: #b91c1c;
}
.pq-checklist {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 32px;
  margin-bottom: 16px;
}
.pq-checklist label {
  font-size: 1rem;
  font-weight: 500;
}
.pq-docs {
  margin-bottom: 12px;
}
.pq-scores {
  margin-bottom: 12px;
}
.pq-meta {
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 10px;
}
.pq-remarks-box {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.pq-remarks-box:hover {
  box-shadow: 0 2px 8px rgba(59,130,246,0.08);
}
.pq-audit-trail {
  background: #f1f5f9;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.95rem;
}
.pq-audit-trail h4 {
  margin: 0 0 6px 0;
  font-size: 1.05rem;
  font-weight: 700;
}
</style>