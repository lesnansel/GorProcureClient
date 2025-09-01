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
              <h1 class="title">Invitation to Bid</h1>
              <p class="subtitle">Create and manage invitations to bid for procurement projects.</p>
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
                placeholder="Search invitations..." 
                class="search-input"
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <button @click="showCreateForm = !showCreateForm" class="btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
              {{ showCreateForm ? 'Hide Form' : 'New Invitation' }}
            </button>
          </div>

          <!-- Create Invitation Form -->
          <div v-if="showCreateForm" class="form-container">
            <h3 class="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Create New Invitation
            </h3>
            <form @submit.prevent="createInvitation" class="form" enctype="multipart/form-data">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">ITB Number / Reference Code</label>
                  <input v-model="newInvitation.itbNumber" type="text" class="input-field" placeholder="e.g. ITB-2024-0001" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Procuring Entity</label>
                  <input v-model="newInvitation.procuringEntity" type="text" class="input-field" placeholder="Agency/Department Name" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Project Title</label>
                  <input v-model="newInvitation.projectName" type="text" class="input-field" placeholder="Enter project name" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Approved Budget for the Contract (ABC)</label>
                  <input v-model="newInvitation.abc" type="number" min="0" class="input-field" placeholder="e.g. 1000000" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Contract Duration</label>
                  <input v-model="newInvitation.contractDuration" type="text" class="input-field" placeholder="e.g. 120 calendar days" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Delivery Location</label>
                  <input v-model="newInvitation.deliveryLocation" type="text" class="input-field" placeholder="e.g. Quezon City" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Funding Source</label>
                  <input v-model="newInvitation.fundingSource" type="text" class="input-field" placeholder="e.g. General Appropriations Act" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Document Fee (₱)</label>
                  <input v-model="newInvitation.documentFee" type="number" min="0" class="input-field" placeholder="e.g. 5000" required />
                </div>
                <div class="form-group">
                  <label class="form-label">PR/Reference ID</label>
                  <input v-model="newInvitation.prId" type="text" class="input-field" placeholder="e.g. PR-2024-0012" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Pre-bid Conference Date</label>
                  <input v-model="newInvitation.preBidDate" type="date" class="input-field" />
                </div>
                <div class="form-group">
                  <label class="form-label">Bid Submission Deadline</label>
                  <input v-model="newInvitation.deadline" type="date" class="input-field" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Bid Opening Schedule</label>
                  <input v-model="newInvitation.bidOpeningDate" type="date" class="input-field" />
                </div>
              </div>
              <div class="form-row">
  <div class="form-group">
    <label class="form-label">Timer Duration (days)</label>
    <input
      v-model.number="newInvitation.timerDuration"
      type="number"
      min="1"
      class="input-field"
      placeholder="Enter timer duration in days"
    />
  </div>
