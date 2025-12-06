<template>
  <div class="dashboard-layout" :class="{'sidebar-open': sidebarOpen}">
    <!-- Sidebar -->
    <div class="sidebar-container" :class="{ 'sidebar-open': sidebarOpen }">
      <button class="sidebar-toggle" @click="toggleSidebar">
        <svg v-if="sidebarOpen" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
      
      <div class="sidebar">
        <div class="sidebar-profile">
          <div class="sidebar-avatar">
            <img 
              :src="profileImage || defaultAvatar" 
              :alt="`${username}'s avatar`"
              @error="handleImageError"
            />
            <span class="status-badge" :class="role">{{ role }}</span>
          </div>
          <div class="sidebar-user-info">
            <h3>{{ username }}</h3>
            <p>{{ role }}</p>
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <div v-for="(section, index) in navigationSections" :key="index" class="nav-section">
            <h4 class="section-title">{{ section.title }}</h4>
            <ul class="nav-links">
              <li v-for="route in getFilteredRoutes(section.routes)" :key="route.path">
                <router-link 
                  :to="route.path" 
                  class="nav-link"
                  :class="{ 'active': currentRoute === route.path }"
                >
                  <svg v-if="getIconForRoute(route)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="getIconForRoute(route)"></svg>
                  <span>{{ route.name }}</span>
                </router-link>
              </li>
            </ul>
          </div>
        </nav>
        
        <div class="sidebar-footer">
          <router-link to="/profile-display" class="sidebar-action">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>View Profile</span>
          </router-link>
          <router-link to="/settings" class="sidebar-action">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span>Settings</span>
          </router-link>
          <button @click="confirmLogout" class="sidebar-action danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span>Log Out</span>
          </button>
        </div>
      </div>
      
      <div 
        class="sidebar-overlay" 
        :class="{ 'overlay-visible': sidebarOpen }" 
        @click="toggleSidebar"
      ></div>
    </div>

    <!-- Main Dashboard Content -->
    <div class="dashboard-wrapper">
      <!-- Background Pattern -->
      <div class="background-pattern">
        <div class="pattern-overlay"></div>
      </div>

      <!-- Dashboard Card -->
      <div class="dashboard-card">
        <!-- Header with gradient overlay and stats -->
        <div class="card-header">
          <div class="header-content" style="position: relative;">
            <div class="logo-container">
              <img src="@/assets/proculogo.png" alt="Procurement System Logo" class="logo" />
            </div>
            <div class="header-text">
              <h1 class="title">User Dashboard</h1>
              <p class="subtitle">Manage your account and procurement activities</p>
            </div>
            <!-- Notification Bell Icon -->
            <button class="notif-bell-btn" @click="showNotificationsModal = true" aria-label="Notifications">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="notif-bell-icon"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span v-if="unreadCount > 0" class="notif-dot"></span>
            </button>
          </div>
          
          <!-- Stats Overview -->
          <div class="stats-overview">
            <div class="stat-item">
              <div class="stat-value">{{ loginCount }}</div>
              <div class="stat-label">Total Logins</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ daysActive }}</div>
              <div class="stat-label">Days Active</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ profileCompletion }}%</div>
              <div class="stat-label">Profile Complete</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ pendingRequests }}</div>
              <div class="stat-label">Pending Requests</div>
            </div>
          </div>
        </div>

        <div class="card-content">
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="loading-icon"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
            </div>
            <p>Loading dashboard...</p>
          </div>

          <template v-else>
            <!-- User Welcome Section -->
            <div class="welcome-section">
              <div class="welcome-content">
                <div class="welcome-text-container">
                  <h2 class="welcome-text">Welcome back, {{ username }}!</h2>
                  <p class="last-login">Last login: {{ formatDate(lastLogin) }}</p>
                </div>
                <div class="user-avatar">
                  <img 
                    :src="profileImage || defaultAvatar" 
                    :alt="`${username}'s avatar`"
                    @error="handleImageError"
                  />
                  <span class="role-badge" :class="role">
                    {{ role }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions-section">
              <h3 class="section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Quick Actions
              </h3>
              <div class="quick-actions-grid">
                <div class="action-card" @click="navigateTo('purchase-requests')">
                  <div class="action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                  <h4>Purchase Requests</h4>
                  <p>Create and manage purchase requests</p>
                </div>
                <div class="action-card" @click="navigateTo('payment-tracking')">
                  <div class="action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  </div>
                  <h4>Track Payments</h4>
                  <p>View payment status and history</p>
                </div>
                <div class="action-card" @click="navigateTo('approved-purchases')">
                  <div class="action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <h4>PR Lists</h4>
                  <p>View approved purchase requests</p>
                </div>
                <div class="action-card" @click="navigateTo('profile-display')">
                  <div class="action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <h4>My Profile</h4>
                  <p>View and edit your profile</p>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="recent-activity-section">
              <h3 class="section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                Recent Activity
              </h3>
              <div class="activity-timeline">
                <div v-if="recentActivities.length === 0" class="empty-activity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  <p>No recent activity found</p>
                </div>
                <div v-else class="activity-list">
                  <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
                    <div class="activity-icon" :class="activity.type">
                      <svg v-if="activity.type === 'login'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                      <svg v-else-if="activity.type === 'request'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      <svg v-else-if="activity.type === 'profile'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div class="activity-content">
                      <p class="activity-text">{{ activity.description }}</p>
                      <span class="activity-time">{{ formatDate(activity.timestamp) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Admin Section -->
            <div v-if="role === 'admin'" class="admin-section">
              <h3 class="section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                Admin Controls
              </h3>
              <div class="admin-actions">
                <router-link to="/admin-dashboard" class="admin-action-card">
                  <div class="admin-action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  </div>
                  <div class="admin-action-content">
                    <h4>Admin Dashboard</h4>
                    <p>Access system controls and analytics</p>
                  </div>
                </router-link>
                <router-link to="/admin-management" class="admin-action-card">
                  <div class="admin-action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </div>
                  <div class="admin-action-content">
                    <h4>User Management</h4>
                    <p>Manage system users and permissions</p>
                  </div>
                </router-link>
                <router-link to="/system-logs" class="admin-action-card">
                  <div class="admin-action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                  </div>
                  <div class="admin-action-content">
                    <h4>System Logs</h4>
                    <p>View system activity and audit logs</p>
                  </div>
                </router-link>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Notifications Modal -->
   <div
  v-if="showNotificationsModal"
  class="modal-overlay"
  @click="showNotificationsModal = false"
>
  <div class="modal-content notifications-modal" @click.stop>
    <div class="notifications-modal-header">
      <div class="notifications-header-left">
        <div class="notifications-header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>
        <div class="notifications-header-text">
          <h3>Notifications</h3>
          <span v-if="unreadCount > 0" class="notifications-count">{{ unreadCount }} unread</span>
        </div>
      </div>
      <button class="notifications-close-btn" @click="showNotificationsModal = false">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <div class="notifications-modal-body">
      <div v-if="notifications.length === 0" class="notifications-empty-state">
        <div class="notifications-empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>
        <div class="notifications-empty-text">
          <h4>All caught up!</h4>
          <p>You have no new notifications at the moment. We'll let you know when there's something important.</p>
        </div>
      </div>
      <div v-else class="notifications-list">
        <div
          v-for="notif in notifications"
          :key="notif.id"
          class="notification-card"
          :class="{ 'notification-unread': !notif.read }"
        >
          <div class="notification-indicator">
            <div class="notification-status-dot" :class="{ 'dot-unread': !notif.read }"></div>
          </div>
          <div class="notification-icon-wrapper">
            <div class="notification-type-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
          </div>
          <div class="notification-content-wrapper">
            <div class="notification-message-text">{{ notif.message }}</div>
            <div class="notification-timestamp">{{ formatDate(notif.timestamp) }}</div>
          </div>
          <div v-if="!notif.read" class="notification-actions-wrapper">
            <button @click="notif.read = true" class="notification-mark-read" title="Mark as read">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="notifications.length > 0" class="notifications-modal-footer">
      <button 
        @click="notifications.forEach(n => n.read = true)" 
        class="notifications-mark-all-read"
        :disabled="unreadCount === 0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6 9 17l-5-5"></path>
        </svg>
        Mark all as read
      </button>
    </div>
  </div>
</div>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutModal" class="modal-overlay" @click="showLogoutModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Confirm Logout</h3>
          <button class="close-btn" @click="showLogoutModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to log out?</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showLogoutModal = false">Cancel</button>
          <button class="confirm-btn" @click="logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import {
  doc, getDoc, updateDoc, onSnapshot, Timestamp,
  collection, query, orderBy, limit, getDocs, addDoc
} from "firebase/firestore";
import { db } from "../firebase";

export default {
  setup() {
    // Core state
    const username = ref("User");
    const role = ref("");
    const profileImage = ref("");
    const loading = ref(true);
    const lastLogin = ref(new Date());
    const loginCount = ref(0);
    const daysActive = ref(0);
    const profileCompletion = ref(0);
    const pendingRequests = ref(0);
    const showLogoutModal = ref(false);
    const showNotificationsModal = ref(false);
    const sidebarOpen = ref(false);
    const defaultAvatar = "https://ui-avatars.com/api/?background=0F2942&color=fff";
    const recentActivities = ref([]);

    // Notifications
    const notifications = ref([]);
    const unreadCount = computed(() => notifications.value.filter(n => !n.read).length);

    const router = useRouter();
    const route = useRoute();
    const auth = getAuth();
    const currentRoute = computed(() => route.path);

    // Routes and permissions
    const routes = [
      { path: '/', name: 'Home', icon: 'home' },
      { path: '/register', name: 'Register', icon: 'user-plus' },
      { path: '/login', name: 'Login', icon: 'log-in' },
      { path: '/edit-profile', name: 'Edit Profile', icon: 'user-edit', meta: { requiresAuth: true, role: 'user' } },
      { path: '/dashboard', name: 'Dashboard', icon: 'layout', meta: { requiresAuth: true } },
      { path: '/profile-display', name: 'Profile', icon: 'user', meta: { requiresAuth: true, role: 'user' } },
      { path: '/admin-dashboard', name: 'Admin Dashboard', icon: 'shield', meta: { requiresAuth: true, role: 'admin' } },
      { path: '/reset-password', name: 'Reset Password', icon: 'key' },
      { path: "/admin-management", name: "Admin Management", icon: 'users', meta: { requiresAuth: true, role: "admin" } },
      { path: '/settings', name: 'Settings', icon: 'settings', meta: { requiresAuth: true } },
      { path: '/purchase-requests', name: 'Request Purchase', icon: 'file-text', meta: { requiresAuth: true } },
      { path: '/track-payments', name: 'Track Payments', icon: 'dollar-sign', meta: { requiresAuth: true } },
      { path: '/approved-purchases', name: 'PR Lists', icon: 'check-circle', meta: { requiresAuth: true } },
    ];

    const navigationSections = computed(() => [
      {
        title: 'General',
        routes: routes.filter(r => ['/', '/dashboard', '/profile-display'].includes(r.path))
      },
      {
        title: 'Procurement',
        routes: routes.filter(r => ['/purchase-requests', '/track-payments', '/approved-purchases'].includes(r.path))
      },
      {
        title: 'User Management',
        routes: routes.filter(r => ['/edit-profile', '/reset-password'].includes(r.path))
      },
      {
        title: 'Admin Controls',
        routes: routes.filter(r => ['/admin-dashboard', '/admin-management', '/system-logs'].includes(r.path))
      }
    ]);

    // Helpers
    const shouldShowRoute = (route) => {
      if (['/login', '/register'].includes(route.path)) return false;
      if (route.meta?.requiresAuth && route.meta.role && route.meta.role !== role.value) return false;
      return true;
    };

    const getIconForRoute = (route) => {
      const iconMap = {
        '/': 'home', '/dashboard': 'layout', '/profile-display': 'user', '/edit-profile': 'edit',
        '/reset-password': 'key', '/admin-dashboard': 'shield', '/admin-management': 'users',
        '/purchase-requests': 'file-text', '/track-payments': 'dollar-sign',
        '/approved-purchases': 'check-circle', '/system-logs': 'list', '/settings': 'settings'
      };
      return iconMap[route.path];
    };

    const getDateFromTimestamp = (timestamp) => {
      if (timestamp instanceof Timestamp) return timestamp.toDate();
      if (timestamp && timestamp.seconds) return new Date(timestamp.seconds * 1000);
      if (typeof timestamp === 'string' || typeof timestamp === 'number') return new Date(timestamp);
      if (timestamp instanceof Date) return timestamp;
      return new Date();
    };

    const formatDate = (timestamp) => {
      const dateObj = getDateFromTimestamp(timestamp);
      return isNaN(dateObj) ? '—' : dateObj.toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
      });
    };

    const calculateProfileCompletion = (userData) => {
      const requiredFields = ['username', 'email', 'completeName', 'age', 'birthday', 'cellphone', 'gender', 'address'];
      return Math.round((requiredFields.filter(field => userData[field]).length / requiredFields.length) * 100);
    };

    const updateUserData = async (userDoc) => {
      if (!userDoc) return;
      const userData = userDoc.data();
      username.value = userData.username || auth.currentUser?.displayName || "User";
      role.value = userData.role || "user";
      profileImage.value = userData.profileImageUrl;
      lastLogin.value = getDateFromTimestamp(userData.lastLogin);
      loginCount.value = userData.loginCount || 0;
      daysActive.value = Math.ceil((Date.now() - getDateFromTimestamp(userData.createdAt)) / (1000 * 60 * 60 * 24));
      profileCompletion.value = calculateProfileCompletion(userData);
      fetchPendingRequests(userDoc.id);
      fetchRecentActivities(userDoc.id);
      fetchPRNotifications(userDoc.id);
    };

    const fetchPendingRequests = async (userId) => {
      try {
        const q = query(collection(db, "purchaseRequests"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const requests = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(req => req.userId === userId && req.status === "pending");
        pendingRequests.value = requests.length;
      } catch (err) {
        console.error("Error fetching pending requests:", err);
        pendingRequests.value = 0;
      }
    };

    const fetchRecentActivities = async (userId) => {
      try {
        const q = query(collection(db, "userActivities"), orderBy("timestamp", "desc"), limit(5));
        const snapshot = await getDocs(q);
        recentActivities.value = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(act => act.userId === userId);
      } catch (err) {
        console.error("Error fetching activities:", err);
      }
    };

    const fetchPRNotifications = async (userId) => {
      const q = query(collection(db, "purchaseRequests"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const currentPRs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(req => req.userId === userId);

      const lastSeenStatus = JSON.parse(localStorage.getItem('prStatuses') || '{}');
      const storedNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.value = storedNotifs;

      const newNotifs = [];

      for (const req of currentPRs) {
        const prevStatus = lastSeenStatus[req.id];
        if (prevStatus && prevStatus !== req.status) {
          newNotifs.push({
            id: `${req.id}_${Date.now()}`,
            message: `PR "${req.description || 'No description'}" status changed: ${prevStatus} → ${req.status}`,
            timestamp: req.updatedAt || new Date(),
            read: false
          });
          
        }
        lastSeenStatus[req.id] = req.status;
      }

      notifications.value.push(...newNotifs);
      localStorage.setItem('prStatuses', JSON.stringify(lastSeenStatus));
    };

    watch(notifications, (newVal) => {
      localStorage.setItem('notifications', JSON.stringify(newVal));
    }, { deep: true });

    const confirmLogout = () => {
      showLogoutModal.value = true;
    };

    const logout = async () => {
      sessionStorage.removeItem('lastSessionTime');
      await signOut(auth);
      router.push('/login');
    };

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
      document.body.style.overflow = sidebarOpen.value ? 'hidden' : '';
    };

    const handleImageError = (e) => {
      e.target.src = defaultAvatar;
    };

    const navigateTo = (route) => {
      router.push(`/${route}`);
    };

    const isNewSession = () => {
      const last = sessionStorage.getItem('lastSessionTime');
      if (!last) {
        sessionStorage.setItem('lastSessionTime', Date.now().toString());
        return true;
      }
      return false;
    };

    const setupUserListener = (userId) => {
      const userRef = doc(db, "users", userId);
      return onSnapshot(userRef, (doc) => {
        if (doc.exists()) updateUserData(doc);
      });
    };

    watch(currentRoute, () => {
      if (window.innerWidth < 768) {
        sidebarOpen.value = false;
        document.body.style.overflow = '';
      }
    });

    let unsubUser = null;
    let unsubAuth = null;

    onMounted(() => {
      unsubAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          if (unsubUser) unsubUser();
          unsubUser = setupUserListener(user.uid);

          if (isNewSession()) {
            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);
            if (snap.exists()) {
              const data = snap.data();
              await updateDoc(userRef, {
                lastLogin: Timestamp.now(),
                loginCount: (data.loginCount || 0) + 1
              });

              await addDoc(collection(db, "userActivities"), {
                userId: user.uid,
                type: "login",
                description: "User logged in",
                timestamp: Timestamp.now()
              });
            }
          }
        } else {
          router.push('/login');
        }
        loading.value = false;
      });

      sidebarOpen.value = localStorage.getItem('sidebarOpen') === 'true';
    });

    onBeforeUnmount(() => {
      if (unsubUser) unsubUser();
      if (unsubAuth) unsubAuth();
    });

    watch(sidebarOpen, val => {
      localStorage.setItem('sidebarOpen', val);
    });

    return {
      username,
      role,
      profileImage,
      loading,
      lastLogin,
      loginCount,
      daysActive,
      profileCompletion,
      pendingRequests,
      showLogoutModal,
      showNotificationsModal,
      notifications,
      unreadCount,
      sidebarOpen,
      defaultAvatar,
      recentActivities,
      currentRoute,
      navigationSections,
      getFilteredRoutes: (routes) => routes.filter(shouldShowRoute),
      getIconForRoute,
      toggleSidebar,
      handleImageError,
      formatDate,
      confirmLogout,
      logout,
      navigateTo,
      shouldShowRoute
    };
  }
  
};
</script>

