<template>
  <div class="profile-wrapper">
    <!-- Background Pattern -->
    <div class="background-pattern">
      <div class="pattern-overlay"></div>
    </div>

    <!-- Profile Card -->
    <div class="profile-card card">
      <div class="card-header">
        <div class="logo-container">
          <img src="/placeholder.svg" alt="Procurement System Logo" class="logo" />
        </div>
        <h1 class="title">User Profile</h1>
        <p class="subtitle">View and manage your account information</p>
      </div>

      <div class="card-content">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading profile...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="errorMessage" class="error-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="error-icon"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <p>{{ errorMessage }}</p>
          <button @click="fetchUserProfile" class="retry-button">
            Retry
          </button>
        </div>

        <!-- Profile Content -->
        <div v-else class="profile-content">
          <div class="profile-header">
            <div class="avatar-ring">
              <template v-if="profileImageUrl">
                <img 
                  :src="profileImageUrl" 
                  :alt="`${username}'s profile picture`" 
                  class="profile-img"
                  @error="handleImageError"
                />
              </template>
              <template v-else>
                <span class="initials">{{ initials }}</span>
              </template>
              <span 
                class="status-badge" 
                :class="status"
                :title="status === 'active' ? 'Account is active' : 'Account is deactivated'"
              >
                {{ status }}
              </span>
            </div>
            <h2 class="username">{{ username || "Not provided" }}</h2>
            <p class="email">{{ email || "Not provided" }}</p>
          </div>

          <div class="profile-sections">
            <!-- Personal Information -->
            <div class="section card">
              <h3 class="section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                Personal Information
              </h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="label-icon"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M6.343 17.657A8 8 0 0 1 12 16a8 8 0 0 1 5.657 1.657"/></svg>
                    Complete Name
                  </label>
                  <p>{{ completeName || "Not provided" }}</p>
                </div>
                <div class="info-item">
                  <label>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="label-icon"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    Age
                  </label>
                  <p>{{ age || "Not provided" }}</p>
                </div>
                <div class="info-item">
                  <label>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="label-icon"><path d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/></svg>
                    Birthday
                  </label>
                  <p>{{ formattedBirthday }}</p>
                </div>
                <div class="info-item">
                  <label>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="label-icon"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/></svg>
                    Gender
                  </label>
                  <p>{{ gender || "Not provided" }}</p>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="section card">
              <h3 class="section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon"><path d="M20 10c0 6-8 12-8 12s-8-6-8-10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Contact Information
              </h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="label-icon"><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13.81.36 1.6.7 2.34a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0 1 22 16.92z"/></svg>
                    Cellphone
                  </label>
                  <p>{{ cellphone || "Not provided" }}</p>
                </div>
                <div class="info-item">
                  <label>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="label-icon"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    Address
                  </label>
                  <p>{{ address || "Not provided" }}</p>
                </div>
              </div>
            </div>
          </div>

          <router-link to="/edit-profile" class="edit-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="edit-icon"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit Profile
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// State
const username = ref("");
const email = ref("");
const completeName = ref("");
const age = ref("");
const birthday = ref("");
const cellphone = ref("");
const gender = ref("");
const address = ref("");
const profileImageUrl = ref("");
const status = ref("");
const errorMessage = ref("");
const loading = ref(true);

// Default profile picture with modern design
const defaultProfilePic = "https://ui-avatars.com/api/?background=0F2942&color=fff";

