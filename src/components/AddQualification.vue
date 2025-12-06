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
          <div class="header-text">
            <h1 class="title">Add Qualification</h1>
            <p class="subtitle">Add and manage supplier qualifications</p>
          </div>
        </div>
      </div>

      <div class="card-content">
        <!-- Add Qualification Form -->
        <form @submit.prevent="submitQualification" class="form">
          <div class="form-group">
            <label class="form-label">Supplier Name</label>
            <input 
              v-model="qualification.supplierName" 
              type="text" 
              class="input-field" 
              placeholder="Enter supplier name" 
              required 
            />
          </div>

          <div class="form-group">
            <label class="form-label">Evaluation Score</label>
            <div class="score-container">
              <div class="score-input-wrapper">
                <input 
                  v-model="qualification.evaluationScore" 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="1" 
                  class="score-slider" 
                  required 
                />
                <div class="score-markers">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>
              <div class="score-display">
                <span class="score-value">{{ qualification.evaluationScore }}</span>
                <span class="score-unit">/100</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Remarks</label>
            <textarea 
              v-model="qualification.remarks" 
              class="input-field textarea" 
              placeholder="Enter evaluation remarks and comments..." 
              rows="4"
              required
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Evaluation Date</label>
              <input 
                v-model="qualification.evaluationDate" 
                type="date" 
                class="input-field" 
                required 
              />
            </div>

            <div class="form-group">
              <label class="form-label">Evaluator</label>
              <input 
                v-model="qualification.evaluator" 
                type="text" 
                class="input-field" 
                placeholder="Enter evaluator name" 
                required 
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Supporting Document</label>
            <div class="file-upload-container">
              <input 
                type="file" 
                @change="handleFileUpload" 
                class="file-input" 
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
              <label for="file-upload" class="file-upload-label">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
                {{ fileName || 'Choose file or drag and drop' }}
              </label>
              <div v-if="fileName" class="file-status">
                <span class="file-name">{{ fileName }}</span>
                <a v-if="fileURL" :href="fileURL" target="_blank" class="view-file-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  View
                </a>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="navigateBack" class="btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Back
            </button>
            <button type="submit" class="btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
              Submit Qualification
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "vue-router";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
  name: "AddQualification",
  setup() {
    const router = useRouter();
    const qualification = ref({
      supplierName: "",
      evaluationScore: 50,
      remarks: "",
      evaluationDate: new Date().toISOString().split("T")[0],
      evaluator: "",
    });
    const file = ref(null);
    const fileName = ref("");
    const fileURL = ref("");
    const storage = getStorage();

    const handleFileUpload = async (event) => {
      const selected = event.target.files[0];
      if (selected) {
        file.value = selected;
        fileName.value = selected.name;
        // Upload to Firebase Storage
        const storagePath = `qualification-supporting/${Date.now()}_${selected.name}`;
        const fileRef = storageRef(storage, storagePath);
        await uploadBytes(fileRef, selected);
        fileURL.value = await getDownloadURL(fileRef);
      }
    };

    const submitQualification = async () => {
      try {
        await addDoc(collection(db, "qualifications"), {
          ...qualification.value,
          supportingFile: fileURL.value || "",
          createdAt: serverTimestamp(),
        });
        alert("Qualification added successfully!");
        resetForm();
      } catch (error) {
        console.error("Error adding qualification:", error);
        alert("Failed to add qualification. Please try again.");
      }
    };

    const resetForm = () => {
      qualification.value = {
        supplierName: "",
        evaluationScore: 50,
        remarks: "",
        evaluationDate: new Date().toISOString().split("T")[0],
        evaluator: "",
      };
      file.value = null;
      fileName.value = "";
      fileURL.value = "";
    };

    const navigateBack = () => {
      router.push({ name: "PostQualification" });
    };

    return {
      qualification,
      submitQualification,
      navigateBack,
      handleFileUpload,
      fileName,
      fileURL,
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
  padding: 16px 8px;
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
    linear-gradient(60deg, rgba(0, 0, 0, 0.1) 25%, transparent 25.5%, transparent 75%, rgba(0, 0, 0, 0.1) 75%, rgba(0, 0, 0, 0.1));
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px;
  opacity: 0.2;
}

.admin-card {
  width: 100%;
  max-width: 85vw;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.card-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  padding: 24px;
  color: white;
  position: relative;
  overflow: hidden;
}

.card-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
  pointer-events: none;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.logo-container {
  flex-shrink: 0;
}

.logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.header-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
  letter-spacing: -0.025em;
}

.subtitle {
  font-size: 0.95rem;
  color: #cbd5e1;
  opacity: 0.9;
  margin: 0;
}

.card-content {
  padding: 32px;
  background: #fafafa;
  background-image: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  color: #1e293b;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.025em;
}

.input-field {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
  color: #1e293b;
  background-color: #ffffff;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
}

.input-field:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background-color: #ffffff;
}

.input-field::placeholder {
  color: #94a3b8;
}

.textarea {
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.score-container {
  display: flex;
  align-items: flex-end;
  gap: 16px;
}

.score-input-wrapper {
  flex: 1;
}

.score-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(to right, #ef4444 0%, #f97316 25%, #eab308 50%, #22c55e 75%, #10b981 100%);
  border-radius: 3px;
  outline: none;
  margin-bottom: 8px;
}

.score-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  border: 3px solid #3b82f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.score-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.score-markers {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

.score-display {
  display: flex;
  align-items: baseline;
  padding: 8px 12px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}

.score-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.score-unit {
  font-size: 0.875rem;
  color: #64748b;
  margin-left: 2px;
}

.file-upload-container {
  position: relative;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.file-upload-label {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
  font-size: 14px;
}

.file-upload-label:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
}

.file-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding: 8px 12px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
}

.file-name {
  font-size: 13px;
  color: #0369a1;
  font-weight: 500;
}

.view-file-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #3b82f6;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.view-file-btn:hover {
  color: #1d4ed8;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
  color: #334155;
  border-color: #cbd5e1;
}

@media (max-width: 1200px) {
  .admin-card {
    max-width: 98vw;
  }
  
  .card-content {
    padding: 28px;
  }
}

@media (max-width: 768px) {
  .admin-wrapper {
    padding: 12px 4px;
  }

  .admin-card {
    max-width: 100vw;
    border-radius: 12px;
  }

  .card-header {
    padding: 20px;
  }

  .card-content {
    padding: 24px 16px 20px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .score-container {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .admin-wrapper {
    padding: 8px 2px;
  }
  
  .admin-card {
    border-radius: 8px;
  }
  
  .card-content {
    padding: 20px 12px 16px;
  }
}
</style>