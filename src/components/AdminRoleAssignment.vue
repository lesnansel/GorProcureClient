<template>
  <div class="role-assignment-container">
    <h2>Assign Role to User</h2>
    <form @submit.prevent="assignRole">
      <div class="form-group">
        <label for="userId">User ID</label>
        <input v-model="userId" id="userId" type="text" placeholder="Enter User ID" required />
      </div>
      <div class="form-group">
        <label for="role">Role</label>
        <select v-model="role" id="role" required>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="supplier">Supplier</option>
        </select>
      </div>
      <button type="submit" class="assign-btn">Assign Role</button>
    </form>
    <p v-if="message" :class="{'success-message': success, 'error-message': !success}">{{ message }}</p>
  </div>
</template>

<script>
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  data() {
    return {
      userId: "",
      role: "user",
      message: "",
      success: false
    };
  },
  methods: {
    async assignRole() {
      try {
        const userRef = doc(db, "users", this.userId);
        await updateDoc(userRef, { role: this.role });
        this.message = `Role "${this.role}" assigned successfully to user ${this.userId}.`;
        this.success = true;
      } catch (error) {
        console.error("Error assigning role:", error);
        this.message = "Failed to assign role. Please check the User ID and try again.";
        this.success = false;
      }
    }
  }
};
</script>

<style scoped>
.role-assignment-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.assign-btn {
  width: 100%;
  padding: 10px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.assign-btn:hover {
  background-color: #2563eb;
}

.success-message {
  color: #16a34a;
  text-align: center;
  margin-top: 15px;
}

.error-message {
  color: #e53e3e;
  text-align: center;
  margin-top: 15px;
}
</style>
