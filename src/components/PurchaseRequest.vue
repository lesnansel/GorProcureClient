<template>
  <div class="app-container">
    <!-- Background Pattern (always full screen) -->
    <div class="background-pattern">
      <div class="pattern-overlay"></div>
    </div>
    <!-- Sidebar Overlay -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="toggleSidebar"></div>
    <!-- Toggle Button (always visible) -->
    <button class="sidebar-toggle-btn" @click="toggleSidebar">
      <svg v-if="sidebarOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
    </button>
    <!-- Sidebar -->
    <div :class="['sidebar', sidebarOpen ? 'sidebar-open' : 'sidebar-closed']">
      <!-- User Profile Section -->
      <div class="user-profile">
        <div class="user-avatar">
          <span class="avatar-text">JD</span>
        </div>
        <div class="user-info">
          <div class="username">ansel</div>
          <div class="user-role">user</div>
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
              <router-link to="/purchase-requests" class="nav-link active">
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
      </nav>
    </div>

    <!-- Main Content Area -->
    <div class="main-content" :style="{ marginLeft: sidebarOpen ? '80px' : '0' }">
      <!-- Purchase Request Form -->
      <div class="content-wrapper">
        <div class="admin-card">
          <div class="card-header header-flex">
            <div class="logo-container">
              <img src="@/assets/proculogo.png" alt="Procurement System Logo" class="logo" />
            </div>
            <div class="header-text">
              <h1 class="title">Purchase Request</h1>
              <p class="subtitle">Submit and manage your purchase requests.</p>
            </div>
          </div>

          <div class="card-content">
            <!-- Success/Error Notification -->
            <div v-if="notification.show" :class="['notification', notification.type]">
              <div class="notification-content">
                <div class="notification-icon" :class="notification.type">
                  <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>
                <p>{{ notification.message }}</p>
                <button @click="closeNotification" class="notification-close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>

            <!-- Tab Navigation -->
            <div class="tab-nav">
              <button :class="['tab-btn', activeTab === 'submit' ? 'active' : '']" @click="activeTab = 'submit'">Submit Request</button>
              <button :class="['tab-btn', activeTab === 'my' ? 'active' : '']" @click="activeTab = 'my'">My Requests</button>
            </div>

            <!-- Tab Content -->
            <div v-if="activeTab === 'submit'">
              <!-- Submit Purchase Request Form -->
              <form @submit.prevent="submitRequest" class="form">
                <!-- Basic Information Section -->
                <div class="form-section">
                  <h3 class="section-title">Basic Information</h3>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" for="itemName">Item Name *</label>
                      <input
                        id="itemName"
                        type="text"
                        v-model="newRequest.itemName"
                        class="input-field"
                        placeholder="Enter item name"
                        :class="{ 'error': validationErrors.itemName }"
                      />
                      <span v-if="validationErrors.itemName" class="error-message">{{ validationErrors.itemName }}</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="quantity">Quantity *</label>
                      <input
                        id="quantity"
                        type="number"
                        v-model="newRequest.quantity"
                        class="input-field"
                        min="1"
                        :class="{ 'error': validationErrors.quantity }"
                      />
                      <span v-if="validationErrors.quantity" class="error-message">{{ validationErrors.quantity }}</span>
                    </div>
                  </div>
                  
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" for="category">Category *</label>
                      <select
                        id="category"
                        v-model="newRequest.category"
                        class="input-field"
                        :class="{ 'error': validationErrors.category }"
                      >
                        <option value="">Select a category</option>
                        <option v-for="category in categories" :key="category" :value="category">
                          {{ category }}
                        </option>
                      </select>
                      <span v-if="validationErrors.category" class="error-message">{{ validationErrors.category }}</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="priority">Priority *</label>
                      <select
                        id="priority"
                        v-model="newRequest.priority"
                        class="input-field"
                        :class="{ 'error': validationErrors.priority }"
                      >
                        <option value="">Select priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="particulars">Particulars</option>
                      </select>
                      <span v-if="validationErrors.priority" class="error-message">{{ validationErrors.priority }}</span>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" for="estimatedCost">Estimated Cost (₱)</label>
                      <input
                        id="estimatedCost"
                        type="number"
                        v-model="newRequest.estimatedCost"
                        class="input-field"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="requiredDate">Required Date *</label>
                      <input
                        id="requiredDate"
                        type="date"
                        v-model="newRequest.requiredDate"
                        class="input-field"
                        :min="minDate"
                        :class="{ 'error': validationErrors.requiredDate }"
                      />
                      <span v-if="validationErrors.requiredDate" class="error-message">{{ validationErrors.requiredDate }}</span>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="description">Description *</label>
                    <textarea
                      id="description"
                      v-model="newRequest.description"
                      class="input-field textarea"
                      placeholder="Provide a detailed description of the item..."
                      rows="4"
                      :class="{ 'error': validationErrors.description }"
                    ></textarea>
                    <span v-if="validationErrors.description" class="error-message">{{ validationErrors.description }}</span>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="justification">Justification *</label>
                    <textarea
                      id="justification"
                      v-model="newRequest.justification"
                      class="input-field textarea"
                      placeholder="Explain why this purchase is necessary..."
                      rows="3"
                      :class="{ 'error': validationErrors.justification }"
                    ></textarea>
                    <span v-if="validationErrors.justification" class="error-message">{{ validationErrors.justification }}</span>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="prDocument">PR Document (PDF or Image) *</label>
                    <input
                      id="prDocument"
                      type="file"
                      @change="onFileChange"
                      accept="application/pdf,image/*"
                      class="input-field"
                      :class="{ 'error': fileError }"
                    />
                    <span v-if="fileError" class="error-message">{{ fileError }}</span>
                    <small class="form-help">Please upload a PDF document or image containing the purchase request details.</small>
                  </div>
                </div>

                <!-- Form Actions -->
                <div class="form-actions">
                  <button type="button" @click="resetForm" class="btn-secondary" :disabled="isSubmitting">
                    Reset Form
                  </button>
                  <button type="submit" class="btn-primary" :disabled="isSubmitting">
                    <div v-if="isSubmitting" class="spinner"></div>
                    {{ isSubmitting ? 'Submitting...' : 'Submit Request' }}
                  </button>
                </div>
              </form>
            </div>
            <div v-else>
              <!-- User's Purchase Requests List -->
              <div class="my-requests-section">
                <!-- Header with Icon and Title -->
                <div class="section-header">
                  <div class="header-content">
                    <div class="header-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div class="header-text">
                      <h2>My Purchase Requests</h2>
                      <p>View and track all your submitted purchase requests</p>
                    </div>
                  </div>
                  <button @click="refreshRequests" class="refresh-button" :disabled="refreshingRequests">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ 'rotating': refreshingRequests }">
                      <path d="M21 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
                    </svg>
                    {{ refreshingRequests ? 'Refreshing...' : 'Refresh' }}
                  </button>
                </div>

                <!-- Search and Filter Bar -->
                <div class="search-filter-bar">
                  <div class="search-container">
                    <input 
                      type="text" 
                      v-model="searchQuery" 
                      placeholder="Search by item name, ID, or description..." 
                      class="search-input"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                  <div class="filter-container">
                    <select v-model="statusFilter" class="filter-select">
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="in-review">In Review</option>
                    </select>
                    <select v-model="sortBy" class="filter-select">
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="name">Item Name A-Z</option>
                      <option value="status">By Status</option>
                    </select>
                  </div>
                </div>

                <!-- Stats Summary -->
                <div class="stats-summary">
                  <div class="stat-item">
                    <div class="stat-value">{{ totalRequests }}</div>
                    <div class="stat-label">Total Requests</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ pendingRequests }}</div>
                    <div class="stat-label">Pending</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ approvedRequests }}</div>
                    <div class="stat-label">Approved</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ rejectedRequests }}</div>
                    <div class="stat-label">Rejected</div>
                  </div>
                </div>

                <!-- Purchase Requests Cards Container -->
                <div class="requests-container">
                  <!-- Loading State -->
                  <div v-if="loadingRequests" class="loading-state">
                    <div class="loading-spinner">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="loading-icon">
                        <line x1="12" y1="2" x2="12" y2="6"></line>
                        <line x1="12" y1="18" x2="12" y2="22"></line>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                        <line x1="2" y1="12" x2="6" y2="12"></line>
                        <line x1="18" y1="12" x2="22" y2="12"></line>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                      </svg>
                    </div>
                    <p>Loading your requests...</p>
                  </div>

                  <!-- Empty State -->
                  <div v-else-if="filteredMockRequests.length === 0" class="empty-state">
                    <div class="empty-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <h3>No Purchase Requests Found</h3>
                    <p>You haven't submitted any purchase requests yet. Click on "Submit Request" to get started.</p>
                    <button @click="activeTab = 'submit'" class="create-request-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Create Your First Request
                    </button>
                  </div>

                  <!-- Purchase Requests Grid -->
                  <div v-else class="requests-grid">
                    <div 
                      v-for="request in filteredMockRequests" 
                      :key="request.id" 
                      class="request-card"
                      :class="`request-${request.status.toLowerCase().replace(' ', '-')}`"
                    >
                      <!-- Card Header -->
                      <div class="card-header-section">
                        <div class="card-header-left">
                          <div class="request-id">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            #{{ request.requestId || request.id.substring(0, 8) }}
                          </div>
                          <div class="request-date">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            {{ request.submittedDate }}
                          </div>
                        </div>
                        <div class="status-badge" :class="`status-${request.status.toLowerCase().replace(' ', '-')}`">
                          <div class="status-indicator"></div>
                          {{ request.status }}
                        </div>
                      </div>

                      <!-- Card Body -->
                      <div class="card-body-section">
                        <div class="item-info">
                          <h3 class="item-name">{{ request.itemName }}</h3>
                          <div class="item-details">
                            <div class="detail-item">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 0 1 0 2.828l-7 7a2 2 0 0 1-2.828 0l-7-7A1.994 1.994 0 0 1 3 12V7a4 4 0 0 1 4-4z"></path>
                              </svg>
                              <span class="detail-label">Quantity:</span>
                              <span class="detail-value">{{ request.quantity }}</span>
                            </div>
                            <div class="detail-item">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                              <span class="detail-label">Priority:</span>
                              <span class="detail-value priority" :class="`priority-${request.priority?.toLowerCase()}`">
                                {{ request.priority }}
                              </span>
                            </div>
                          </div>
                        </div>

                        <!-- Description -->
                        <div class="item-description">
                          <p>{{ request.description }}</p>
                        </div>

                        <!-- Progress Bar for Status -->
                        <div class="progress-section">
                          <div class="progress-label">Request Progress</div>
                          <div class="progress-bar">
                            <div 
                              class="progress-fill" 
                              :class="`progress-${request.status.toLowerCase().replace(' ', '-')}`"
                              :style="{ width: getProgressWidth(request.status) }"
                            ></div>
                          </div>
                          <div class="progress-steps">
                            <div class="step" :class="{ active: true }">
                              <div class="step-dot"></div>
                              <span>Submitted</span>
                            </div>
                            <div class="step" :class="{ active: ['approved', 'rejected', 'in-review', 'particulars'].includes(request.status.toLowerCase()) }">
                              <div class="step-dot"></div>
                              <span>Review</span>
                            </div>
                            <div class="step" :class="{ active: request.status.toLowerCase() === 'approved' }">
                              <div class="step-dot"></div>
                              <span>Approved</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Card Footer -->
                      <div class="card-footer-section">
                        <div class="card-actions">
                          <button class="action-btn view-btn" @click="viewRequestDetails(request)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            View Details
                          </button>
                          <button v-if="request.status.toLowerCase() === 'pending'" class="action-btn edit-btn" @click="editRequest(request)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                          </button>
                          <button v-if="request.status.toLowerCase() === 'approved'" class="action-btn download-btn" @click="downloadPDF(request)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download
                          </button>
                        </div>
                        <div class="updated-time">
                          Last updated: {{ request.lastUpdated }}
                        </div>
                      </div>
                    </div>
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
import { db, auth, storage } from "@/firebase";
import { collection, addDoc, serverTimestamp, updateDoc, query, where, getDocs } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
  name: "PurchaseRequest",
  setup() {
    // Form data
    const newRequest = reactive({
      itemName: "",
      quantity: 1,
      description: "",
      category: "",
      priority: "",
      estimatedCost: null,
      requiredDate: "",
      justification: ""
    });
    
    // Validation errors
    const validationErrors = reactive({});
    
    // UI state
    const isSubmitting = ref(false);
    const notification = reactive({
      show: false,
      type: "success",
      message: ""
    });
    
    // Available categories
    const categories = [
      "Office Supplies",
      "IT Equipment",
      "Furniture",
      "Maintenance",
      "Services",
      "Other"
    ];
    
    // Minimum date for the required date field (today)
    const minDate = computed(() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    });
    
    // File upload state
    const file = ref(null);
    const fileError = ref("");
    
    // Sidebar state
    const sidebarOpen = ref(true);
    const toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value; };
    
    // Active tab state
    const activeTab = ref('my'); // Start with My Requests tab to show existing PRs
    
    // New state for My Requests tab
    const searchQuery = ref("");
    const statusFilter = ref("all");
    const sortBy = ref("newest");
    const refreshingRequests = ref(false);
    
    // Stats for summary cards
    const totalRequests = ref(0);
    const pendingRequests = ref(0);
    const approvedRequests = ref(0);
    const rejectedRequests = ref(0);

    // Add loading state for requests
    const loadingRequests = ref(false);
    
    // Replace mock data with real data from Firebase
    const mockRequests = ref([]);

    // Helper function to get time ago
    const getTimeAgo = (date) => {
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      
      if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffMinutes > 0) {
        return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
      } else {
        return 'Just now';
      }
    };

    // Update stats when mock requests change
    const updateStatsFromMockData = () => {
      totalRequests.value = mockRequests.value.length;
      pendingRequests.value = mockRequests.value.filter(r => r.status.toLowerCase() === 'pending').length;
      approvedRequests.value = mockRequests.value.filter(r => r.status.toLowerCase() === 'approved').length;
      rejectedRequests.value = mockRequests.value.filter(r => r.status.toLowerCase() === 'rejected').length;
    };

    // Computed property for filtered requests
    const filteredMockRequests = computed(() => {
      let filtered = [...mockRequests.value];
      
      // Apply search filter
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim();
        filtered = filtered.filter(request => 
          request.itemName?.toLowerCase().includes(query) || 
          request.id?.toLowerCase().includes(query) ||
          request.requestId?.toLowerCase().includes(query) ||
          request.description?.toLowerCase().includes(query)
        );
      }
      
      // Apply status filter
      if (statusFilter.value !== "all") {
        filtered = filtered.filter(request => 
          request.status.toLowerCase() === statusFilter.value.toLowerCase()
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case "oldest":
            return new Date(a.submittedDate) - new Date(b.submittedDate);
          case "name":
            return (a.itemName || "").localeCompare(b.itemName || "");
          case "status":
            return (a.status || "").localeCompare(b.status || "");
          case "newest":
          default:
            return new Date(b.submittedDate) - new Date(a.submittedDate);
        }
      });
      
      return filtered;
    });

    // Fetch real purchase requests from Firebase
    const fetchUserPurchaseRequests = async () => {
      loadingRequests.value = true;
      try {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          console.log("No authenticated user found");
          mockRequests.value = [];
          updateStatsFromMockData();
          return;
        }

        console.log("Fetching purchase requests for user:", currentUser.uid, currentUser.email);
        
        // Query purchase requests for the current user using both userId and userEmail
        const q = query(
          collection(db, "purchaseRequests"),
          where("userId", "==", currentUser.uid)
        );
        
        // Also try query by email as backup
        const q2 = query(
          collection(db, "purchaseRequests"),
          where("userEmail", "==", currentUser.email)
        );
        
        const [querySnapshot1, querySnapshot2] = await Promise.all([
          getDocs(q),
          getDocs(q2)
        ]);
        
        console.log(`Query 1 (by userId) returned ${querySnapshot1.size} documents`);
        console.log(`Query 2 (by userEmail) returned ${querySnapshot2.size} documents`);
        
        const requestsMap = new Map(); // Use Map to avoid duplicates
        
        // Process first query results
        querySnapshot1.forEach((doc) => {
          const data = doc.data();
          console.log("Document from query 1:", doc.id, data);
          
          // Convert Firebase timestamps to readable dates
          const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : 
                           data.createdAt ? new Date(data.createdAt) : new Date();
          
          const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : 
                           data.updatedAt ? new Date(data.updatedAt) : new Date();

          requestsMap.set(doc.id, {
            id: doc.id,
            requestId: data.requestId || doc.id.substring(0, 8).toUpperCase(),
            itemName: data.itemName || 'Unknown Item',
            quantity: data.quantity || 0,
            priority: data.priority || 'medium',
            status: data.status || 'pending',
            description: data.description || 'No description',
            category: data.category || 'N/A',
            estimatedCost: data.estimatedCost,
            justification: data.justification,
            prDocumentURL: data.prDocumentURL,
            submittedDate: createdAt.toLocaleDateString(),
            lastUpdated: getTimeAgo(updatedAt),
            createdAt: createdAt,
            updatedAt: updatedAt
          });
        });
        
        // Process second query results (avoiding duplicates)
        querySnapshot2.forEach((doc) => {
          if (!requestsMap.has(doc.id)) { // Only add if not already added
            const data = doc.data();
            console.log("Document from query 2 (new):", doc.id, data);
            
            const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : 
                             data.createdAt ? new Date(data.createdAt) : new Date();
            
            const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : 
                             data.updatedAt ? new Date(data.updatedAt) : new Date();

            requestsMap.set(doc.id, {
              id: doc.id,
              requestId: data.requestId || doc.id.substring(0, 8).toUpperCase(),
              itemName: data.itemName || 'Unknown Item',
              quantity: data.quantity || 0,
              priority: data.priority || 'medium',
              status: data.status || 'pending',
              description: data.description || 'No description',
              category: data.category || 'N/A',
              estimatedCost: data.estimatedCost,
              justification: data.justification,
              prDocumentURL: data.prDocumentURL,
              submittedDate: createdAt.toLocaleDateString(),
              lastUpdated: getTimeAgo(updatedAt),
              createdAt: createdAt,
              updatedAt: updatedAt
            });
          }
        });
        
        mockRequests.value = Array.from(requestsMap.values());
        console.log(`Total unique requests loaded: ${mockRequests.value.length}`);
        
        if (mockRequests.value.length === 0) {
          console.log("No purchase requests found for this user");
          // You can check what's actually in the database
          const allDocsQuery = query(collection(db, "purchaseRequests"));
          const allDocsSnapshot = await getDocs(allDocsQuery);
          console.log(`Total documents in purchaseRequests collection: ${allDocsSnapshot.size}`);
          
          allDocsSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("All docs - ID:", doc.id, "userId:", data.userId, "userEmail:", data.userEmail, "itemName:", data.itemName);
          });
        }
        
      } catch (error) {
        console.error("Error fetching purchase requests:", error);
        // Show empty state on error
        mockRequests.value = [];
      } finally {
        loadingRequests.value = false;
        updateStatsFromMockData();
      }
    };

    // Initialize stats
    onMounted(() => {
      // Fetch real data when component mounts
      fetchUserPurchaseRequests();
    });

    // Updated refresh function to fetch real data
    const refreshRequests = async () => {
      refreshingRequests.value = true;
      try {
        await fetchUserPurchaseRequests();
      } finally {
        refreshingRequests.value = false;
      }
    };

    // Update stats from child component
    const updateStats = (stats) => {
      totalRequests.value = stats.total || 0;
      pendingRequests.value = stats.pending || 0;
      approvedRequests.value = stats.approved || 0;
      rejectedRequests.value = stats.rejected || 0;
    };

    // Helper function to get progress width based on status
    const getProgressWidth = (status) => {
      switch (status.toLowerCase()) {
        case 'pending': return '33%';
        case 'in-review': case 'in review': return '66%';
        case 'approved': return '100%';
        case 'rejected': return '66%';
        case 'particulars': return '50%';
        default: return '33%';
      }
    };

    // Action handlers
    const viewRequestDetails = (request) => {
      console.log('Viewing request:', request);
      const details = `
        ID: ${request.requestId || request.id}
        Item: ${request.itemName}
        Status: ${request.status}
        Quantity: ${request.quantity}
        Priority: ${request.priority}
        Category: ${request.category}
        Estimated Cost: ₱${request.estimatedCost?.toLocaleString() || 'N/A'}
        Required Date: ${request.requiredDate || 'N/A'}
        
        Description: ${request.description}
        
        Justification: ${request.justification || 'N/A'}
        
        Submitted: ${request.submittedDate}
        Last Updated: ${request.lastUpdated}
      `;
      alert(details);
    };

    const editRequest = (request) => {
      console.log('Editing request:', request);
      if (request.status.toLowerCase() === 'pending') {
        alert(`Edit functionality for ${request.itemName} would open here.\n\nNote: Only pending requests can be edited.`);
      } else {
        alert('This request cannot be edited as it is no longer pending.');
      }
    };

    const downloadPDF = (request) => {
      console.log('Downloading PDF for:', request);
      if (request.prDocumentURL) {
        window.open(request.prDocumentURL, '_blank');
      } else {
        alert(`No PDF document available for ${request.itemName}.`);
      }
    };

    // Validate form
    const validateForm = () => {
      const errors = {};
      
      if (!newRequest.itemName.trim()) {
        errors.itemName = "Item name is required";
      }
      
      if (!newRequest.quantity || newRequest.quantity < 1) {
        errors.quantity = "Quantity must be at least 1";
      }
      
      if (!newRequest.category) {
        errors.category = "Please select a category";
      }
      
      if (!newRequest.priority) {
        errors.priority = "Please select a priority level";
      }
      
      if (!newRequest.description.trim()) {
        errors.description = "Description is required";
      } else if (newRequest.description.trim().length < 10) {
        errors.description = "Description must be at least 10 characters";
      }
      
      if (!newRequest.requiredDate) {
        errors.requiredDate = "Required date is required";
      }
      
      if (!newRequest.justification.trim()) {
        errors.justification = "Justification is required";
      }
      
      // File validation
      if (!file.value) {
        fileError.value = "Please upload a PR document (PDF or image).";
      } else if (file.value && !(file.value.type === "application/pdf" || file.value.type.startsWith("image/"))) {
        fileError.value = "Only PDF files and images are allowed.";
      } else {
        fileError.value = "";
      }
      
      return errors;
    };
    
    // Submit request
    const submitRequest = async () => {
      // Validate form
      const errors = validateForm();
      
      if (Object.keys(errors).length > 0) {
        Object.assign(validationErrors, errors);
        showNotification("error", "Please fix the errors in the form");
        return;
      }
      
      // Clear previous validation errors
      Object.keys(validationErrors).forEach(key => {
        delete validationErrors[key];
      });
      
      // File validation
      if (!file.value || !(file.value.type === "application/pdf" || file.value.type.startsWith("image/"))) {
        fileError.value = !file.value ? "Please upload a PR document (PDF or image)." : "Only PDF files and images are allowed.";
        showNotification("error", fileError.value);
        return;
      }
      
      isSubmitting.value = true;
      
      try {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          showNotification("error", "You must be logged in to submit a request");
          isSubmitting.value = false;
          return;
        }
        
        // Upload file to Firebase Storage
        const storagePath = `purchaseRequests/${currentUser.uid}/${Date.now()}_${file.value.name}`;
        const fileStorageRef = storageRef(storage, storagePath);
        await uploadBytes(fileStorageRef, file.value);
        const fileURL = await getDownloadURL(fileStorageRef);
        
        // Prepare request data
        const requestData = {
          ...newRequest,
          userId: currentUser.uid,
          userEmail: currentUser.email,
          status: "pending",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          prDocumentURL: fileURL
        };
        
        // Add document to Firestore
        const docRef = await addDoc(collection(db, "purchaseRequests"), requestData);
        const generatedId = docRef.id;

        // Update the document with the generated ID
        await updateDoc(docRef, { requestId: generatedId });

        console.log("Generated Request ID:", generatedId);
        
        // Show success notification
        showNotification("success", "Purchase request submitted successfully!");
        
        // Reset form
        resetForm();

        // Refresh the list to show the new request
        await fetchUserPurchaseRequests();
        
      } catch (error) {
        console.error("Error submitting purchase request:", error);
        showNotification("error", "Failed to submit request. Please try again.");
      } finally {
        isSubmitting.value = false;
      }
    };
    
    // Reset form
    const resetForm = () => {
      Object.assign(newRequest, {
        itemName: "",
        quantity: 1,
        description: "",
        category: "",
        priority: "",
        estimatedCost: null,
        requiredDate: "",
        justification: ""
      });
      
      // Clear validation errors
      Object.keys(validationErrors).forEach(key => {
        delete validationErrors[key];
      });
      
      file.value = null;
      fileError.value = "";
    };
    
    // Show notification
    const showNotification = (type, message) => {
      notification.type = type;
      notification.message = message;
      notification.show = true;
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        notification.show = false;
      }, 5000);
    };
    
    // Close notification
    const closeNotification = () => {
      notification.show = false;
    };
    
    // Handle file input change
    const onFileChange = (event) => {
      const selectedFile = event.target.files[0];
      file.value = selectedFile || null;
      
      // Validate file type
      if (selectedFile && !(selectedFile.type === "application/pdf" || selectedFile.type.startsWith("image/"))) {
        fileError.value = "Only PDF files and images are allowed.";
        file.value = null;
      } else {
        fileError.value = "";
      }
    };
    
    return {
      newRequest,
      validationErrors,
      isSubmitting,
      notification,
      categories,
      minDate,
      file,
      fileError,
      sidebarOpen,
      toggleSidebar,
      activeTab,
      
      // New returns for My Requests tab
      searchQuery,
      statusFilter,
      sortBy,
      refreshingRequests,
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      refreshRequests,
      updateStats,
      
      loadingRequests,
      mockRequests,
      filteredMockRequests,
      getProgressWidth,
      viewRequestDetails,
      editRequest,
      downloadPDF,
      fetchUserPurchaseRequests,
      updateStatsFromMockData,
      
      // Add the functions that were missing from return
      submitRequest,
      resetForm,
      closeNotification,
      onFileChange,
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

/* Fixed Left Sidebar */
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
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #22334a transparent;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}
.sidebar::-webkit-scrollbar {
  width: 6px;
  height: 40px;
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

.nav-link.logout {
  color: #fca5a5;
}

.nav-link.logout:hover {
  background-color: #dc2626;
  color: white;
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
  overflow-y: auto; /* Allow vertical scrolling */
  transition: margin-left 0.3s cubic-bezier(.4,0,.2,1);
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}
.main-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* When sidebar is closed, remove margin */
.sidebar-closed ~ .main-content {
  margin-left: 0;
}

/* Content Wrapper */
.content-wrapper {
  padding: 24px;
  min-height: 100vh;
}

/* Card Design */
.admin-card {
  width: 100%;
  max-width: 1200px; /* Increased from 800px */
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
  margin: 0 auto;
}

@media (max-width: 1300px) {
  .admin-card {
    max-width: 98vw;
  }
}

@media (max-width: 900px) {
  .content-wrapper {
    padding: 8px;
  }
  .admin-card {
    max-width: 100vw;
    border-radius: 0;
  }
}

.card-header {
  background: linear-gradient(135deg, #0f2942 0%, #102a42 100%);
  padding: 30px;
  text-align: center;
  color: white;
}

.card-header.header-flex {
  display: flex;
  align-items: center;
  gap: 24px;
  background: linear-gradient(135deg, #0f2942 0%, #102a42 100%);
  padding: 30px;
  color: white;
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

/* Form Styling */
.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f2942;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
    gap: 16px;
  }
}

.form-group {
  flex: 1;
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 6px;
}

/* Input Field Styling */
.input-field {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 14px;
  color: #2d3748;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.input-field:focus {
  border-color: #3182ce;
  outline: none;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.textarea {
  min-height: 100px;
  resize: vertical;
}

.error-message {
  display: block;
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
}

/* Button Styling */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #4a5568;
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: #cbd5e0;
}

.btn-primary {
  background-color: #0f2942;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
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
  background-color: #90cdf4;
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
  color: #a0aec0;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  color: #718096;
  background-color: #edf2f7;
}

.notification-close:hover {
  background-color: #e2e8f0;
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

/* Tab Navigation */
.tab-nav {
  display: flex;
  gap: 12px;
  margin: 24px 0 16px 0;
  justify-content: flex-start;
}

.tab-btn {
  background: #f1f5f9;
  color: #0f2942;
  border: none;
  border-radius: 8px 8px 0 0;
  padding: 12px 28px;
  font-size: 1.08rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.tab-btn.active {
  background: #0f2942;
  color: #fff;
}

/* My Requests Section Styling */
.my-requests-section {
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #0f2942 0%, #102a42 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-text h2 {
  color: #0f2942;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.header-text p {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

.refresh-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #0f2942;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-button:hover:not(:disabled) {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Search and Filter Bar */
.search-filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.filter-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #374151;
  cursor: pointer;
  min-width: 150px;
  transition: all 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Stats Summary */
.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  text-align: center;
  transition: all 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #0f2942;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

/* Requests Container */
.requests-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  min-height: 400px;
}

/* Enhanced Purchase Requests Cards Styling */
.requests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.request-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.request-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* Status-specific card borders */
.request-card.request-pending {
  border-left: 4px solid #f59e0b;
}

.request-card.request-approved {
  border-left: 4px solid #10b981;
}

.request-card.request-rejected {
  border-left: 4px solid #ef4444;
}

.request-card.request-in-review {
  border-left: 4px solid #3b82f6;
}

/* Card Header */
.card-header-section {
  padding: 20px 20px 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.card-header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.request-id {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.request-date {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 0.85rem;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
   font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-pending .status-indicator {
  background-color: #f59e0b;
}

.status-approved {
  background-color: #d1fae5;
  color: #065f46;
}

.status-approved .status-indicator {
  background-color: #10b981;
}

.status-rejected {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-rejected .status-indicator {
  background-color: #ef4444;
}

.status-in-review {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-in-review .status-indicator {
  background-color: #3b82f6;
}

/* Card Body */
.card-body-section {
  padding: 0 20px;
}

.item-info {
  margin-bottom: 16px;
}

.item-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
  line-height: 1.4;
}

.item-details {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 0.9rem;
}

.detail-label {
  font-weight: 500;
}

.detail-value {
  color: #374151;
  font-weight: 600;
}

.priority {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.priority-particulars {
  background-color: #fef3c7;
  color: #92400e;
}

.priority-high {
  background-color: #fee2e2;
  color: #991b1b;
}

.priority-medium {
  background-color: #dbeafe;
  color: #1e40af;
}

.priority-low {
  background-color: #f3f4f6;
  color: #374151;
}

.item-description {
  margin-bottom: 20px;
}

.item-description p {
  color: #6b7280;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* Progress Section */
.progress-section {
  margin-bottom: 20px;
}

.progress-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.progress-bar {
  height: 6px;
  background-color: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-pending {
  background-color: #f59e0b;
}

.progress-in-review {
  background-color: #3b82f6;
}

.progress-approved {
  background-color: #10b981;
}

.progress-rejected {
  background-color: #ef4444;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: #9ca3af;
}

.step.active {
  color: #374151;
  font-weight: 500;
}

.step-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #e5e7eb;
  transition: background-color 0.3s ease;
}

.step.active .step-dot {
  background-color: #3b82f6;
}

/* Card Footer */
.card-footer-section {
  padding: 16px 20px 20px 20px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn {
  background-color: #f3f4f6;
  color: #374151;
}

.view-btn:hover {
  background-color: #e5e7eb;
}

.edit-btn {
  background-color: #dbeafe;
  color: #1e40af;
}

.edit-btn:hover {
  background-color: #bfdbfe;
}

.download-btn {
  background-color: #d1fae5;
  color: #065f46;
}

.download-btn:hover {
  background-color: #a7f3d0;
}

.updated-time {
  color: #9ca3af;
  font-size: 0.8rem;
}

/* Empty State Enhancement */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background-color: white;
  border-radius: 16px;
  border: 2px dashed #e5e7eb;
}

.empty-icon {
  margin-bottom: 24px;
  opacity: 0.6;
  color: #9ca3af;
}

/* Loading State Enhancement */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
  background-color: white;
  border-radius: 16px;
}

.loading-spinner {
  margin-bottom: 16px;
}

.loading-icon {
  animation: spin 2s linear infinite;
  color: #0f2942;
}
</style>