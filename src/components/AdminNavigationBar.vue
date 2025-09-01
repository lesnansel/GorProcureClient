<template>
  <div>
    <!-- Toggle button that's always visible -->
    <button 
      class="sidebar-toggle-btn"
      @click="toggleSidebar"
      aria-label="Toggle sidebar"
      :class="{ 'sidebar-toggle-collapsed': !sidebarVisible }"
    >
      <!-- Animated Hamburger/X Icon -->
      <span class="toggle-icon" :class="{ open: !sidebarVisible }">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </button>

    <!-- Sidebar -->
    <div class="sidebar" :class="{ 'sidebar-hidden': !sidebarVisible }">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <div class="logo-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="logo-icon"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </div>
          <span class="sidebar-logo-text">GovProcure</span>
        </div>
      </div>

      <div class="sidebar-user">
        <div class="sidebar-user-avatar">
          <div class="user-initials">JD</div>
        </div>
        <div class="sidebar-user-info">
          <span class="sidebar-user-name">Admin User</span>
          <span class="sidebar-user-role">System Administrator</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <ul class="sidebar-menu">
          <li class="sidebar-menu-item">
            <router-link to="/admin-dashboard" class="sidebar-menu-link" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span>Dashboard</span>
            </router-link>
          </li>
          <li class="sidebar-menu-item">
            <router-link to="/admin-management" class="sidebar-menu-link" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
              <span>Admin Management</span>
            </router-link>
          </li>
          <li class="sidebar-menu-item">
            <router-link to="/procurement-plan" class="sidebar-menu-link" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <span>Purchase Requests</span>
            </router-link>
          </li>
          <li class="sidebar-menu-item">
            <router-link to="/invitation-to-bid" class="sidebar-menu-link" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span>Invitation to Bid</span>
            </router-link>
          </li>
          <li class="sidebar-menu-item">
            <router-link to="/admin-bid-review" class="sidebar-menu-link" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              <span>Bid Review</span>
            </router-link>
          </li>
          <li class="sidebar-menu-item">
            <router-link to="/evaluate-bids" class="sidebar-menu-link" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>Evaluate Bids</span>
            </router-link>
          </li>
          <li class="sidebar-menu-item">
            <router-link to="/post-qualification" class="sidebar-menu-link" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>Post Qualification</span>
            </router-link>
          </li>
          <li class="sidebar-menu-item">
            <router-link to="/contract-management" class="sidebar-menu-link" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
              <span>Contract Management</span>
            </router-link>
          </li>
          <li class="sidebar-menu-item">
            <router-link to="/payment-processing" class="sidebar-menu-link" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 10h18"></path>
                <path d="M3 6h18"></path>
                <path d="M3 14h18"></path>
                <path d="M3 18h18"></path>
              </svg>
              <span>Payment Processing</span>
            </router-link>
          </li>
          <li class="sidebar-menu-item">
            <router-link to="/records" class="sidebar-menu-link" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
              <span>Records</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
  <button class="sidebar-logout-btn" @click="showLogoutModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span>Logout</span>
        </button>
    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to logout?</p>
        <div class="modal-actions">
          <button class="modal-btn confirm" @click="confirmLogout">Yes, Logout</button>
          <button class="modal-btn cancel" @click="showLogoutModal = false">Cancel</button>
        </div>
      </div>
    </div>
      </div>
    </div>

    <!-- Removed Logout Confirmation Modal -->
  </div>
</template>

<script>
export default {
  name: "AdminNavigationBar",
  data() {
    return {
      defaultAvatar: "https://via.placeholder.com/150",
      sidebarVisible: true,
      showLogoutModal: false,
    };
  },
  methods: {
    confirmLogout() {
      this.showLogoutModal = false;
      this.handleLogout();
    },
    handleLogout() {
      // Clear user session or token
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      // Redirect to login page
      this.$router.push('/login');
    },
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
      this.$emit('sidebar-toggle', this.sidebarVisible);
      localStorage.setItem('sidebarVisible', this.sidebarVisible);
      // Adjust main content layout
      const mainContent = document.querySelector(".main-content");
      if (mainContent) {
        mainContent.classList.toggle("collapsed", !this.sidebarVisible);
      }
    },
  },
  mounted() {
    const savedState = localStorage.getItem('sidebarVisible');
    if (savedState !== null) {
      this.sidebarVisible = savedState === 'true';
    }

    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.classList.toggle("collapsed", !this.sidebarVisible);
    }

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        this.toggleSidebar();
      }
    });
  }
};
</script>

