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
            <h1 class="title">Add Contract</h1>
            <p class="subtitle">Record a new contract for a procurement process</p>
          </div>
        </div>
      </div>

      <div class="card-content">
        <form @submit.prevent="submitContract">
          <!-- Contract Details -->
          <div class="form-group">
            <label for="contractTitle" class="form-label">Contract Title</label>
            <input
              id="contractTitle"
              v-model="contractTitle"
              type="text"
              class="input-field"
              placeholder="Enter contract title"
              required
            />
          </div>

          <div class="form-group">
            <label for="contractorName" class="form-label">Contractor Name</label>
            <input
              id="contractorName"
              v-model="contractorName"
              type="text"
              class="input-field"
              placeholder="Enter contractor name"
              required
            />
          </div>

          <div class="form-group">
            <label for="contractAmount" class="form-label">Contract Amount</label>
            <input
              id="contractAmount"
              v-model="contractAmount"
              type="number"
              class="input-field"
              placeholder="Enter contract amount"
              required
            />
          </div>

          <div class="form-group">
            <label for="startDate" class="form-label">Start Date</label>
            <input
              id="startDate"
              v-model="startDate"
              type="date"
              class="input-field"
              required
            />
          </div>

          <div class="form-group">
            <label for="endDate" class="form-label">End Date</label>
            <input
              id="endDate"
              v-model="endDate"
              type="date"
              class="input-field"
              required
            />
          </div>

          <div class="form-group">
            <label for="contractDescription" class="form-label">Description</label>
            <textarea
              id="contractDescription"
              v-model="contractDescription"
              class="input-field textarea"
              placeholder="Add a description for the contract (optional)"
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button type="button" @click="goBack" class="btn-back">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Back
            </button>
            <button type="submit" class="btn-submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
              Submit Contract
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";

export default {
  setup() {
    const router = useRouter();
    const contractTitle = ref("");
    const contractorName = ref("");
    const contractAmount = ref("");
    const startDate = ref("");
    const endDate = ref("");
    const contractDescription = ref("");

    const submitContract = async () => {
      try {
        const contractData = {
          supplier: contractorName.value, // maps contractor name
          poNumber: contractTitle.value, // maps contract title as PO number
          value: parseFloat(contractAmount.value),
          startDate: startDate.value,
          endDate: endDate.value,
          description: contractDescription.value,
          status: "Pending", // default status
          createdAt: new Date(),
        };

        await addDoc(collection(db, "contracts"), contractData);
        alert("Contract added successfully!");
        router.push("/contract-management");
      } catch (error) {
        console.error("Error adding contract:", error);
        alert("Failed to add contract. Please try again.");
      }
    };

    const goBack = () => {
      router.back();
    };

    return {
      contractTitle,
      contractorName,
      contractAmount,
      startDate,
      endDate,
      contractDescription,
      submitContract,
      goBack,
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
  max-width: 600px;
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

/* Form Styling */
.form-group {
  margin-bottom: 20px;
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
}

.textarea {
  min-height: 120px;
  resize: vertical;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
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
</style>
