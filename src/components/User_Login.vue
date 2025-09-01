<template>
  <div class="login-wrapper">
    <!-- Background Pattern -->
    <div class="background-pattern">
      <div class="pattern-overlay"></div>
    </div>

    <!-- Login Card -->
    <div class="login-card">
      <div class="card-header">
        <div class="logo-container">
          <img src="@/assets/proculogo.png" alt="Procurement System Logo" class="logo" />
        </div>
        <h1 class="title">GovProcure - Procurement System</h1>
        <p class="subtitle">Sign in to access your dashboard</p>
      </div>

      <form @submit.prevent="loginUser(email, password)" class="login-form">
        <div class="form-group" :class="{ 'error': errors.email }">
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
          <p class="error-text" v-if="errors.email">{{ errors.email }}</p>
        </div>

        <div class="form-group" :class="{ 'error': errors.password }">
          <label for="password">Password</label>
          <div class="input-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input 
              id="password"
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" 
              placeholder="Enter your password"
              required
              :disabled="loading"
            />
            <button 
              type="button"
              class="toggle-password"
              @click="togglePassword"
              tabindex="-1"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
          <p class="error-text" v-if="errors.password">{{ errors.password }}</p>
        </div>

        <div class="form-options">
          <label class="checkbox-container">
            <input type="checkbox" v-model="rememberMe" />
            <span class="checkmark"></span>
            <span>Remember me</span>
          </label>
          <router-link to="/reset-password" class="forgot-password">
            Forgot password?
          </router-link>
        </div>

        <button 
          type="submit" 
          class="login-button"
          :disabled="loading"
        >
          <span v-if="!loading">Sign In</span>
          <div v-else class="spinner"></div>
        </button>

        <button 
          v-if="showResendVerification" 
          @click="resendVerification" 
          type="button"
          class="resend-button"
          :disabled="verificationLoading"
        >
          <span v-if="!verificationLoading">Resend Verification Email</span>
          <div v-else class="spinner"></div>
        </button>
      </form>

      <div class="separator">
        <span>OR</span>
      </div>

      <button 
        @click="loginWithGoogle" 
        class="google-button"
        :disabled="loading"
      >
        <img src="@/assets/google-icon.png" alt="Google" />
        <span>Continue with Google</span>
      </button>

      <div class="signup-link">
        Don't have an account? <router-link to="/register">Create one</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"; // Removed unused imports
import { useRouter } from "vue-router";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

// Form state
const email = ref("");
const password = ref("");
const loading = ref(false);
const verificationLoading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);
const showResendVerification = ref(false);

const errors = reactive({
  email: "",
  password: ""
});

// Router and Auth
const router = useRouter();
const auth = getAuth();

// Toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// Login function
const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user data from Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User data not found in Firestore. Please contact support.");
      await signOut(auth);
      return;
    }

    const userData = userSnap.data();
    if (userData.status === "deactivated") {
      alert("Your account is deactivated. Please contact support.");
      await signOut(auth);
      return;
    }

    // Redirect based on user role
    const role = userData.role || "user";
    router.push(role === "admin" ? "/admin-dashboard" : "/dashboard");
  } catch (error) {
    console.error("Login Error:", error.message);
    if (error.code === "auth/user-not-found") {
      alert("User not found. Please check your email or register.");
    } else if (error.code === "auth/wrong-password") {
      alert("Incorrect password. Please try again.");
    } else if (error.code === "auth/invalid-email") {
      alert("Invalid email format. Please check your email.");
    } else {
      alert("Login failed. Please try again.");
    }
  }
};

const loginWithGoogle = async () => {
  loading.value = true;
  errors.email = "";
  
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      errors.email = "Account not registered. Please sign up first.";
      await signOut(auth);
      return;
    }

    const userData = userSnap.data();
    if (userData.status === "deactivated") {
      errors.email = "Account deactivated. Please contact support.";
      await signOut(auth);
      return;
    }

    localStorage.setItem('userRole', userData.role);
    router.push(userData.role === "admin" ? "/admin-dashboard" : "/dashboard");
  } catch (error) {
    errors.email = "Google Sign-In failed. Please try again.";
    console.error("Google Sign-In Error:", error);
  } finally {
    loading.value = false;
  }
};

const resendVerification = async () => {
  verificationLoading.value = true;
  try {
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
      errors.email = "Verification email sent! Please check your inbox.";
    }
  } catch (error) {
    errors.email = "Failed to send verification email. Please try again.";
  } finally {
    verificationLoading.value = false;
  }
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* New Background Pattern */
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

/* New Card Design */
.login-card {
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

.login-form {
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

.toggle-password {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-group.error input {
  border-color: #e53e3e;
}

.error-text {
  color: #e53e3e;
  font-size: 0.85rem;
  margin-top: 6px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 28px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #555;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #eee;
  border-radius: 3px;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #ddd;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #0f2942;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.forgot-password {
  color: #0f2942;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password:hover {
  color: #1a4971;
  text-decoration: underline;
}

.login-button {
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

.login-button:hover:not(:disabled) {
  background-color: #1a4971;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.resend-button {
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  background-color: transparent;
  color: #0f2942;
  border: 1px solid #0f2942;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.resend-button:hover:not(:disabled) {
  background-color: rgba(15, 41, 66, 0.05);
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

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 0 30px 20px;
  color: #666;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.separator span {
  padding: 0 10px;
  font-size: 0.9rem;
  font-weight: 500;
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: calc(100% - 60px);
  margin: 0 30px 20px;
  padding: 12px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #333;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.google-button:hover:not(:disabled) {
  background-color: #f8f8f8;
  border-color: #ccc;
}

.google-button img {
  width: 18px;
  height: 18px;
}

.signup-link {
  text-align: center;
  padding: 0 30px 30px;
  color: #555;
  font-size: 0.95rem;
}

.signup-link a {
  color: #0f2942;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s;
}

.signup-link a:hover {
  text-decoration: underline;
  color: #1a4971;
}

@media (max-width: 480px) {
  .login-card {
    border-radius: 8px;
  }
  
  .card-header {
    padding: 25px 20px;
  }
  
  .login-form {
    padding: 20px;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .google-button,
  .separator {
    margin-left: 20px;
    margin-right: 20px;
    width: calc(100% - 40px);
  }
  
  .signup-link {
    padding: 0 20px 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }
}
</style>