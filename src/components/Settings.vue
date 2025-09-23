<template>
  <div class="app-container">
    <!-- Background Pattern -->
    <div class="background-pattern">
      <div class="pattern-overlay"></div>
    </div>

    <!-- Sidebar Overlay -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="toggleSidebar"></div>
    
    <!-- Toggle Button -->
    <button class="sidebar-toggle-btn" @click="toggleSidebar">
      <svg v-if="sidebarOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Sidebar -->
    <div :class="['sidebar', sidebarOpen ? 'sidebar-open' : 'sidebar-closed']">
      <!-- User Profile Section -->
      <div class="user-profile">
        <div class="user-avatar">
          <span class="avatar-text">{{ userInitials }}</span>
        </div>
        <div class="user-info">
          <div class="username">{{ userSettings.username }}</div>
          <div class="user-role">{{ userSettings.role }}</div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="nav-menu">
        <!-- GENERAL Section -->
        <div class="nav-section">
          <div class="section-header">GENERAL</div>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/" class="nav-link">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span class="nav-text">Home</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/dashboard" class="nav-link">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span class="nav-text">Dashboard</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/profile-display" class="nav-link">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="nav-text">Profile</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- PROCUREMENT Section -->
        <div class="nav-section">
          <div class="section-header">PROCUREMENT</div>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/purchase-requests" class="nav-link">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="nav-text">Request Purchase</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/payment-tracking" class="nav-link">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="nav-text">Track Payments</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/approved-purchases" class="nav-link">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                <span class="nav-text">PR Lists</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- SYSTEM Section -->
        <div class="nav-section">
          <div class="section-header">SYSTEM</div>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/settings" class="nav-link active">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="nav-text">Settings</span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <!-- Main Content Area -->
    <div class="main-content" :style="{ marginLeft: sidebarOpen ? '300px' : '0' }">
      <div class="content-wrapper">
        <div class="settings-card">
          <!-- Header -->
          <div class="card-header header-flex">
            <div class="logo-container">
              <img src="@/assets/proculogo.png" alt="Procurement System Logo" class="logo" />
            </div>
            <div class="header-text">
              <h1 class="title">Settings</h1>
              <p class="subtitle">Manage your account preferences and system settings</p>
            </div>
          </div>

          <div class="card-content">
            <!-- Success/Error Notification -->
            <div v-if="notification.show" :class="['notification', notification.type]">
              <div class="notification-content">
                <div class="notification-icon" :class="notification.type">
                  <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <p>{{ notification.message }}</p>
                <button @click="closeNotification" class="notification-close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Settings Navigation Tabs -->
            <div class="settings-nav">
              <button 
                v-for="tab in settingsTabs" 
                :key="tab.key"
                @click="activeTab = tab.key"
                :class="['settings-tab', { 'active': activeTab === tab.key }]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="tab.iconClass">
                  <path v-html="tab.iconPath"></path>
                </svg>
                {{ tab.label }}
              </button>
            </div>

            <!-- Settings Content -->
            <div class="settings-content">
              <!-- Account Settings -->
              <div v-if="activeTab === 'account'" class="settings-section">
                <div class="section-header">
                  <h3>Account Information</h3>
                  <p>Update your personal account information</p>
                </div>

                <div class="settings-form">
                  <div class="form-group">
                    <label class="form-label">Username</label>
                    <input 
                      type="text" 
                      v-model="userSettings.username" 
                      class="form-input"
                      placeholder="Enter your username"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input 
                      type="email" 
                      v-model="userSettings.email" 
                      class="form-input"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input 
                      type="text" 
                      v-model="userSettings.fullName" 
                      class="form-input"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Department</label>
                    <select v-model="userSettings.department" class="form-input">
                      <option value="">Select Department</option>
                      <option value="IT">Information Technology</option>
                      <option value="HR">Human Resources</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                      <option value="Procurement">Procurement</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Phone Number</label>
                    <input 
                      type="tel" 
                      v-model="userSettings.phoneNumber" 
                      class="form-input"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div class="form-actions">
                    <button @click="saveAccountSettings" class="btn-primary" :disabled="isSaving">
                      <div v-if="isSaving" class="spinner"></div>
                      {{ isSaving ? 'Saving...' : 'Save Changes' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Security Settings -->
              <div v-if="activeTab === 'security'" class="settings-section">
                <div class="section-header">
                  <h3>Security Settings</h3>
                  <p>Manage your password and security preferences</p>
                </div>

                <div class="settings-form">
                  <div class="form-group">
                    <label class="form-label">Current Password</label>
                    <input 
                      type="password" 
                      v-model="securitySettings.currentPassword" 
                      class="form-input"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">New Password</label>
                    <input 
                      type="password" 
                      v-model="securitySettings.newPassword" 
                      class="form-input"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Confirm New Password</label>
                    <input 
                      type="password" 
                      v-model="securitySettings.confirmPassword" 
                      class="form-input"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div class="form-group">
                    <div class="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="twoFactorAuth" 
                        v-model="securitySettings.twoFactorEnabled"
                        class="form-checkbox"
                      />
                      <label for="twoFactorAuth" class="checkbox-label">
                        Enable Two-Factor Authentication
                        <span class="help-text">Add an extra layer of security to your account</span>
                      </label>
                    </div>
                  </div>

                  <div class="form-group">
                    <div class="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="sessionTimeout" 
                        v-model="securitySettings.autoLogout"
                        class="form-checkbox"
                      />
                      <label for="sessionTimeout" class="checkbox-label">
                        Auto-logout after inactivity
                        <span class="help-text">Automatically log out after 30 minutes of inactivity</span>
                      </label>
                    </div>
                  </div>

                  <div class="form-actions">
                    <button @click="saveSecuritySettings" class="btn-primary" :disabled="isSaving">
                      <div v-if="isSaving" class="spinner"></div>
                      {{ isSaving ? 'Updating...' : 'Update Security' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Notification Settings -->
              <div v-if="activeTab === 'notifications'" class="settings-section">
                <div class="section-header">
                  <h3>Notification Preferences</h3>
                  <p>Choose how you want to be notified about important updates</p>
                </div>

                <div class="settings-form">
                  <div class="notification-group">
                    <h4>Email Notifications</h4>
                    
                    <div class="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="emailPurchaseUpdates" 
                        v-model="notificationSettings.email.purchaseUpdates"
                        class="form-checkbox"
                      />
                      <label for="emailPurchaseUpdates" class="checkbox-label">
                        Purchase Request Updates
                        <span class="help-text">Get notified when your purchase requests are updated</span>
                      </label>
                    </div>

                    <div class="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="emailPaymentAlerts" 
                        v-model="notificationSettings.email.paymentAlerts"
                        class="form-checkbox"
                      />
                      <label for="emailPaymentAlerts" class="checkbox-label">
                        Payment Alerts
                        <span class="help-text">Receive notifications about payment status changes</span>
                      </label>
                    </div>

                    <div class="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="emailWeeklyReports" 
                        v-model="notificationSettings.email.weeklyReports"
                        class="form-checkbox"
                      />
                      <label for="emailWeeklyReports" class="checkbox-label">
                        Weekly Summary Reports
                        <span class="help-text">Get a weekly summary of your procurement activities</span>
                      </label>
                    </div>
                  </div>

                  <div class="notification-group">
                    <h4>System Notifications</h4>
                    
                    <div class="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="systemMaintenance" 
                        v-model="notificationSettings.system.maintenanceAlerts"
                        class="form-checkbox"
                      />
                      <label for="systemMaintenance" class="checkbox-label">
                        System Maintenance Alerts
                        <span class="help-text">Be notified about scheduled system maintenance</span>
                      </label>
                    </div>

                    <div class="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="systemUpdates" 
                        v-model="notificationSettings.system.featureUpdates"
                        class="form-checkbox"
                      />
                      <label for="systemUpdates" class="checkbox-label">
                        Feature Updates
                        <span class="help-text">Learn about new features and improvements</span>
                      </label>
                    </div>
                  </div>

                  <div class="form-actions">
                    <button @click="saveNotificationSettings" class="btn-primary" :disabled="isSaving">
                      <div v-if="isSaving" class="spinner"></div>
                      {{ isSaving ? 'Saving...' : 'Save Preferences' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- System Preferences -->
              <div v-if="activeTab === 'system'" class="settings-section">
                <div class="section-header">
                  <h3>System Preferences</h3>
                  <p>Customize your system interface and behavior</p>
                </div>

                <div class="settings-form">
                  <div class="form-group">
                    <label class="form-label">Theme</label>
                    <select v-model="systemSettings.theme" class="form-input">
                      <option value="light">Light Theme</option>
                      <option value="dark">Dark Theme</option>
                      <option value="auto">Auto (System Default)</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Language</label>
                    <select v-model="systemSettings.language" class="form-input">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Date Format</label>
                    <select v-model="systemSettings.dateFormat" class="form-input">
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Items per Page</label>
                    <select v-model="systemSettings.itemsPerPage" class="form-input">
                      <option value="10">10 items</option>
                      <option value="25">25 items</option>
                      <option value="50">50 items</option>
                      <option value="100">100 items</option>
                    </select>
                  </div>

                  <div class="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="autoSave" 
                      v-model="systemSettings.autoSave"
                      class="form-checkbox"
                    />
                    <label for="autoSave" class="checkbox-label">
                      Auto-save Forms
                      <span class="help-text">Automatically save form data as you type</span>
                    </label>
                  </div>

                  <div class="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="compactView" 
                      v-model="systemSettings.compactView"
                      class="form-checkbox"
                    />
                    <label for="compactView" class="checkbox-label">
                      Compact View
                      <span class="help-text">Show more information in less space</span>
                    </label>
                  </div>

                  <div class="form-actions">
                    <button @click="saveSystemSettings" class="btn-primary" :disabled="isSaving">
                      <div v-if="isSaving" class="spinner"></div>
                      {{ isSaving ? 'Saving...' : 'Save Preferences' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted } from "vue";
import { db, auth } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

export default {
  name: "UserSettings",
  setup() {
    // UI State
    const sidebarOpen = ref(true);
    const activeTab = ref('account');
    const isSaving = ref(false);
    
    // Notification state
    const notification = reactive({
      show: false,
      type: "success",
      message: ""
    });

    // Settings data
    const userSettings = reactive({
      username: "",
      email: "",
      fullName: "",
      department: "",
      phoneNumber: "",
      role: "user"
    });

    const securitySettings = reactive({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFactorEnabled: false,
      autoLogout: true
    });

    const notificationSettings = reactive({
      email: {
        purchaseUpdates: true,
        paymentAlerts: true,
        weeklyReports: false
      },
      system: {
        maintenanceAlerts: true,
        featureUpdates: true
      }
    });

    const systemSettings = reactive({
      theme: "light",
      language: "en",
      dateFormat: "MM/DD/YYYY",
      itemsPerPage: "25",
      autoSave: true,
      compactView: false
    });

    // Settings tabs configuration
    const settingsTabs = [
      {
        key: 'account',
        label: 'Account',
        iconClass: 'user-icon',
        iconPath: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'
      },
      {
        key: 'security',
        label: 'Security',
        iconClass: 'shield-icon',
        iconPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'
      },
      {
        key: 'notifications',
        label: 'Notifications',
        iconClass: 'bell-icon',
        iconPath: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9'
      },
      {
        key: 'system',
        label: 'System',
        iconClass: 'settings-icon',
        iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
      }
    ];

    // Computed properties
    const userInitials = computed(() => {
      const names = userSettings.fullName.split(' ');
      if (names.length >= 2) {
        return names[0].charAt(0) + names[1].charAt(0);
      } else if (names.length === 1) {
        return names[0].substring(0, 2);
      }
      return 'U';
    });

    // Methods
    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
    };

    const showNotification = (type, message) => {
      notification.type = type;
      notification.message = message;
      notification.show = true;
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        notification.show = false;
      }, 5000);
    };

    const closeNotification = () => {
      notification.show = false;
    };

    // Load user settings from Firebase
    const loadSettings = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Update user settings
          Object.assign(userSettings, {
            username: userData.username || user.displayName || "",
            email: userData.email || user.email || "",
            fullName: userData.completeName || "",
            department: userData.department || "",
            phoneNumber: userData.cellphone || "",
            role: userData.role || "user"
          });

          // Update system settings if they exist
          if (userData.systemSettings) {
            Object.assign(systemSettings, userData.systemSettings);
          }

          // Update notification settings if they exist
          if (userData.notificationSettings) {
            Object.assign(notificationSettings, userData.notificationSettings);
          }

          // Update security settings if they exist
          if (userData.securitySettings) {
            securitySettings.twoFactorEnabled = userData.securitySettings.twoFactorEnabled || false;
            securitySettings.autoLogout = userData.securitySettings.autoLogout !== false;
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        showNotification("error", "Failed to load settings");
      }
    };

    // Save account settings
    const saveAccountSettings = async () => {
      isSaving.value = true;
      try {
        const user = auth.currentUser;
        if (!user) {
          showNotification("error", "User not authenticated");
          return;
        }

        await updateDoc(doc(db, "users", user.uid), {
          username: userSettings.username,
          email: userSettings.email,
          completeName: userSettings.fullName,
          department: userSettings.department,
          cellphone: userSettings.phoneNumber,
          updatedAt: new Date()
        });

        showNotification("success", "Account settings saved successfully!");
      } catch (error) {
        console.error("Error saving account settings:", error);
        showNotification("error", "Failed to save account settings");
      } finally {
        isSaving.value = false;
      }
    };

    // Save security settings
    const saveSecuritySettings = async () => {
      // Validate password fields
      if (securitySettings.newPassword && securitySettings.newPassword !== securitySettings.confirmPassword) {
        showNotification("error", "New passwords do not match");
        return;
      }

      isSaving.value = true;
      try {
        const user = auth.currentUser;
        if (!user) {
          showNotification("error", "User not authenticated");
          return;
        }

        // Update password if provided
        if (securitySettings.newPassword && securitySettings.currentPassword) {
          const credential = EmailAuthProvider.credential(user.email, securitySettings.currentPassword);
          await reauthenticateWithCredential(user, credential);
          await updatePassword(user, securitySettings.newPassword);
          
          // Clear password fields
          securitySettings.currentPassword = "";
          securitySettings.newPassword = "";
          securitySettings.confirmPassword = "";
        }

        // Save security preferences
        await updateDoc(doc(db, "users", user.uid), {
          securitySettings: {
            twoFactorEnabled: securitySettings.twoFactorEnabled,
            autoLogout: securitySettings.autoLogout
          },
          updatedAt: new Date()
        });

        showNotification("success", "Security settings updated successfully!");
      } catch (error) {
        console.error("Error saving security settings:", error);
        if (error.code === 'auth/wrong-password') {
          showNotification("error", "Current password is incorrect");
        } else {
          showNotification("error", "Failed to update security settings");
        }
      } finally {
        isSaving.value = false;
      }
    };

    // Save notification settings
    const saveNotificationSettings = async () => {
      isSaving.value = true;
      try {
        const user = auth.currentUser;
        if (!user) {
          showNotification("error", "User not authenticated");
          return;
        }

        await updateDoc(doc(db, "users", user.uid), {
          notificationSettings: notificationSettings,
          updatedAt: new Date()
        });

        showNotification("success", "Notification preferences saved successfully!");
      } catch (error) {
        console.error("Error saving notification settings:", error);
        showNotification("error", "Failed to save notification preferences");
      } finally {
        isSaving.value = false;
      }
    };

    // Save system settings
    const saveSystemSettings = async () => {
      isSaving.value = true;
      try {
        const user = auth.currentUser;
        if (!user) {
          showNotification("error", "User not authenticated");
          return;
        }

        await updateDoc(doc(db, "users", user.uid), {
          systemSettings: systemSettings,
          updatedAt: new Date()
        });

        showNotification("success", "System preferences saved successfully!");
      } catch (error) {
        console.error("Error saving system settings:", error);
        showNotification("error", "Failed to save system preferences");
      } finally {
        isSaving.value = false;
      }
    };

    // Load settings on component mount
    onMounted(() => {
      loadSettings();
    });

    return {
      sidebarOpen,
      activeTab,
      isSaving,
      notification,
      userSettings,
      securitySettings,
      notificationSettings,
      systemSettings,
      settingsTabs,
      userInitials,
      toggleSidebar,
      showNotification,
      closeNotification,
      saveAccountSettings,
      saveSecuritySettings,
      saveNotificationSettings,
      saveSystemSettings
    };
  }
};
</script>

<style scoped>
/* Main App Container */
.app-container {
  display: flex;
  height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
}

/* Background Pattern */
.background-pattern {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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
  background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
  opacity: 0.2;
}

/* Sidebar Styles */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  background-color: #0e2235;
  color: white;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s cubic-bezier(.4,0,.2,1);
  scrollbar-width: thin;
  scrollbar-color: #22334a transparent;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #22334a;
  border-radius: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-open {
  transform: translateX(0);
}

.sidebar-closed {
  transform: translateX(-100%);
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 999;
  transition: opacity 0.3s;
}

.sidebar-toggle-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1100;
  background: #22334a;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* User Profile Section */
.user-profile {
  padding: 24px;
  border-bottom: 1px solid #2d4a6b;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  background-color: #4a90e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-weight: bold;
  font-size: 18px;
  color: white;
}

.user-info {
  flex: 1;
}

.username {
  font-weight: 600;
  font-size: 16px;
  color: white;
  margin-bottom: 2px;
}

.user-role {
  font-size: 14px;
  color: #94a3b8;
}

/* Navigation Menu */
.nav-menu {
  padding: 16px 0;
}

.nav-section {
  margin-bottom: 32px;
}

.section-header {
  padding: 0 24px 12px;
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  background-color: #2d4a6b;
  color: white;
}

.nav-link.active {
  background-color: #2d4a6b;
  color: white;
  border-right: 3px solid #4a90e2;
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
}

/* Main Content Area */
.main-content {
  flex: 1;
  position: relative;
  overflow-y: auto;
  transition: margin-left 0.3s cubic-bezier(.4,0,.2,1);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.main-content::-webkit-scrollbar {
  display: none;
}

.content-wrapper {
  padding: 24px;
  min-height: 100vh;
}

/* Settings Card */
.settings-card {
  width: 100%;
  max-width: 1200px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
  margin: 0 auto;
}

.card-header {
  background: linear-gradient(135deg, #0f2942 0%, #102a42 100%);
  padding: 30px;
  color: white;
}

.header-flex {
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo-container {
  flex-shrink: 0;
}

.logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
}

.header-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
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

/* Notification */
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  max-width: 400px;
  min-width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background-color: #ebf8ff;
  border-left: 4px solid #3182ce;
}

.notification.error {
  background-color: #fff5f5;
  border-left: 4px solid #e53e3e;
}

.notification-content {
  display: flex;
  align-items: center;
  padding: 16px;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
}

.notification-icon.success {
  background-color: #bee3f8;
  color: #2b6cb0;
}

.notification-icon.error {
  background-color: #fed7d7;
  color: #c53030;
}

.notification p {
  flex: 1;
  margin: 0;
  color: #2d3748;
  font-size: 14px;
}

.notification-close {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  background-color: #edf2f7;
}

.notification-close:hover {
  background-color: #e2e8f0;
}

/* Settings Navigation */
.settings-nav {
  display: flex;
  gap: 4px;
  margin-bottom: 32px;
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.settings-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.settings-tab:hover {
  color: #0f2942;
  background-color: #f8fafc;
}

.settings-tab.active {
  color: #0f2942;
  border-bottom-color: #0f2942;
}

/* Settings Content */
.settings-content {
  min-height: 400px;
}

.settings-section {
  animation: fadeIn 0.3s ease-in-out;
}

.section-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f2942;
  margin-bottom: 8px;
}

.section-header p {
  color: #64748b;
  font-size: 14px;
}

/* Form Styles */
.settings-form {
  max-width: 800px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #2d3748;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #3182ce;
  outline: none;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.form-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.form-checkbox:checked {
  background-color: #0f2942;
  border-color: #0f2942;
}

.checkbox-label {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #2d3748;
}

.help-text {
  font-size: 12px;
  color: #64748b;
  font-weight: 400;
  margin-top: 4px;
}

.notification-group {
  margin-bottom: 32px;
  padding: 20px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.notification-group h4 {
  font-size: 16px;
  font-weight: 600;
  color: #0f2942;
  margin-bottom: 16px;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.btn-primary {
  background-color: #0f2942;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;
}

.btn-primary:hover {
  background-color: #1a4971;
}

.btn-primary:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0 !important;
  }

  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar-open {
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 16px;
  }
  
  .settings-nav {
    flex-direction: column;
    gap: 0;
  }
  
  .settings-tab {
    padding: 16px 20px;
    border-bottom: 1px solid #e2e8f0;
    border-right: none;
  }
  
  .settings-tab.active {
    border-bottom-color: #e2e8f0;
    border-left: 3px solid #0f2942;
    background-color: #f8fafc;
  }
  
  .settings-form {
    max-width: none;
  }
  
  .checkbox-group {
    align-items: flex-start;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-primary {
    width: 100%;
  }
}
</style>