</div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Status</label>
                  <select v-model="newInvitation.status" class="input-field" required>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Attach ITB PDF</label>
                  <input type="file" accept="application/pdf" @change="onFileChange($event, 'itbPdf')" class="input-field" />
                </div>
                <div class="form-group">
                  <label class="form-label">Attach Supporting Documents</label>
                  <input type="file" multiple @change="onFileChange($event, 'supportingDocs')" class="input-field" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Requestor Email</label>
                  <input v-model="newInvitation.requestorEmail" type="email" class="input-field" placeholder="Enter requestor's email" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Requestor User ID</label>
                  <input v-model="newInvitation.requestorUserId" type="text" class="input-field" placeholder="Enter requestor's user ID" required />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea v-model="newInvitation.description" class="input-field textarea" placeholder="Enter description" required></textarea>
              </div>
              <div class="form-actions">
                <button type="button" @click="resetForm" class="btn-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                  Reset
                </button>
                <button type="submit" class="btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                  Create Invitation
                </button>
              </div>
            </form>
          </div>

          <!-- Invitations List -->
          <!-- Tab Toggle -->
          <div style="margin-bottom: 24px; display: flex; gap: 12px;">
            <button
              class="btn-primary"
              :class="{ active: !showArchived }"
              @click="showArchived = false"
            >Active Invitations</button>
            <button
              class="btn-secondary"
              :class="{ active: showArchived }"
              @click="showArchived = true"
            >Archived Invitations</button>
          </div>

          <div v-if="!showArchived">
            <div class="section-header">
              <h3 class="section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                Current Invitations
              </h3>
              <div class="status-count">
                <span>Total: {{ filteredInvitations.length }}</span>
              </div>
            </div>

            <div v-if="filteredInvitations.length" class="table-container">
              <table class="invitations-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Deadline</th>
                    <th>Timer</th>
                    <th>Description</th>
                    <th class="actions-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="invitation in filteredInvitations" :key="invitation.id" class="table-row">
                    <td>{{ invitation.projectName }}</td>
                    <td>
                      <span class="deadline-badge" :class="isDeadlineSoon(invitation.deadline) ? 'deadline-soon' : ''">
                        {{ formatDate(invitation.deadline) }}
                      </span>
                    </td>
                    <td>
                        {{ invitation.expiresAt ? getTimeLeft(invitation.expiresAt) : 'No timer' }}
                    </td>
                    <td class="description-cell">{{ invitation.description }}</td>
                    <td>
                      <div class="actions-container">
                        <button @click="openModal('edit', invitation)" class="action-btn edit" title="Edit Invitation">
                          ✏️
                        </button>
                        <button @click="openModal('delete', invitation)" class="action-btn delete" title="Delete Invitation">
                          🗑️
                        </button>
                        <button @click="openModal('view', invitation)" class="action-btn view" title="View Details">
                          👁️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
                <path d="M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2h-4a2 2 0 0 0-2 2v-7"></path>
                <path d="M8 6h3a1 1 0 0 1 1 1v9"></path>
                <path d="M8 22h4a2 2 0 0 0 2-2v-7"></path>
                <path d="M2 19h5"></path>
                <path d="M18 5V3c0-.6-.4-1-1-1h-4a1 1 0 0 0-1 1v2"></path>
                <path d="M10 5V3c0-.6-.4-1-1-1H5a1 1 0 0 0-1 1v2"></path>
              </svg>
              <p class="empty-text">No invitations available.</p>
              <p class="empty-subtext">Create your first invitation to get started.</p>
            </div>
          </div>

          <!-- Archived Invitations Table -->
          <div v-else>
            <div class="section-header">
              <h3 class="section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                </svg>
                Archived Invitations
              </h3>
              <div class="status-count">
                <span>Total: {{ archivedInvitations.length }}</span>
              </div>
            </div>
            <div v-if="archivedInvitations.length" class="table-container">
              <table class="invitations-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Deadline</th>
                    <th>Archived On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="invitation in archivedInvitations" :key="invitation.id">
                    <td>{{ invitation.projectName }}</td>
                    <td>{{ formatDate(invitation.deadline) }}</td>
                    <td>{{ formatDate(invitation.expiresAt) }}</td>
                    <td>
                      <button @click="openRestoreModal(invitation)" class="btn-primary">
                        Restore & Set Timer
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="empty-state">
              <p class="empty-text">No archived invitations found.</p>
            </div>
          </div>

          <!-- Restore Modal -->
          <div v-if="modal.restore" class="modal-backdrop">
            <div class="modal-content">
              <h2>Restore & Set Timer</h2>
              <p>
                Set a new timer (in minutes) for <strong>{{ selectedInvitation.projectName }}</strong>.<br>
                It will be restored to active invitations.
              </p>
              <input
                type="number"
                min="1"
                v-model.number="restoreTimerMinutes"
                placeholder="Timer duration (minutes)"
                class="input-field"
                style="margin-bottom: 16px;"
              />
              <div class="modal-actions">
                <button class="btn-primary" @click="restoreInvitationWithTimer">Restore</button>
                <button class="btn-secondary" @click="closeModals">Cancel</button>
              </div>
            </div>
          </div>

          <!-- View Invitation Modal -->
          <div v-if="modal.view" class="modal-backdrop">
            <div class="modal-content view-modal">
              <h2 class="section-title">📄 View Invitation</h2>
              <ul class="invitation-details">
                <li><strong>ITB Number:</strong> {{ selectedInvitation.itbNumber }}</li>
                <li><strong>Procuring Entity:</strong> {{ selectedInvitation.procuringEntity }}</li>
                <li><strong>Project Title:</strong> {{ selectedInvitation.projectName }}</li>
                <li><strong>ABC:</strong> ₱{{ selectedInvitation.abc }}</li>
                <li><strong>Contract Duration:</strong> {{ selectedInvitation.contractDuration }}</li>
                <li><strong>Delivery Location:</strong> {{ selectedInvitation.deliveryLocation }}</li>
                <li><strong>Funding Source:</strong> {{ selectedInvitation.fundingSource }}</li>
                <li><strong>Document Fee:</strong> ₱{{ selectedInvitation.documentFee }}</li>
                <li><strong>PR/Reference ID:</strong> {{ selectedInvitation.prId }}</li>
                <li><strong>Pre-bid Conference Date:</strong> {{ formatDate(selectedInvitation.preBidDate) }}</li>
                <li><strong>Bid Submission Deadline:</strong> {{ formatDate(selectedInvitation.deadline) }}</li>
                <li><strong>Bid Opening Date:</strong> {{ formatDate(selectedInvitation.bidOpeningDate) }}</li>
                <li><strong>Status:</strong> {{ selectedInvitation.status }}</li>
                <li><strong>Description:</strong> {{ selectedInvitation.description }}</li>
              </ul>
              <button @click="closeModals" class="btn-secondary mt-4">Close</button>
            </div>
          </div>

          <!-- Edit Invitation Modal -->
          <div v-if="modal.edit" class="modal-backdrop">
            <div class="modal-content form-container">
              <h2 class="section-title">✏️ Edit Invitation</h2>
              <form @submit.prevent="updateInvitationModal" class="form">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">ITB Number / Reference Code</label>
                    <input v-model="selectedInvitation.itbNumber" type="text" class="input-field" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Procuring Entity</label>
                    <input v-model="selectedInvitation.procuringEntity" type="text" class="input-field" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Project Title</label>
                    <input v-model="selectedInvitation.projectName" type="text" class="input-field" required />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">ABC</label>
                    <input v-model="selectedInvitation.abc" type="number" min="0" class="input-field" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Contract Duration</label>
                    <input v-model="selectedInvitation.contractDuration" type="text" class="input-field" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Delivery Location</label>
                    <input v-model="selectedInvitation.deliveryLocation" type="text" class="input-field" required />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Funding Source</label>
                    <input v-model="selectedInvitation.fundingSource" type="text" class="input-field" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Document Fee (₱)</label>
                    <input v-model="selectedInvitation.documentFee" type="number" min="0" class="input-field" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">PR/Reference ID</label>
                    <input v-model="selectedInvitation.prId" type="text" class="input-field" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Pre-bid Conference Date</label>
                    <input v-model="selectedInvitation.preBidDate" type="date" class="input-field" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Bid Submission Deadline</label>
                    <input v-model="selectedInvitation.deadline" type="date" class="input-field" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Bid Opening Schedule</label>
                    <input v-model="selectedInvitation.bidOpeningDate" type="date" class="input-field" />
                  </div>
                </div>

                <!-- ✅ NEW TIMER FIELD -->
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Timer Duration (days)</label>
                    <input
                      v-model.number="selectedInvitation.timerDuration"
                      type="number"
                      min="1"
                      class="input-field"
                      placeholder="Enter timer duration"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Status</label>
                    <select v-model="selectedInvitation.status" class="input-field" required>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Requestor Email</label>
                    <input v-model="selectedInvitation.requestorEmail" type="email" class="input-field" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Requestor User ID</label>
                    <input v-model="selectedInvitation.requestorUserId" type="text" class="input-field" required />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea v-model="selectedInvitation.description" class="input-field textarea" required></textarea>
                  </div>
                </div>

                <div class="form-actions">
                  <button type="button" @click="closeModals" class="btn-secondary">Cancel</button>
                  <button type="submit" class="btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>


          <!-- Delete Confirmation Modal -->
          <div v-if="modal.delete" class="modal-backdrop">
            <div class="modal-content">
              <h2>🗑️ Confirm Deletion</h2>
              <p>Are you sure you want to delete <strong>{{ selectedInvitation.projectName }}</strong>?</p>
              <button @click="deleteInvitationModal">Yes, Delete</button>
              <button @click="closeModals">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminNavigationBar from './AdminNavigationBar.vue';
