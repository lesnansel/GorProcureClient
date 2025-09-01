<template>
  <div class="admin-wrapper">
    <!-- Background Pattern -->
    <div class="background-pattern">
      <div class="pattern-overlay"></div>
    </div>
    <div class="main-content p-6 max-w-3xl mx-auto">
      <div class="admin-card">
        <div class="modal-header">
          <h2 class="modal-title">Edit Post-Qualification</h2>
        </div>
        <form @submit.prevent="submitEdit" class="modal-body">
          <div class="form-group">
            <label class="form-label">Supplier Name</label>
            <input v-model="qualification.supplierName" class="input-field" required />
          </div>

          <div class="form-group">
            <label class="form-label">Evaluation Score</label>
            <div class="score-input-container">
              <input
                type="range"
                min="0"
                max="100"
                v-model.number="qualification.evaluationScore"
                class="score-slider"
              />
              <div class="score-display">
                <span class="score-value">{{ qualification.evaluationScore }}</span>
                <span class="score-max">/100</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Remarks</label>
            <textarea v-model="qualification.remarks" rows="4" class="input-field textarea"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Evaluation Date</label>
              <input type="date" v-model="qualification.evaluationDate" class="input-field" required />
            </div>
            <div class="form-group">
              <label class="form-label">Evaluator</label>
              <input v-model="qualification.evaluator" class="input-field" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Supporting Document (optional)</label>
            <div class="file-upload">
              <label class="file-label">
                <input type="file" class="file-input" @change="handleFileUpload" />
                📎 Choose File
              </label>
              <div v-if="fileName" class="text-sm mt-1 text-gray-600">Selected: {{ fileName }}</div>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="goBack">Cancel</button>
            <button type="submit" class="btn-primary">Update</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db, storage } from '@/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const qualificationId = route.params.id;

    const qualification = ref({
      supplierName: '',
      evaluationScore: 50,
      remarks: '',
      evaluationDate: new Date().toISOString().split('T')[0],
      evaluator: '',
      fileUrl: ''
    });

    const file = ref(null);
    const fileName = ref('');

    const fetchQualification = async () => {
      try {
        const docRef = doc(db, 'qualifications', qualificationId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          qualification.value = {
            ...data,
            evaluationDate: data.evaluationDate || new Date().toISOString().split('T')[0]
          };
        } else {
          alert('Qualification not found');
          router.back();
        }
      } catch (err) {
        console.error('Error fetching qualification:', err);
        alert('Error loading record.');
      }
    };

    const handleFileUpload = (e) => {
      file.value = e.target.files[0];
      fileName.value = file.value.name;
    };

    const submitEdit = async () => {
      try {
        const docRef = doc(db, 'qualifications', qualificationId);
        let fileUrl = qualification.value.fileUrl;

        if (file.value) {
          const path = `qualifications/${Date.now()}_${file.value.name}`;
          const sRef = storageRef(storage, path);
          await uploadBytes(sRef, file.value);
          fileUrl = await getDownloadURL(sRef);
        }

        // Fix: Remove undefined fields from update payload
        const updatePayload = { ...qualification.value, updatedAt: serverTimestamp() };
        if (fileUrl !== undefined && fileUrl !== null && fileUrl !== "") {
          updatePayload.fileUrl = fileUrl;
        } else {
          // Remove fileUrl if it's undefined to avoid Firestore error
          delete updatePayload.fileUrl;
        }

        await updateDoc(docRef, updatePayload);

        alert('Qualification updated successfully!');
        router.push('/post-qualification');
      } catch (err) {
        console.error('Error updating:', err);
        alert('Failed to update record.');
      }
    };

    const goBack = () => router.back();

    onMounted(fetchQualification);

    return {
      qualification,
      file,
      fileName,
      handleFileUpload,
      submitEdit,
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

/* Center the card */
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
.modal-header {
  background: linear-gradient(135deg, #0f2942 0%, #102a42 100%);
  padding: 30px;
  color: white;
  text-align: center;
}
.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}
.modal-body {
  padding: 30px;
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
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.textarea {
  min-height: 80px;
  resize: vertical;
}
.form-row {
  display: flex;
  gap: 20px;
}
@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
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
.file-upload {
  margin-top: 8px;
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
.file-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.modal-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.btn-primary {
  background-color: #2563eb;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary:hover {
  background-color: #1d4ed8;
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
}
.btn-secondary:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}
</style>
