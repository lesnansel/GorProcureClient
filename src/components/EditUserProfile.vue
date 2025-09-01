<template>
  <div class="edit-profile-wrapper">
    <!-- Background Pattern -->
    <div class="background-pattern">
      <div class="pattern-overlay"></div>
    </div>

    <!-- Edit Profile Card -->
    <div class="profile-card">
      <!-- Improved Section Header -->
      <div class="profile-header align-left">
        <div class="header-flex">
          <img src="@/assets/proculogo.png" alt="Procurement System Logo" class="logo" />
          <div class="header-text">
            <h2>Edit Profile</h2>
            <p class="subtitle">Update your personal information</p>
          </div>
        </div>
      </div>

      <div class="card-content">
        <!-- Avatar Enhancement -->
        <div class="avatar-container">
          <div class="avatar-ring">
            <img 
              :src="previewUrl || profileImageUrl || defaultProfilePic" 
              alt="Profile Picture" 
              class="profile-img"
            />
            <button class="edit-avatar" @click="triggerFileInput" title="Change Photo">
              ✏️
            </button>
          </div>
          <input 
            type="file" 
            ref="fileInput"
            @change="handleFileUpload" 
            accept="image/*"
            class="hidden"
          />
          <button 
            v-if="selectedFile"
            @click="updateProfileImage" 
            :disabled="isLoading"
            class="upload-btn"
          >
            <span v-if="!isLoading">Upload New Picture</span>
            <span v-else class="spinner"></span>
          </button>
          <p v-if="uploadError" class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="error-icon"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            {{ uploadError }}
          </p>
        </div>

        <!-- User Info Form -->
        <form @submit.prevent="updateProfileInfo" class="edit-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="completeName">Complete Name</label>
              <input 
                type="text" 
                id="completeName"
                v-model="completeName" 
                required
                autofocus
              />
            </div>

            <div class="form-group">
              <label for="age">Age</label>
              <input 
                type="number" 
                id="age"
                v-model="age" 
                required
                min="1"
              />
            </div>

            <div class="form-group">
              <label for="birthday">
                Birthday
                <span class="tooltip" title="Enter your date of birth">(?)</span>
              </label>
              <input 
                type="date" 
                id="birthday"
                v-model="birthday" 
                required
              />
            </div>

            <div class="form-group">
              <label for="cellphone">Cellphone Number</label>
              <input 
                type="tel" 
                id="cellphone"
                v-model="cellphone" 
                required
              />
            </div>

            <div class="form-group">
              <label for="gender">
                Gender
                <span class="tooltip" title="Select your gender">(?)</span>
              </label>
              <select 
                id="gender"
                v-model="gender" 
                required
              >
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label for="address">Complete Address</label>
              <input 
                type="text" 
                id="address"
                v-model="address" 
                required
              />
            </div>
          </div>

          <div class="button-row">
            <button 
              type="submit" 
              class="save-btn"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Save Changes</span>
              <span v-else class="spinner"></span>
            </button>

            <button 
              type="button"
              class="cancel-btn"
              @click="$router.push('/profile-display')"
            >
              Cancel
            </button>

            <button 
              type="button"
              class="deactivate-btn"
              @click="showDeactivateModal = true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="user-slash-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="4" x2="7" y2="20"/></svg>
              Deactivate Account
            </button>
          </div>

          <div v-if="successMessage" class="success-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="success-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            {{ successMessage }}
          </div>

          <div v-if="errorMessage" class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="error-icon"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>

    <!-- Deactivation Modal -->
    <div v-if="showDeactivateModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="warning-icon"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            Deactivate Account
          </h3>
          <button class="close-btn" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="modal-body">
          <p class="warning-text">
            This action cannot be undone. Please enter your password to confirm.
          </p>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password"
              v-model="password"
              required
            />
          </div>

          <p v-if="deactivateError" class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="error-icon"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            {{ deactivateError }}
          </p>
        </div>

        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button 
            class="confirm-btn" 
            @click="confirmDeactivation"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Confirm Deactivation</span>
            <span v-else class="spinner"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, storage } from "../firebase";

// Form state
const completeName = ref("");
const age = ref("");
const birthday = ref("");
const cellphone = ref("");
const gender = ref("");
const address = ref("");
const profileImageUrl = ref("");
const previewUrl = ref("");
const selectedFile = ref(null);
const fileInput = ref(null);

// UI state
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const uploadError = ref("");
const showDeactivateModal = ref(false);
const password = ref("");
const deactivateError = ref("");

const router = useRouter();
const auth = getAuth();
const defaultProfilePic = "https://ui-avatars.com/api/?background=0F2942&color=fff";

// Load user data
onMounted(async () => {
  const user = auth.currentUser;
  if (!user) {
    router.push("/login");
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      completeName.value = data.completeName || "";
      age.value = data.age || "";
      birthday.value = data.birthday || "";
      cellphone.value = data.cellphone || "";
      gender.value = data.gender || "";
      address.value = data.address || "";
      profileImageUrl.value = data.profileImageUrl || "";
    }
  } catch (error) {
    errorMessage.value = "Failed to load profile data";
  }
});

// Profile picture handling
const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    uploadError.value = "Please select an image file";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = "Image size should be less than 5MB";
    return;
  }

  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
  uploadError.value = "";
};