<style scoped>
/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: #fff;
  padding: 32px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
  text-align: center;
  max-width: 400px;
  width: 100%;
}
.modal-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 12px;
}
.modal-content p {
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 18px;
}
.modal-actions {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 16px;
}
.modal-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-btn.confirm {
  background: #e53e3e;
  color: #fff;
}
.modal-btn.confirm:hover {
  background: #c53030;
}
.modal-btn.cancel {
  background: #edf2f7;
  color: #2d3748;
}
.modal-btn.cancel:hover {
  background: #e2e8f0;
}
.sidebar {
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 100vh;
  background-color: #0c2340;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.sidebar-hidden {
  transform: translateX(-100%);
  box-shadow: none;
}

.sidebar-toggle-btn {
  position: fixed;
  top: 20px;
  left: 10px;
  z-index: 200;
  background: transparent;
  border: none;
  color: #fff;
  padding: 8px 10px;
  border-radius: 8px;
  background-color: rgba(30, 58, 92, 0.85);
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
  cursor: pointer;
  outline: none;
}

.sidebar-toggle-btn:hover {
  background-color: rgba(30, 58, 92, 1);
  transform: scale(1.05);
}

.sidebar-toggle-btn:hover::after {
  content: "Toggle Sidebar";
  position: absolute;
  left: 110%;
  top: 50%;
  transform: translateY(-50%);
  background-color: #333;
  padding: 5px 8px;
  color: white;
  border-radius: 4px;
  white-space: nowrap;
  font-size: 12px;
  pointer-events: none;
  opacity: 0.95;
}

.toggle-icon {
  display: inline-block;
  width: 24px;
  height: 20px;
  position: relative;
  transition: all 0.3s;
}

.toggle-icon span {
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  background: #fff;
  border-radius: 2px;
  opacity: 1;
  left: 0;
  transition: all 0.3s;
}

.toggle-icon span:nth-child(1) {
  top: 0;
}

.toggle-icon span:nth-child(2) {
  top: 8.5px;
}

.toggle-icon span:nth-child(3) {
  top: 17px;
}

.toggle-icon.open span:nth-child(1) {
  top: 8.5px;
  transform: rotate(45deg);
}

.toggle-icon.open span:nth-child(2) {
  opacity: 0;
}

.toggle-icon.open span:nth-child(3) {
  top: 8.5px;
  transform: rotate(-45deg);
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: transparent;
  border: 2px solid #4a9fff;
  color: #4a9fff;
}

.logo-icon {
  width: 20px;
  height: 20px;
}

.sidebar-logo-text {
  font-size: 22px;
  font-weight: 600;
  color: white;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #0a1c30;
}

.sidebar-user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: #1e3a5c;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-initials {
  font-size: 18px;
  font-weight: 500;
}

.sidebar-user-info {
  display: flex;
  flex-direction: column;
}

.sidebar-user-name {
  font-size: 16px;
  font-weight: 500;
}

.sidebar-user-role {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu-item {
  margin: 2px 0;
}

.sidebar-menu-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: white;
  text-decoration: none;
  transition: background-color 0.2s;
}

.sidebar-menu-link:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.sidebar-menu-link.active {
  background-color: rgba(255, 255, 255, 0.1);
  border-left: 3px solid #4a9fff;
}

.sidebar-menu-link svg {
  min-width: 20px;
  color: rgba(255, 255, 255, 0.8);
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sidebar-logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

/* Custom scrollbar for the sidebar */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

/* Add margin to the main content to accommodate the sidebar */
:deep(main) {
  margin-left: 280px;
  transition: margin-left 0.3s ease;
}

:deep(body.sidebar-hidden main) {
  margin-left: 0;
}

@media (max-width: 768px) {
  .sidebar {
    width: 260px;
  }
  
  :deep(main) {
    margin-left: 0;
  }
  
  .sidebar-toggle-btn {
    left: 10px;
  }
}
</style>