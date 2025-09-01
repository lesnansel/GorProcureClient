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

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Evaluation Score</label>
              <div class="score-input-container">
                <input 
                  v-model="qualification.evaluationScore" 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="1" 
                  class="score-slider" 
                  required 
                />
                <div class="score-display">
                  <span class="score-value">{{ qualification.evaluationScore }}</span>
                  <span class="score-max">/100</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Remarks</label>
            <textarea 
              v-model="qualification.remarks" 
              class="input-field textarea" 
              placeholder="Enter remarks" 
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
            <label class="form-label">Supporting Document (optional)</label>
            <input type="file" @change="handleFileUpload" class="input-field" />
            <span v-if="fileName">Selected: {{ fileName }}</span>
            <span v-if="fileURL"><a :href="fileURL" target="_blank" class="document-link">View Uploaded</a></span>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
              Submit
            </button>
            <button type="button" @click="navigateBack" class="btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Back
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
    linear-gradient(60deg, rgba(0, 0, 0, 0.1) 25%, transparent 25.5%, transparent 75%, rgba(0, 0, 0, 0.1) 75%, rgba(0, 0, 0, 0.1));
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px;
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
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1.1rem;
  color: #64748b;
  opacity: 0.9;
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
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 1.1rem;
  color: #64748b;
  opacity: 0.9;
}

.card-content {
  padding: 30px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.input-field {
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 15px;
  color: #2d3748;
  background-color: #fff;
  transition: all 0.2s ease;
}

.input-field:focus {
  border-color: #2563eb;
  outline: none;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12);
}

.form-label {
  color: #374151;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
}

.textarea {
  min-height: 100px;
  resize: vertical;
  color: #2d3748;
  background: #f9fafb;
}

.form-row {
  display: flex;
  gap: 20px;
}

.score-input-container {
  display: flex;
  align-items: center;
  gap: 10px;
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
  color: #1e293b;
}

.score-max {
  font-size: 1rem;
  color: #64748b;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-primary {
  padding: 10px 16px;
  background-color: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-secondary {
  padding: 10px 16px;
  background-color: #f1f5f9;
  color: #374151;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

.document-link {
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
}
</style>