<style scoped>
/* Notification Bell Red Dot */
.notif-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 10px;
  height: 10px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid #fff;
  z-index: 3;
}

/* Notification List Styles */
.notif-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.notif-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}
.notif-item.unread .notif-message {
  background-color: #f5f7ff;
  font-weight: 600;
  color: #ef4444;
}
.notif-message {
  font-size: 1rem;
}
.notif-time {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 2px;
}
/* Notification Bell Styles */
.notif-bell-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 2;
}
.notif-bell-icon {
  color: #fff;
  transition: color 0.2s;
}
.notif-bell-btn:hover .notif-bell-icon {
  color: #2563eb;
}
/* Layout */
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Sidebar Styles */
.sidebar-container {
  height: 100%;
  position: relative;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background: rgba(15, 41, 66, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.sidebar-open .sidebar {
  transform: translateX(0);
}

.sidebar-toggle {
  position: absolute;
  top: 10px;
  right: -40px;
  width: 40px;
  height: 40px;
  background: #0f2942;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 101;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.sidebar-toggle:hover {
  background: #1a4971;
}

.sidebar-profile {
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-avatar {
  position: relative;
  display: inline-block;
  margin-bottom: 12px;
}

.sidebar-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.status-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 4px 6px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.admin {
  background-color: rgba(229, 62, 62, 0.2);
  color: #e53e3e;
}

.status-badge.user {
  background-color: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.sidebar-user-info h3 {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.sidebar-user-info p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}

.sidebar-nav {
  flex-grow: 1;
  overflow-y: auto;
  padding: 12px 0;
}

.nav-section {
  margin-bottom: 16px;
}

.nav-section .section-title {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 500;
  padding: 8px 24px;
  text-transform: uppercase;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-links li {
  margin-bottom: 2px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 10px 24px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-link svg {
  margin-right: 12px;
  width: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

.nav-link span {
  font-size: 0.9rem;
}

.nav-link:hover,
.nav-link.active {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav-link.active svg {
  color: white;
}

.sidebar-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-action {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  background-color: rgba(255, 255, 255, 0.05);
  text-decoration: none;
  transition: background-color 0.3s ease;
  border: none;
  cursor: pointer;
  text-align: left;
}

.sidebar-action:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-action svg {
  color: rgba(255, 255, 255, 0.6);
}

.sidebar-action.danger {
  background-color: rgba(229, 62, 62, 0.1);
  color: #e53e3e;
}

.sidebar-action.danger:hover {
  background-color: rgba(229, 62, 62, 0.2);
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.sidebar-open .sidebar-overlay {
  opacity: 1;
  visibility: visible;
}

/* Dashboard Styles */
.dashboard-wrapper {
  flex: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: margin-left 0.3s ease, width 0.3s ease;
  max-width: 100%; /* Ensure it uses full available width */
}

/* When sidebar is open on larger screens, adjust main content */
@media (min-width: 1024px) {
  .sidebar-open .dashboard-wrapper {
    margin-left: 280px;
    width: calc(100% - 280px);
  }
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
.dashboard-card {
  width: 100%;
  max-width: 140085px; /* Increased from 1000px to 1400px */
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
}

/* Card Header with Stats */
.card-header {
  background: linear-gradient(135deg, #0f2942 0%, #102a42 100%);
  padding: 30px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
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
  flex: 1;
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

/* Stats Overview */
.stats-overview {
  display: flex;
  gap: 24px; /* Increased from 20px to 24px */
  flex-wrap: wrap;
  justify-content: space-between; /* Better distribution */
}

.stat-item {
  flex: 1;
  min-width: 140px; /* Increased from 120px to 140px */
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 18px 15px; /* Increased top/bottom padding */
  text-align: center;
  backdrop-filter: blur(10px);
  transition: transform 0.2s;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.card-content {
  padding: 40px; /* Increased from 30px to 40px */
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

.loading-spinner {
  margin-bottom: 16px;
}

.loading-icon {
  animation: spin 2s linear infinite;
  color: #2563eb;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Welcome Section */
.welcome-section {
  margin-bottom: 40px; /* Increased from 32px to 40px */
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 32px; /* Increased from 24px to 32px */
  border: 1px solid #e2e8f0;
}

.welcome-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.welcome-text-container {
  flex: 1;
}

.user-avatar {
  position: relative;
  display: inline-block;
}

.user-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid rgba(15, 41, 66, 0.1);
  object-fit: cover;
}

.role-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.role-badge.admin {
  background-color: rgba(229, 62, 62, 0.1);
  color: #e53e3e;
  border: 1px solid rgba(229, 62, 62, 0.2);
}

.role-badge.user {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.welcome-text {
  color: #0f2942;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.last-login {
  color: #64748b;
  font-size: 0.9rem;
}

/* Quick Actions Section */
.quick-actions-section {
  margin-bottom: 32px;
}

.section-title {
  color: #0f2942;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  color: #0f2942;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Increased from 200px to 250px */
  gap: 20px; /* Increased gap from 16px to 20px */
}

.action-card {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  background-color: #f1f5f9;
}

.action-icon {
  background-color: rgba(15, 41, 66, 0.1);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.action-icon svg {
  color: #0f2942;
}

.action-card h4 {
  color: #0f2942;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.action-card p {
  color: #64748b;
  font-size: 0.85rem;
}

/* Recent Activity Section */
.recent-activity-section {
  margin-bottom: 32px;
}

.activity-timeline {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.empty-activity {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #64748b;
}

.empty-activity svg {
  color: #94a3b8;
  margin-bottom: 16px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.activity-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.login {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.activity-icon.request {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.activity-icon.profile {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: #334155;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.activity-time {
  color: #94a3b8;
  font-size: 0.8rem;
}

/* Admin Section */
.admin-section {
  margin-bottom: 32px;
}

.admin-actions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); /* Increased from 300px to 350px */
  gap: 20px; /* Increased gap from 16px to 20px */
}

.admin-action-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.admin-action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  background-color: #f1f5f9;
}

.admin-action-icon {
  background-color: rgba(15, 41, 66, 0.1);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.admin-action-icon svg {
  color: #0f2942;
}

.admin-action-content {
  flex: 1;
}

.admin-action-content h4 {
  color: #0f2942;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.admin-action-content p {
  color: #64748b;
  font-size: 0.85rem;
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
  display: flex;
  flex-direction: column;
  max-height: 80vh; /* Prevents going beyond screen height */
}

.scrollable-body {
  overflow-y: auto;
  flex: 1;
  padding: 1rem;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  color: #0f2942;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background-color: #f1f5f9;
  color: #0f2942;
}

.modal-body {
  padding: 20px;
  color: #334155;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn {
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #64748b;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #e2e8f0;
  color: #334155;
}

.confirm-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.confirm-btn:hover {
  background-color: #dc2626;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced Notification Modal Styles */
.notifications-modal {
  max-width: 520px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.notifications-modal-header {
  background: linear-gradient(135deg, #0f2942 0%, #1a4971 100%);
  color: white;
  padding: 24px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: none;
}

.notifications-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notifications-header-icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.notifications-header-icon svg {
  color: white;
}

.notifications-header-text h3 {
  color: white;
  font-size: 1.375rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  letter-spacing: -0.025em;
}

.notifications-count {
  background: rgba(239, 68, 68, 0.9);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 12px;
  letter-spacing: 0.025em;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
}

.notifications-close-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.notifications-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.notifications-close-btn svg {
  color: white;
}

.notifications-modal-body {
  flex: 1;
  overflow-y: auto;
  background: #fafbfc;
  max-height: 60vh;
}

.notifications-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 32px;
  text-align: center;
}

.notifications-empty-icon {
  margin-bottom: 24px;
  opacity: 0.4;
}

.notifications-empty-icon svg {
  color: #94a3b8;
}

.notifications-empty-text h4 {
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 12px 0;
  letter-spacing: -0.025em;
}

.notifications-empty-text p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
  max-width: 320px;
  margin: 0;
}

.notifications-list {
  padding: 8px  0;
}

.notification-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 24px;
  background: white;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;
  cursor: pointer;
}

.notification-card:hover {
  background: #f8fafc;
  border-left: 4px solid #e2e8f0;
}

.notification-card:last-child {
  border-bottom: none;
}

.notification-unread {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.02) 0%, rgba(255, 255, 255, 1) 100%);
  border-left: 4px solid #3b82f6;
}

.notification-unread:hover {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.04) 0%, rgba(248, 250, 252, 1) 100%);
  border-left: 4px solid #2563eb;
}

.notification-indicator {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 100%;
  display: flex;
  align-items: center;
}

.notification-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.2s ease;
}

.notification-status-dot.dot-unread {
  background: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.notification-icon-wrapper {
  flex-shrink: 0;
  margin-left: 12px;
}

.notification-type-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
}

.notification-unread .notification-type-icon {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.1) 100%);
  border-color: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.notification-type-icon svg {
  color: #64748b;
}

.notification-unread .notification-type-icon svg {
  color: #3b82f6;
}

.notification-content-wrapper {
  flex: 1;
  min-width: 0;
}

.notification-message-text {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #334155;
  margin-bottom: 8px;
  font-weight: 400;
  word-wrap: break-word;
}

.notification-unread .notification-message-text {
  font-weight: 500;
  color: #1e293b;
}

.notification-timestamp {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 6px;
}

.notification-timestamp::before {
  content: '';
  width: 4px;
  height: 4px;
  background: #cbd5e1;
  border-radius: 50%;
}

.notification-actions-wrapper {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s ease;
  margin-left: 12px;
}

.notification-card:hover .notification-actions-wrapper {
  opacity: 1;
}

.notification-mark-read {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2);
}

.notification-mark-read:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(34, 197, 94, 0.3);
}

.notification-mark-read:active {
  transform: scale(0.95);
}

.notifications-modal-footer {
  background: white;
  border-top: 1px solid #f1f5f9;
  padding: 20px 24px;
  display: flex;
  justify-content: center;
}

.notifications-mark-all-read {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #0f2942 0%, #1a4971 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(15, 41, 66, 0.2);
  letter-spacing: 0.025em;
}

.notifications-mark-all-read:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(15, 41, 66, 0.3);
}

.notifications-mark-all-read:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 4px rgba(15, 41, 66, 0.1);
}

.notifications-mark-all-read:active {
  transform: translateY(0);
}

/* Mobile Responsiveness */
@media (max-width: 640px) {
  .notifications-modal {
    max-width: 95vw;
    margin: 10px;
    max-height: 90vh;
  }

  .notifications-modal-header {
    padding: 20px;
  }

  .notifications-header-text h3 {
    font-size: 1.25rem;
  }

  .notification-card {
    padding: 16px 20px;
    gap: 12px;
  }

  .notification-type-icon {
    width: 36px;
    height: 36px;
  }

  .notifications-empty-state {
    padding: 40px 24px;
  }

  .notifications-modal-footer {
    padding: 16px 20px;
  }
}

/* Smooth scrollbar for notifications */
.notifications-modal-body::-webkit-scrollbar {
  width: 6px;
}

.notifications-modal-body::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.notifications-modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.notifications-modal-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>