// Initials for avatar fallback
const initials = computed(() => {
  if (completeName.value) {
    return completeName.value.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
  if (username.value) {
    return username.value.slice(0, 2).toUpperCase();
  }
  return "U";
});

// Format birthday
const formattedBirthday = computed(() => {
  if (!birthday.value) return "Not provided";
  try {
    const date = new Date(birthday.value);
    if (isNaN(date.getTime())) return birthday.value;
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return birthday.value;
  }
});

const handleImageError = (e) => {
  e.target.src = defaultProfilePic;
};

const fetchUserProfile = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      errorMessage.value = "Please sign in to view your profile";
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      username.value = data.username;
      email.value = data.email;
      completeName.value = data.completeName;
      age.value = data.age;
      birthday.value = data.birthday;
      cellphone.value = data.cellphone;
      gender.value = data.gender;
      address.value = data.address;
      profileImageUrl.value = data.profileImageUrl;
      status.value = data.status || "active";
    } else {
      errorMessage.value = "Profile not found. Please complete your profile setup.";
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    errorMessage.value = "Unable to load profile. Please try again.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUserProfile);
</script>

<style scoped>
/* Card Elevation & Visual Hierarchy */
.card {
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 1.5rem;
  margin-bottom: 1rem;
}

/* Set the main background color to match the image */
.profile-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #112940; /* Deep blue, matches the provided image */
}

/* Background Pattern */
.background-pattern {
  position: fixed;
  inset: 0;
  background-color: #112940; /* Deep blue, matches the provided image */
  z-index: -1;
  overflow: hidden;
}

/* Avatar Ring + Fallback */
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
  margin: 0 auto 8px auto;
  box-shadow: 0 0 0 4px white;
  position: relative;
  overflow: hidden;
}
.avatar-ring img.profile-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: none;
  box-shadow: none;
}
.initials {
  font-weight: 700;
  letter-spacing: 1px;
}

/* Status Badge with Pulse */
.status-badge {
  background: #28a745;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  box-shadow: 0 0 0 2px white;
  position: absolute;
  top: 5px;
  right: 5px;
  animation: pulse 2s infinite;
  text-transform: capitalize;
  cursor: pointer;
}
.status-badge.deactivated {
  background: #e53e3e;
  animation: none;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(40,167,69, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(40,167,69, 0); }
  100% { box-shadow: 0 0 0 0 rgba(40,167,69, 0); }
}

/* Card Header */
.card-header {
  background: linear-gradient(135deg, #0f2942 0%, #102a42 100%);
  padding: 30px;
  text-align: center;
  color: white;
  border-radius: 12px 12px 0 0;
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

/* Profile Content */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.profile-header {
  text-align: center;
}

/* Section Card */
.section {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 24px;
  border: 1px solid #eee;
  margin-bottom: 0;
}
.section-title {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-icon {
  color: #0f2942;
}
.label-icon {
  margin-right: 6px;
  vertical-align: middle;
  color: #3c8dbc;
}

/* Info Grid Responsive */
.info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.info-item {
  flex: 1 1 180px;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.info-item label {
  color: #666;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}
.info-item p {
  color: #333;
  font-size: 1rem;
  margin: 0;
}

/* Edit Profile Button */
.edit-btn {
  background: linear-gradient(135deg, #3c8dbc, #1e3a5f);
  color: white;
  padding: 0.75rem 2rem;
  font-weight: 500;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: center;
  transition: all 0.3s ease;
  border: none;
  margin-top: 10px;
}
.edit-btn:hover {
  background: #2c6fa7;
  color: #fff;
}
.edit-icon {
  color: white;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #666;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(15, 41, 66, 0.1);
  border-radius: 50%;
  border-top-color: #0f2942;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error Container */
.error-container {
  text-align: center;
  color: #e53e3e;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.error-icon {
  color: #e53e3e;
  width: 40px;
  height: 40px;
}
.retry-button {
  margin-top: 8px;
  padding: 8px 16px;
  background-color: rgba(229, 62, 62, 0.1);
  border: 1px solid rgba(229, 62, 62, 0.2);
  border-radius: 6px;
  color: #e53e3e;
  cursor: pointer;
  transition: all 0.3s;
}
.retry-button:hover {
  background-color: rgba(229, 62, 62, 0.2);
}

/* Responsive Design */
@media (max-width: 640px) {
  .card-content {
    padding: 20px;
  }
  .info-grid {
    flex-direction: column;
  }
  .avatar-ring {
    width: 80px;
    height: 80px;
    font-size: 1.5rem;
  }
  .section {
    padding: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }
  .status-badge {
    animation: none;
  }
}
</style>