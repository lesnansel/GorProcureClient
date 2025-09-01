<template>
  <div class="admin-wrapper">
    <!-- Background Pattern -->
    <div class="background-pattern">
      <div class="pattern-overlay"></div>
    </div>

    <!-- Admin Card -->
    <div class="admin-card">
      <div class="card-header">
        <div class="logo-container">
          <img src="@/assets/proculogo.png" alt="Procurement System Logo" class="logo" />
        </div>
        <h1 class="title">Contracts</h1>
        <p class="subtitle">Manage all contracts efficiently</p>
      </div>

      <div class="card-content">
        <!-- Add Contract Form -->
        <form @submit.prevent="addContract" class="form">
          <div class="form-group">
            <label>Contract Name</label>
            <input v-model="newContract.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Amount</label>
            <input v-model="newContract.amount" type="number" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newContract.description" required></textarea>
          </div>
          <button type="submit" class="btn-primary">Add Contract</button>
        </form>

        <!-- Contracts List -->
        <div v-if="contracts.length" class="table-container">
          <table class="contracts-table">
            <thead>
              <tr>
                <th>Contract Name</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(contract, index) in contracts" :key="contract.id">
                <td>{{ contract.name }}</td>
                <td>{{ formatCurrency(contract.amount) }}</td>
                <td>{{ contract.description }}</td>
                <td>
                  <button @click="editContract(index)" class="btn-link">Edit</button>
                  <button @click="deleteContract(contract.id)" class="btn-danger">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="loading-state">No contracts available.</p>

        <!-- Edit Contract Modal -->
        <div v-if="isEditing" class="modal-overlay">
          <div class="modal">
            <h3 class="modal-title">Edit Contract</h3>
            <form @submit.prevent="updateContract">
              <div class="form-group">
                <label>Contract Name</label>
                <input v-model="editContractData.name" type="text" required />
              </div>
              <div class="form-group">
                <label>Amount</label>
                <input v-model="editContractData.amount" type="number" required />
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea v-model="editContractData.description" required></textarea>
              </div>
              <div class="modal-actions">
                <button type="button" @click="isEditing = false" class="btn-secondary">Cancel</button>
                <button type="submit" class="btn-primary">Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db } from "@/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default {
  name: "ContractsView",
  setup() {
    const contracts = ref([]);
    const newContract = ref({ name: "", amount: "", description: "" });
    const isEditing = ref(false);
    const editContractData = ref({});
    const editContractIndex = ref(null);

    const fetchContracts = async () => {
      const querySnapshot = await getDocs(collection(db, "contracts"));
      contracts.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };

    const addContract = async () => {
      try {
        await addDoc(collection(db, "contracts"), newContract.value);
        alert("Contract added successfully");
        newContract.value = { name: "", amount: "", description: "" };
        fetchContracts();
      } catch (error) {
        console.error("Error adding contract:", error);
        alert("Failed to add contract. Please try again.");
      }
    };

    const editContract = (index) => {
      editContractIndex.value = index;
      editContractData.value = { ...contracts.value[index] };
      isEditing.value = true;
    };

    const updateContract = async () => {
      try {
        const contractRef = doc(db, "contracts", editContractData.value.id);
        await updateDoc(contractRef, {
          name: editContractData.value.name,
          amount: editContractData.value.amount,
          description: editContractData.value.description,
        });
        alert("Contract updated successfully");
        isEditing.value = false;
        fetchContracts();
      } catch (error) {
        console.error("Error updating contract:", error);
        alert("Failed to update contract. Please try again.");
      }
    };

    const deleteContract = async (id) => {
      if (confirm("Are you sure you want to delete this contract?")) {
        try {
          await deleteDoc(doc(db, "contracts", id));
          alert("Contract deleted successfully");
          fetchContracts();
        } catch (error) {
          console.error("Error deleting contract:", error);
          alert("Failed to delete contract. Please try again.");
        }
      }
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    };

    onMounted(fetchContracts);

    return {
      contracts,
      newContract,
      isEditing,
      editContractData,
      addContract,
      editContract,
      updateContract,
      deleteContract,
      formatCurrency,
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

.card-header {
  background: linear-gradient(135deg, #0f2942 0%, #102a42 100%);
  padding: 30px;
  text-align: center;
  color: white;
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

/* Table Design */
.table-container {
  overflow-x: auto;
}

.contracts-table {
  width: 100%;
  border-collapse: collapse;
}

.contracts-table th,
.contracts-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.contracts-table th {
  background-color: #2b6cb0;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.contracts-table td {
  color: #2d3748;
  font-size: 14px;
}

.contracts-table tr:hover td {
  background-color: #ebf8ff;
}

.loading-state {
  text-align: center;
  color: #1a202c;
  font-size: 16px;
  font-weight: bold;
}
</style>
