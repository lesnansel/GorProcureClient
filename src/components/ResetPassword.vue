<template>
  <div class="reset-wrapper">
    <!-- Background Pattern -->
    <div class="background-pattern">
      <div class="pattern-overlay"></div>
    </div>

    <!-- Reset Password Card -->
    <div class="reset-card">
      <div class="card-header">
        <div class="logo-container">
          <img src="/placeholder.svg" alt="Procurement System Logo" class="logo" />
        </div>
        <h1 class="title">Reset Password</h1>
        <p class="subtitle">Enter your email to receive reset instructions</p>
      </div>

      <form @submit.prevent="resetPassword" class="reset-form">
        <div class="form-group" :class="{ 'error': error }">
          <label for="email">Email Address</label>
          <div class="input-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <input 
              id="email"
              type="email" 
              v-model="email" 
              placeholder="your.email@example.com"
              required
              :disabled="loading"
            />
          </div>
          <p class="error-text" v-if="error">{{ error }}</p>
        </div>

        <div v-if="success" class="success-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="success-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <p>{{ success }}</p>
        </div>

        <button 
          type="submit" 
          class="reset-button"
          :disabled="loading || !isValidEmail"
        >
          <span v-if="!loading">Send Reset Link</span>
          <div v-else class="spinner"></div>
        </button>
      </form>

      <div class="back-link">
        <router-link to="/login" class="login-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="back-icon"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
//import { useRouter } from "vue-router";

// Form state
const email = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");
//const router = useRouter();

// Email validation
const isValidEmail = computed(() => {
  return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email.value);
});

// Reset password function
const resetPassword = async () => {
  if (!isValidEmail.value) {
    error.value = "Please enter a valid email address";
    return;
  }

  loading.value = true;
  error.value = "";
  success.value = "";

  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email.value);
    success.value = "Password reset link has been sent to your email";
    email.value = ""; // Clear the input
  } catch (err) {
    handleError(err);
  } finally {
    loading.value = false;
  }
};

// Handle errors
const handleError = (err) => {
  switch (err.code) {
    case 'auth/user-not-found':
      error.value = "No account found with this email address";
      break;
    case 'auth/too-many-requests':
      error.value = "Too many attempts. Please try again later";
      break;
    default:
      error.value = "Failed to send reset link. Please try again";
  }
};
</script>

<style scoped>
.reset-wrapper {
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
.reset-card {
  width: 100%;
  max-width: 450px;
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

.reset-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #666;
}

.input-container input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
}

.input-container input:focus {
  border-color: #0f2942;
  box-shadow: 0 0 0 2px rgba(15, 41, 66, 0.1);
  outline: none;
}

.form-group.error input {
  border-color: #e53e3e;
}

.error-text {
  color: #e53e3e;
  font-size: 0.85rem;
  margin-top: 6px;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background-color: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 6px;
  color: #16a34a;
  margin-bottom: 24px;
}

.success-icon {
  color: #16a34a;
  flex-shrink: 0;
}

.reset-button {
  width: 100%;
  padding: 14px;
  background-color: #0f2942;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.reset-button:hover:not(:disabled) {
  background-color: #1a4971;
}

.reset-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.back-link {
  text-align: center;
  padding: 0 30px 30px;
}

.login-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #0f2942;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
}

.login-link:hover {
  color: #1a4971;
}

.back-icon {
  transition: transform 0.3s;
}

.login-link:hover .back-icon {
  transform: translateX(-3px);
}

@media (max-width: 480px) {
  .reset-card {
    border-radius: 8px;
  }
  
  .card-header {
    padding: 25px 20px;
  }
  
  .reset-form {
    padding: 20px;
  }
  
  .back-link {
    padding: 0 20px 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }
}
</style>