import { ref, onMounted, computed } from "vue";
import { db, storage } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

export default {
  components: { AdminNavigationBar },
  setup() {
    const invitations = ref([]);
    const newInvitation = ref({
      itbNumber: "",
      procuringEntity: "",
      projectName: "",
      abc: "",
      contractDuration: "",
      deliveryLocation: "",
      fundingSource: "",
      documentFee: "",
      prId: "",
      preBidDate: "",
      deadline: "",
      bidOpeningDate: "",
      status: "draft", // Invitation status
      description: "",
      itbPdfUrl: "",
      supportingDocsUrls: [],
      timerDuration: "",
      expiresAt: "",
      requestorEmail: "",
      requestorUserId: "",
      prStatus: "pending", // PR status
    });

    const itbPdfFile = ref(null);
    const supportingDocsFiles = ref([]);
    const showCreateForm = ref(false);
    const searchQuery = ref("");

    const showArchived = ref(false);
    const restoreTimerMinutes = ref(60);

    const modal = ref({
      view: false,
      edit: false,
      delete: false,
      restore: false
    });
    const selectedInvitation = ref({});

    const openModal = (type, invitation) => {
      selectedInvitation.value = { ...invitation };
      modal.value.view = false;
      modal.value.edit = false;
      modal.value.delete = false;
      modal.value[type] = true;
    };

    const closeModals = () => {
      modal.value.view = false;
      modal.value.edit = false;
      modal.value.delete = false;
      modal.value.restore = false;
    };

    const createInvitation = async () => {
      try {
        let itbPdfUrl = "";
        let supportingDocsUrls = [];

        if (itbPdfFile.value) {
          const pdfRef = storageRef(storage, `itb_pdfs/${Date.now()}_${itbPdfFile.value.name}`);
          await uploadBytes(pdfRef, itbPdfFile.value);
          itbPdfUrl = await getDownloadURL(pdfRef);
        }

        if (supportingDocsFiles.value.length) {
          for (const file of supportingDocsFiles.value) {
            const docRef = storageRef(storage, `itb_supporting_docs/${Date.now()}_${file.name}`);
            await uploadBytes(docRef, file);
            const url = await getDownloadURL(docRef);
            supportingDocsUrls.push(url);
          }
        }

        let expiresAt = null;
        if (newInvitation.value.timerDuration && !isNaN(newInvitation.value.timerDuration)) {
          const future = new Date();
          future.setDate(future.getDate() + Number(newInvitation.value.timerDuration));
          expiresAt = future.toISOString();
        }

        await addDoc(collection(db, "invitations"), {
          ...newInvitation.value,
          itbPdfUrl,
          supportingDocsUrls,
          expiresAt,
        });

        await sendEmailNotification({
          to: newInvitation.value.requestorEmail,
          userId: newInvitation.value.requestorUserId,
          subject: "New Invitation to Bid Created",
          message: `Your ITB (${newInvitation.value.projectName}) has been created.`
        });

        showNotification("Invitation created successfully!");
        resetForm();
        showCreateForm.value = false;
        fetchInvitations();
      } catch (error) {
        showNotification("Failed to create invitation", "error");
      }
    };

    const archivedInvitations = computed(() =>
      invitations.value.filter(inv => inv.archived === true)
    );
    const filteredInvitations = computed(() => {
      const q = searchQuery.value.toLowerCase();
      return invitations.value.filter(inv =>
        inv.archived !== true &&
        (inv.projectName.toLowerCase().includes(q) || inv.description.toLowerCase().includes(q))
      );
    });

    const fetchInvitations = async () => {
      try {
        const snapshot = await getDocs(collection(db, "invitations"));
        const now = new Date();
        const updates = [];

        invitations.value = snapshot.docs.map(docSnap => {
          const data = { id: docSnap.id, ...docSnap.data() };
          if (data.expiresAt && new Date(data.expiresAt) < now && !data.archived) {
            const ref = doc(db, "invitations", data.id);
            updates.push(updateDoc(ref, { archived: true }));
            data.archived = true;
          }
          return data;
        });

        await Promise.all(updates);
      } catch (error) {
        showNotification("Failed to fetch invitations", "error");
      }
    };

    const updateInvitationModal = async () => {
      if (!selectedInvitation.value.id) return;

      try {
        const updateData = { ...selectedInvitation.value };

        if (updateData.timerDuration && !isNaN(updateData.timerDuration)) {
          const future = new Date();
          future.setDate(future.getDate() + Number(updateData.timerDuration));
          updateData.expiresAt = future.toISOString();
        } else {
          updateData.expiresAt = null;
        }

        // Get previous data for change detection
        const invitationRef = doc(db, "invitations", selectedInvitation.value.id);
        const prevSnapshot = await getDoc(invitationRef);
        const prevData = prevSnapshot.exists() ? prevSnapshot.data() : {};

        const prevPrStatus = prevData.prStatus;
        const newPrStatus = updateData.prStatus;

        delete updateData.id;

        await updateDoc(invitationRef, updateData);

        // General update email
        await sendEmailNotification({
          to: selectedInvitation.value.requestorEmail,
          userId: selectedInvitation.value.requestorUserId,
          subject: "Invitation to Bid Updated",
          message: `Your ITB (${selectedInvitation.value.projectName}) has been updated.`
        });

        // Detect PR status change
        if (prevPrStatus !== undefined && newPrStatus !== undefined && prevPrStatus !== newPrStatus) {
          await notifyPRStatus(
            selectedInvitation.value.requestorEmail,
            selectedInvitation.value.prId,
            newPrStatus
          );
        }

        showNotification("Invitation updated successfully!");
        closeModals();
        fetchInvitations();
      } catch (error) {
        showNotification("Failed to update invitation", "error");
      }
    };

    const deleteInvitationModal = async () => {
      if (!selectedInvitation.value.id) return;
      try {
        await deleteDoc(doc(db, "invitations", selectedInvitation.value.id));
        showNotification("Invitation deleted successfully!");
        closeModals();
        fetchInvitations();
      } catch (error) {
        showNotification("Failed to delete invitation", "error");
      }
    };

    const openRestoreModal = (invitation) => {
      selectedInvitation.value = { ...invitation };
      restoreTimerMinutes.value = 60;
      modal.value.restore = true;
    };

    const restoreInvitationWithTimer = async () => {
      if (!selectedInvitation.value.id || !restoreTimerMinutes.value) return;
      try {
        const expiresAt = new Date(Date.now() + restoreTimerMinutes.value * 60 * 1000).toISOString();
        const invitationRef = doc(db, "invitations", selectedInvitation.value.id);
        await updateDoc(invitationRef, {
          archived: false,
          expiresAt,
          timerDuration: restoreTimerMinutes.value
        });
        showNotification("Invitation restored!");
        closeModals();
        fetchInvitations();
      } catch (error) {
        showNotification("Failed to restore invitation", "error");
      }
    };

    const resetForm = () => {
      newInvitation.value = {
        itbNumber: "",
        procuringEntity: "",
        projectName: "",
        abc: "",
        contractDuration: "",
        deliveryLocation: "",
        fundingSource: "",
        documentFee: "",
        prId: "",
        preBidDate: "",
        deadline: "",
        bidOpeningDate: "",
        status: "draft",
        description: "",
        itbPdfUrl: "",
        supportingDocsUrls: [],
        timerDuration: "",
        expiresAt: "",
        requestorEmail: "",
        requestorUserId: "",
        prStatus: "pending",
      };
      itbPdfFile.value = null;
      supportingDocsFiles.value = [];
    };

    const onFileChange = (e, type) => {
      if (type === "itbPdf") {
        itbPdfFile.value = e.target.files[0] || null;
      } else if (type === "supportingDocs") {
        supportingDocsFiles.value = Array.from(e.target.files);
      }
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const isDeadlineSoon = (dateStr) => {
      if (!dateStr) return false;
      const deadline = new Date(dateStr);
      const now = new Date();
      const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0;
    };

    const showNotification = (msg, type = "success") => {
      const el = document.createElement("div");
      el.className = `notification ${type}`;
      el.textContent = msg;
      document.body.appendChild(el);
      setTimeout(() => el.classList.add("show"), 10);
      setTimeout(() => {
        el.classList.remove("show");
        setTimeout(() => document.body.removeChild(el), 300);
      }, 3000);
    };

    const getTimeLeft = (expiresAt) => {
      if (!expiresAt) return "No timer";
      const now = new Date();
      const end = new Date(expiresAt);
      const diff = end - now;
      if (diff <= 0) return "Expired";
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      return `${days}d ${hours}h ${minutes}m`;
    };

    const sendEmailNotification = async (payload) => {
      try {
        await fetch('http://localhost:3000/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        showNotification('Email notification sent!');
      } catch (error) {
        showNotification('Failed to send email', 'error');
      }
    };

    const notifyPRStatus = async (email, prNumber, newStatus) => {
      await fetch('http://localhost:5000/send-pr-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, prNumber, newStatus })
      });
    };

    onMounted(fetchInvitations);

    return {
      invitations,
      newInvitation,
      itbPdfFile,
      supportingDocsFiles,
      showCreateForm,
      createInvitation,
      resetForm,
      onFileChange,
      formatDate,
      isDeadlineSoon,
      getTimeLeft,
      searchQuery,
      filteredInvitations,
      modal,
      selectedInvitation,
      openModal,
      closeModals,
      updateInvitationModal,
      deleteInvitationModal,
      showArchived,
      archivedInvitations,
      openRestoreModal,
      restoreTimerMinutes,
      restoreInvitationWithTimer,
      sendEmailNotification,
      notifyPRStatus
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

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 30px;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #0d3c61;
}

.status-count {
  font-size: 14px;
  color: #64748b;
}

/* Form Container */
.form-container {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid #e2e8f0;
  animation: fadeIn 0.3s ease-out;
}

/* Form Styling */
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.form-group {
  flex: 1 1 100%;
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
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
  background-color: white;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

/* Table Design */
.table-container {
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.invitations-table {
  width: 100%;
  border-collapse: collapse;
}

.invitations-table th,
.invitations-table td {
  padding: 14px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.invitations-table th {
  background-color: #0f2942;
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.actions-header {
  text-align: center;
  width: 150px;
}

.invitations-table td {
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

/* Actions Container */
.actions-container {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.action-buttons { 
  display: flex;
  gap: 8px;
  background-color: #0f2942;
  border-radius: 8px;
  padding: 4px;
}

.action-btn {
  padding: 6px 8px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  background-color: #f3f3f3;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.action-btn:hover {
  background-color: #e0e0e0;
}

.action-btn.edit { color: #007bff; }
.action-btn.delete { color: #dc3545; }
.action-btn.view { color: #28a745; }

/* Deadline Badge */
.deadline-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  background-color: #f1f5f9;
  color: #475569;
}

.deadline-soon {
  color: #ef4444;
  font-weight: 600;
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
  z-index: 9999 !important;
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

.delete-modal {
  max-width: 400px;
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-modal {
  max-height: 80vh;
  overflow-y: auto;
  padding: 2rem 3rem;
  border-radius: 12px;
  background-color: #ffffff;
  color: #1a1a1a;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 600px;
  text-align: left;
}

.invitation-details {
  list-style: none;
  padding: 0;
  margin: 0;
}

.invitation-details li {
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #2c3e50;
}

.invitation-details li strong {
  display: inline-block;
  width: 180px;
  color: #0d3c61;
  font-weight: 600;
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

.delete-message {
  color: #1e293b;
  font-size: 16px;
  text-align: center;
  margin: 10px 0;
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

  .form-group {
    flex: 1 1 calc(33.333% - 1rem); /* three per row */
  }
  
  .search-container {
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

.detail-group {
  margin-bottom: 24px;
}
.detail-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #edf2f7;
}
.detail-row {
  display: flex;
  margin-bottom: 8px;
}
.detail-label {
  width: 140px;
  font-weight: 500;
  color: #4a5568;
  flex-shrink: 0;
}
.detail-value {
  color: #2d3748;
  flex: 1;
}
.detail-value.description {
  white-space: pre-wrap;
}
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.main-content {
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

.main-content.collapsed {
  margin-left: 0;
}

/* Modal Backdrop and Content (for new modals) */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  padding: 2rem;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  font-size: 1rem;
  padding: 0.75rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  box-sizing: border-box;
  margin-bottom: 0.75rem;
  background: #f8fafc;
  color: #1e293b;
  resize: none;
}

.modal-content textarea {
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
}

.modal-content button {
  font-size: 1rem;
  padding: 0.6rem 1.2rem;
  margin-top: 0.25rem;
}

.modal-content h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #0f2942;
  font-weight: 600;
  word-break: break-word;
}

.modal-content p,
.modal-content label {
  font-size: 1rem;
  color: #1e293b;
  word-break: break-word;
  margin-bottom: 0.5rem;
}

</style>