const updateProfileImage = async () => {
  const user = auth.currentUser;
  if (!user || !selectedFile.value) return;

  isLoading.value = true;
  uploadError.value = "";

  try {
    const fileRef = storageRef(storage, `profile_pictures/${user.uid}-${Date.now()}`);
    await uploadBytes(fileRef, selectedFile.value);
    const imageUrl = await getDownloadURL(fileRef);

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      profileImageUrl: imageUrl,
    });

    profileImageUrl.value = imageUrl;
    selectedFile.value = null;
    successMessage.value = "Profile picture updated successfully!";
  } catch (error) {
    uploadError.value = "Failed to upload profile picture";
  } finally {
    isLoading.value = false;
  }
};

// Profile info update
const updateProfileInfo = async () => {
  const user = auth.currentUser;
  if (!user) return;

  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      completeName: completeName.value,
      age: age.value,
      birthday: birthday.value,
      cellphone: cellphone.value,
      gender: gender.value,
      address: address.value,
    });

    successMessage.value = "Profile updated successfully!";
    setTimeout(() => {
      router.push("/profile-display");
    }, 2000);
  } catch (error) {
    errorMessage.value = "Failed to update profile";
  } finally {
    isLoading.value = false;
  }
};

// Account deactivation
const confirmDeactivation = async () => {
  if (!password.value.trim()) {
    deactivateError.value = "Please enter your password";
    return;
  }

  isLoading.value = true;
  deactivateError.value = "";

  try {
    const user = auth.currentUser;
    await signInWithEmailAndPassword(auth, user.email, password.value);

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      status: "deactivated",
    });

    await auth.signOut();
    router.push("/login");
  } catch (error) {
    deactivateError.value = "Incorrect password";
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => {
  showDeactivateModal.value = false;
  password.value = "";
  deactivateError.value = "";
};
</script>

<style scoped>
.edit-profile-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #112940;
}

/* Background Pattern */
.background-pattern {
  position: fixed;
  inset: 0;
  background-color: #112940;
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

/* Section Header Refinement */
.profile-header {
  background: linear-gradient(to right, #0e2235, #163d5c);
  padding: 2rem 1rem 1.5rem 1rem;
  color: white;
  text-align: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.profile-header.align-left {
  background: linear-gradient(to right, #0e2235, #163d5c);
  padding: 2rem 2rem 1.5rem 2rem;
  color: white;
  text-align: left;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.header-flex {
  display: flex;
  align-items: center;
  gap: 18px;
}
.profile-header .logo {
  width: 60px;
  margin: 0 auto 0.5rem;
  display: block;
}
.profile-header.align-left .logo {
  width: 60px;
  margin: 0;
  display: block;
}
.header-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.header-text h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  margin-top: 0;
}
.header-text .subtitle {
  font-size: 0.9rem;
  opacity: 0.85;
  margin-bottom: 0;
}
.profile-header.align-left {
  text-align: left;
}

/* Card Design */
.profile-card {
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
  margin: auto;
}

.card-content {
  padding: 30px;
}

/* Avatar Enhancement */
.avatar-container {
  position: relative;
  margin: 0 auto 1.5rem auto;
  width: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-ring {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3c8dbc, #1e3a5f);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.2rem;
  color: white;
  box-shadow: 0 0 0 4px #fff;
  position: relative;
  overflow: hidden;
}
.avatar-ring .profile-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: none;
  box-shadow: none;
}
.edit-avatar {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #fff;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.edit-avatar:hover {
  background: #e9ecef;
}
.hidden {
  display: none;
}

/* Field Layout & Spacing */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
}
input, select {
  border-radius: 8px;
  padding: 0.75rem;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}
input:focus, select:focus {
  outline: none;
  border-color: #3273dc;
  box-shadow: 0 0 0 3px rgba(50, 115, 220, 0.1);
}
.tooltip {
  font-size: 0.9em;
  color: #888;
  cursor: help;
  margin-left: 4px;
}

/* Action Buttons Styling */
.button-row {
  display: flex;
  gap: 12px;
  margin-top: 18px;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.save-btn {
  background: #0e2235;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  transition: background 0.2s;
}
.save-btn:hover {
  background: #184b73;
}
.cancel-btn {
  border: 1px solid #ccc;
  color: #333;
  background: #f8f9fa;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}
.cancel-btn:hover {
  background: #e9ecef;
}
.deactivate-btn {
  color: #e74c3c;
  border: 1px solid #e74c3c;
  background: rgba(231, 76, 60, 0.05);
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s, color 0.2s;
}
.deactivate-btn:hover {
  background: rgba(231, 76, 60, 0.12);
  color: #c0392b;
}

/* Feedback/Validation */
input:invalid, select:invalid {
  border-color: #e74c3c;
}
input:invalid:focus, select:invalid:focus {
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  color: #e53e3e;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.warning-icon {
  color: #e53e3e;
}

.close-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
}

.modal-body {
  padding: 20px;
  color: #666;
}

.warning-text {
  margin-bottom: 20px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
.confirm-btn {
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}
.confirm-btn:hover:not(:disabled) {
  background-color: #dc2626;
}
.confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive Styles */
@media (max-width: 700px) {
  .profile-card {
    max-width: 98vw;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .button-row {
    flex-direction: column;
    align-items: stretch;
  }
  .avatar-container {
    width: 100px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }
}
</style>