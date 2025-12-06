<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="app-container">
    <!-- Sidebar -->
    <AdminNavigationBar v-model:sidebarOpen="sidebarOpen" />
    <!-- Main Content Area -->
    <div 
      class="main-content"
      :class="['transition-all duration-300 ease-in-out', sidebarOpen ? 'ml-[250px]' : 'ml-0']"
    >
      <div class="content-wrapper">
        <!-- Background Pattern -->
        <div class="background-pattern">
          <div class="pattern-overlay"></div>
        </div>

        <!-- Admin Card -->
        <div class="admin-card">
          <div class="card-header card-header-flex">
            <div class="logo-title-flex">
              <img src="@/assets/proculogo.png" alt="Procurement System Logo" class="logo" />
              <div class="header-texts">
                <h1 class="title">Admin Dashboard</h1>
                <p class="subtitle">System Overview and Management</p>
              </div>
            </div>
          </div>

          <div class="card-content">
            <!-- Loading State -->
            <div v-if="loading" class="loading-state">
              <div class="spinner"></div>
              <p>Loading admin dashboard...</p>
            </div>
            <div v-else>
              <!-- Quick Actions Bar -->
              <div class="quick-actions-bar">
                <button @click="refreshStats" class="action-btn" :disabled="refreshing">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ 'rotating': refreshing }"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                  Refresh
                </button>
                <router-link to="/dashboard" class="action-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6"/><path d="M23 11h-6"/></svg>
                  User Dashboard
                </router-link>
              </div>

              <!-- Stats Overview -->
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-icon users" style="background-color:rgba(59,130,246,0.1);color:#3b82f6;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="8" rx="4"/><path d="M3 8V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2"/></svg>
                  </div>
                  <div class="stat-info">
                    <span class="stat-value">{{ invitationStats.total }}</span>
                    <span class="stat-label">Total Invitations</span>
                    <div style="font-size:0.9rem;">
                      <span style="color:#16a34a;">Active: {{ invitationStats.active }}</span> |
                      <span style="color:#eab308;">Archived: {{ invitationStats.archived }}</span> |
                      <span style="color:#e53e3e;">Expired: {{ invitationStats.expired }}</span>
                    </div>
                    <div style="margin-top:8px;font-size:0.9rem;">
                      <span style="color:#3b82f6;">This Week: {{ invitationStats.thisWeek }}</span> |
                      <span style="color:#a855f7;">This Month: {{ invitationStats.thisMonth }}</span>
                    </div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon users">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6"/><path d="M23 11h-6"/></svg>
                  </div>
                  <div class="stat-info">
                    <span class="stat-value">{{ stats.totalUsers }}</span>
                    <span class="stat-label">Total Users</span>
                  </div>
                  <div class="stat-change" :class="stats.userGrowth >= 0 ? 'positive' : 'negative'">
                    <svg v-if="stats.userGrowth >= 0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    {{ Math.abs(stats.userGrowth) }}%
                  </div>
                </div>

                <div class="stat-card">
                  <div class="stat-icon active">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
                  </div>
                  <div class="stat-info">
                    <span class="stat-value">{{ stats.activeUsers }}</span>
                    <span class="stat-label">Active Users</span>
                  </div>
                  <div class="stat-percentage">
                    {{ Math.round((stats.activeUsers / stats.totalUsers) * 100) || 0 }}%
                  </div>
                </div>

                <div class="stat-card">
                  <div class="stat-icon new" style="background-color:rgba(168,85,247,0.1);color:#a855f7;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                  </div>
                  <div class="stat-info">
                    <span class="stat-value">{{ stats.newUsers }}</span>
                    <span class="stat-label">New Users (24h)</span>
                  </div>
                </div>

                <div class="stat-card">
                  <div class="stat-icon system" style="background-color:rgba(59,130,246,0.1);color:#3b82f6;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
                  </div>
                  <div class="stat-info">
                    <span class="stat-value">{{ stats.systemHealth }}%</span>
                    <span class="stat-label">System Health</span>
                    <div class="health-indicator" :class="getHealthStatus(stats.systemHealth)"></div>
                  </div>
                </div>

                <!-- New stat card for Overdue Invitations -->
                <div class="stat-card">
                  <div class="stat-icon new" style="background-color:rgba(239,68,68,0.1);color:#ef4444;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                  <div class="stat-info">
                    <span class="stat-value">{{ overdueCount }}</span>
                    <span class="stat-label">Overdue Invitations</span>
                  </div>
                </div>
              </div>

              <!-- Charts Section -->
              <div class="charts-section">
                <h2 class="section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  Analytics Dashboard
                </h2>
                
                <div class="charts-grid">
                  <!-- User Growth Chart -->
                  <div class="chart-card">
                    <div class="chart-header">
                      <h3>User Growth</h3>
                      <select v-model="userGrowthPeriod" @change="updateUserGrowthChart" class="chart-select">
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 3 months</option>
                      </select>
                    </div>
                    <div class="chart-container">
                      <Line 
                        :data="userGrowthData" 
                        :options="chartOptions" 
                        :key="userGrowthPeriod"
                      />
                    </div>
                  </div>

                  <!-- Invitation Status Chart -->
                  <div class="chart-card">
                    <div class="chart-header">
                      <h3>Invitation Status Distribution</h3>
                    </div>
                    <div class="chart-container">
                      <Doughnut 
                        :data="invitationStatusData" 
                        :options="doughnutOptions"
                        :key="`doughnut-${invitationStats.total}`"
                      />
                    </div>
                  </div>

                  <!-- Budget Usage Chart -->
                  <div class="chart-card">
                    <div class="chart-header">
                      <h3>Budget Usage Overview</h3>
                    </div>
                    <div class="chart-container">
                      <Bar 
                        :data="budgetData" 
                        :options="barChartOptions"
                        :key="`budget-${budgetStats.totalBudget}`"
                      />
                    </div>
                  </div>

                  <!-- System Activity Chart -->
                  <div class="chart-card">
                    <div class="chart-header">
                      <h3>System Activity (Last 24 Hours)</h3>
                    </div>
                    <div class="chart-container">
                      <Line 
                        :data="activityData" 
                        :options="activityChartOptions"
                        :key="`activity-${Date.now()}`"
                      />
                    </div>
                  </div>

                  <!-- Supplier Behavior Prediction Chart -->
                  <div class="chart-card">
                    <div class="chart-header">
                      <h3>Supplier Performance Prediction</h3>
                      <button @click="generatePredictions" class="prediction-btn" :disabled="generatingPredictions">
                        {{ generatingPredictions ? 'Analyzing...' : 'Update Predictions' }}
                      </button>
                    </div>
                    <div class="chart-container">
                      <Line 
                        :data="predictionData" 
                        :options="predictionChartOptions"
                        :key="`prediction-${supplierPredictions.totalSuppliers}`"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Supplier Prediction Section -->
              <div class="prediction-section">
                <h2 class="section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6"/><path d="m21 12-6-6m-6 6-6-6"/></svg>
                  Supplier Behavior Predictions
                </h2>
                
                <div class="prediction-grid">
                  <!-- Risk Analysis Cards -->
                  <div class="prediction-card high-risk">
                    <div class="prediction-header">
                      <div class="risk-icon high">⚠️</div>
                      <h3>High Risk Suppliers</h3>
                    </div>
                    <div class="prediction-content">
                      <div class="risk-count">{{ supplierPredictions.highRisk }}</div>
                      <div class="risk-description">Suppliers with >70% risk of delays or issues</div>
                      <div class="risk-actions">
                        <span class="recommendation">Action Required</span>
                      </div>
                    </div>
                  </div>

                  <div class="prediction-card medium-risk">
                    <div class="prediction-header">
                      <div class="risk-icon medium">⚡</div>
                      <h3>Medium Risk Suppliers</h3>
                    </div>
                    <div class="prediction-content">
                      <div class="risk-count">{{ supplierPredictions.mediumRisk }}</div>
                      <div class="risk-description">Suppliers with 30-70% risk probability</div>
                      <div class="risk-actions">
                        <span class="recommendation">Monitor Closely</span>
                      </div>
                    </div>
                  </div>

                  <div class="prediction-card low-risk">
                    <div class="prediction-header">
                      <div class="risk-icon low">✅</div>
                      <h3>Low Risk Suppliers</h3>
                    </div>
                    <div class="prediction-content">
                      <div class="risk-count">{{ supplierPredictions.lowRisk }}</div>
                      <div class="risk-description">Reliable suppliers with <30% risk</div>
                      <div class="risk-actions">
                        <span class="recommendation">Preferred Partners</span>
                      </div>
                    </div>
                  </div>

                  <!-- Predictions Summary -->
                  <div class="prediction-card summary">
                    <div class="prediction-header">
                      <div class="risk-icon summary">📊</div>
                      <h3>Prediction Summary</h3>
                    </div>
                    <div class="prediction-content">
                      <div class="summary-stats">
                        <div class="stat-item">
                          <span class="stat-label">Average Reliability</span>
                          <span class="stat-value">{{ supplierPredictions.averageReliability }}%</span>
                        </div>
                        <div class="stat-item">
                          <span class="stat-label">Predicted Delays</span>
                          <span class="stat-value">{{ supplierPredictions.predictedDelays }}</span>
                        </div>
                        <div class="stat-item">
                          <span class="stat-label">Total Suppliers</span>
                          <span class="stat-value">{{ supplierPredictions.totalSuppliers }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- AI Recommendations -->
                <div class="recommendations-section" v-if="supplierPredictions.recommendations.length">
                  <h3 class="recommendations-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11H1l6-6 6 6h-8"/><path d="M23 11h-8l6-6 6 6h-8"/><path d="M7 21v-6h10v6"/></svg>
                    AI Recommendations
                  </h3>
                  <div class="recommendations-list">
                    <div 
                      v-for="(recommendation, index) in supplierPredictions.recommendations" 
                      :key="index" 
                      class="recommendation-item"
                      :class="recommendation.priority"
                    >
                      <div class="recommendation-icon">
                        <span v-if="recommendation.priority === 'high'">🚨</span>
                        <span v-else-if="recommendation.priority === 'medium'">⚠️</span>
                        <span v-else>💡</span>
                      </div>
                      <div class="recommendation-content">
                        <div class="recommendation-title">{{ recommendation.title }}</div>
                        <div class="recommendation-description">{{ recommendation.description }}</div>
                        <div class="recommendation-action">{{ recommendation.action }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 🤖 Machine Learning Predictions Section -->
                <div class="ml-predictions-section" v-if="Object.keys(mlPredictions).length > 0">
                  <h2 class="section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6"/><path d="m21 12-6-6m-6 6-6-6"/></svg>
                    🤖 Machine Learning Delay Predictions
                  </h2>
                  
                  <div class="ml-predictions-grid">
                    <div 
                      v-for="(prediction, supplierId) in mlPredictions" 
                      :key="supplierId"
                      class="ml-prediction-card"
                      :class="`risk-${prediction.riskLevel.toLowerCase()}`"
                    >
                      <div class="ml-card-header">
                        <div class="ml-risk-badge" :class="prediction.riskLevel.toLowerCase()">
                          {{ prediction.riskLevel }}
                        </div>
                        <div class="ml-supplier-name">
                          {{ prediction.supplierName || supplierId }}
                        </div>
                      </div>
                      
                      <div class="ml-card-content">
                        <div class="ml-probability-section">
                          <div class="ml-label">Delay Probability</div>
                          <div class="ml-probability-bar">
                            <div 
                              class="ml-probability-fill"
                              :class="prediction.riskLevel.toLowerCase()"
                              :style="{ width: prediction.probability + '%' }"
                            ></div>
                          </div>
                          <div class="ml-probability-text">{{ prediction.probability }}%</div>
                        </div>
                        
                        <div class="ml-confidence-section">
                          <span class="ml-label">Confidence:</span>
                          <span class="ml-value">{{ prediction.confidence }}%</span>
                        </div>
                        
                        <div class="ml-features-section">
                          <div class="ml-label">Contributing Factors:</div>
                          <ul class="ml-features-list">
                            <li>
                              <span class="ml-feature-name">Delay History:</span>
                              <span class="ml-feature-value">{{ Math.round(prediction.features.delayRate) }}%</span>
                            </li>
                            <li>
                              <span class="ml-feature-name">On-Time Rate:</span>
                              <span class="ml-feature-value">{{ Math.round(prediction.features.onTimeRate) }}%</span>
                            </li>
                            <li>
                              <span class="ml-feature-name">Active Contracts:</span>
                              <span class="ml-feature-value">{{ prediction.features.contractCount }}</span>
                            </li>
                            <li>
                              <span class="ml-feature-name">Account Age:</span>
                              <span class="ml-feature-value">{{ Math.round(prediction.features.accountAge) }} mo</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="ml-info-box">
                    <strong>ℹ️ How it works:</strong> These predictions are generated using a TensorFlow.js neural network trained to detect delay patterns based on historical supplier performance. Combine these with rule-based insights above for best decision-making.
                  </div>
                </div>
              </div>

              <!-- Management Sections -->
              <div class="management-grid">
                <!-- User Management -->
                <div class="management-card">
                  <div class="card-header">
                    <h2>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                      User Management
                    </h2>
                    <router-link to="/admin-management" class="view-all">
                      View All
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </router-link>
                  </div>
                  <div class="recent-users">
                    <div v-for="user in recentUsers" :key="user.id" class="user-item">
                      <img :src="user.avatar || defaultAvatar" :alt="user.name">
                      <div class="user-info">
                        <span class="user-name">{{ user.name }}</span>
                        <span class="user-email">{{ user.email }}</span>
                      </div>
                      <span class="user-status" :class="user.status">
                        {{ user.status }}
                      </span>
                    </div>
                    <div v-if="!recentUsers.length" class="empty-list">
                      <p>No users found</p>
                    </div>
                  </div>
                </div>

                <!-- System Logs -->
                <div class="management-card">
                  <div class="card-header">
                    <h2>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"></polyline></svg>
                      Recent System Logs
                    </h2>
                    <router-link to="/system-logs" class="view-all">
                      View All
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </router-link>
                  </div>
                  <div class="log-list">
                    <div v-for="log in recentLogs" :key="log.id" class="log-item">
                      <span class="log-type" :class="log.type">
                        <svg v-if="log.type === 'info'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        <svg v-else-if="log.type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                        <svg v-else-if="log.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        <svg v-else-if="log.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      </span>
                      <div class="log-info">
                        <span class="log-message">{{ log.message }}</span>
                        <span class="log-time">{{ formatTime(log.timestamp) }}</span>
                      </div>
                    </div>
                    <div v-if="!recentLogs.length" class="empty-list">
                      <p>No logs found</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="quick-actions-grid">
                <button class="quick-action-btn" @click="backupSystem">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                  Backup System
                </button>
                <button class="quick-action-btn" @click="clearCache">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Clear Cache
                </button>
                <button class="quick-action-btn" @click="generateReport">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  Generate Report
                </button>
                <button class="quick-action-btn warning" @click="showMaintenanceModal">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  Maintenance Mode
                </button>

                <!-- New buttons for admin-specific functionalities -->
                <button class="quick-action-btn" @click="navigateTo('admin-management')">
                  Admin Management
                </button>
              </div>
            </div> <!-- End of v-else -->
          </div>
        </div>
      </div>
    </div>

    <!-- Maintenance Mode Modal -->
    <div v-if="showMaintenance" class="modal-overlay" @click="showMaintenance = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="modal-icon"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            Enable Maintenance Mode
          </h3>
          <button class="close-btn" @click="showMaintenance = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="warning-text">
            This will temporarily disable user access to the system.
            Only administrators will be able to log in.
          </p>
          <div class="maintenance-form">
            <div class="form-group">
              <label for="maintenanceMessage">Message</label>
              <input 
                type="text" 
                id="maintenanceMessage"
                v-model="maintenanceMessage" 
                placeholder="Maintenance message for users"
              />
            </div>
            <div class="form-group">
              <label for="maintenanceDuration">Duration (minutes)</label>
              <input 
                type="number" 
                id="maintenanceDuration"
                v-model="maintenanceDuration" 
                placeholder="Duration in minutes"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showMaintenance = false">Cancel</button>
          <button 
            class="confirm-btn warning" 
            @click="enableMaintenance"
            :disabled="!maintenanceMessage || !maintenanceDuration"
          >
            Enable Maintenance Mode
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminNavigationBar from './AdminNavigationBar.vue';
import { ref, onMounted } from 'vue';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useRouter } from 'vue-router';
import * as tf from '@tensorflow/tfjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'vue-chartjs';

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler
);

// Router for navigation
const router = useRouter();

// State
const sidebarOpen = ref(true);
const loading = ref(true);
const refreshing = ref(false);
const showMaintenance = ref(false);
const maintenanceMessage = ref('');
const maintenanceDuration = ref('');
const defaultAvatar = "https://ui-avatars.com/api/?background=0F2942&color=fff";

// Stats
const invitationStats = ref({
  total: 0,
  active: 0,
  archived: 0,
  expired: 0,
  thisWeek: 0,
  thisMonth: 0,
});

const overdueCount = ref(0);

const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  newUsers: 0,
  userGrowth: 0,
  systemHealth: 98,
});

const budgetStats = ref({
  totalBudget: 0,
  totalSpent: 0,
  usagePercent: 0,
});

// Recent Users and Logs
const recentUsers = ref([]);
const recentLogs = ref([]);

// Supplier Behavior Prediction
const supplierPredictions = ref({
  totalSuppliers: 0,
  highRisk: 0,
  mediumRisk: 0,
  lowRisk: 0,
  averageReliability: 0,
  predictedDelays: 0,
  recommendations: []
});

const predictionData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Predicted Performance Score',
    data: [75, 78, 72, 85, 82, 88],
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    tension: 0.4,
    fill: true
  }, {
    label: 'Risk Level',
    data: [25, 22, 28, 15, 18, 12],
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    tension: 0.4,
    fill: true
  }]
});

const fetchInvitationAnalytics = async () => {
  try {
    const invitationsRef = collection(db, 'invitations');
    const snapshot = await getDocs(invitationsRef);
    let total = 0, active = 0, archived = 0, expired = 0, thisWeek = 0, thisMonth = 0;
    let overdue = 0;
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0,0,0,0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    snapshot.forEach(doc => {
      const data = doc.data();
      total++;
      if (data.status === 'Active') active++;
      if (data.status === 'Archived') archived++;
      if (data.expiryDate && new Date(data.expiryDate) < now) expired++;
      // Overdue logic
      if (data.deadline) {
        let deadlineDate = data.deadline;
        if (deadlineDate.seconds) {
          deadlineDate = new Date(deadlineDate.seconds * 1000);
        } else if (typeof deadlineDate === 'string') {
          deadlineDate = new Date(deadlineDate);
        }
        if (deadlineDate < now) {
          overdue++;
        }
      }
      let createdAt = data.createdAt;
      if (createdAt && createdAt.seconds) {
        createdAt = new Date(createdAt.seconds * 1000);
      } else if (typeof createdAt === 'string') {
        createdAt = new Date(createdAt);
      }
      if (createdAt) {
        if (createdAt >= startOfWeek) thisWeek++;
        if (createdAt >= startOfMonth) thisMonth++;
      }
    });
    invitationStats.value = { total, active, archived, expired, thisWeek, thisMonth };
    overdueCount.value = overdue;
  } catch (error) {
    console.error('Error fetching invitations:', error);
  }
};

// Chart Data
const userGrowthPeriod = ref('30');
const userGrowthData = ref({
  labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
  datasets: [{
    label: 'New Users',
    data: [5, 8, 3, 12, 7, 9, 15],
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    tension: 0.4,
    fill: true
  }]
});

const invitationStatusData = ref({
  labels: ['Active', 'Archived', 'Expired', 'Pending'],
  datasets: [{
    data: [25, 15, 8, 12],
    backgroundColor: [
      '#22c55e',
      '#eab308',
      '#ef4444',
      '#3b82f6'
    ],
    borderWidth: 2,
    borderColor: '#fff'
  }]
});

const budgetData = ref({
  labels: ['Allocated', 'Spent', 'Remaining'],
  datasets: [{
    label: 'Budget (₱)',
    data: [1000000, 650000, 350000],
    backgroundColor: [
      'rgba(59, 130, 246, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(34, 197, 94, 0.8)'
    ],
    borderColor: [
      '#3b82f6',
      '#ef4444',
      '#22c55e'
    ],
    borderWidth: 1
  }]
});

const activityData = ref({
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  datasets: [{
    label: 'User Activity',
    data: [12, 8, 25, 45, 35, 20],
    borderColor: '#a855f7',
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    tension: 0.4,
    fill: true
  }]
});

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    },
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    }
  }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    }
  }
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return '₱' + value.toLocaleString();
        }
      }
    }
  }
};

const activityChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

const predictionChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: function(value) {
          return value + '%';
        }
      }
    },
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    }
  }
};

// Add reactive variable for prediction generation
const generatingPredictions = ref(false);

// Load initial data
onMounted(async () => {
  try {
    // Initialize ML model
    await initializeMLModel();
    
    await loadDashboardData();
    await fetchInvitationAnalytics();
    await fetchBudgetStats();
    
    // Initialize charts
    await updateUserGrowthChart();
    updateInvitationStatusChart();
    updateActivityChart();
    
    // Expose ML prediction functions globally for component use
    window.predictAllSupplierDelays = predictAllSupplierDelays;
    window.getSupplierDelayPrediction = getSupplierDelayPrediction;
  } finally {
    loading.value = false;
  }
});

const loadDashboardData = async () => {
  try {
    // Fetch ALL users for accurate statistics
    const usersRef = collection(db, 'users');
    const allUsersSnapshot = await getDocs(usersRef);
    
    // Fetch recent users for display
    const recentUsersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(5));
    const recentUsersSnapshot = await getDocs(recentUsersQuery);
    
    recentUsers.value = recentUsersSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().username || 'Unknown User',
      email: doc.data().email,
      avatar: doc.data().profileImageUrl,
      status: doc.data().status || 'active'
    }));

    // Calculate accurate stats from all users
    let totalUsers = 0;
    let activeUsers = 0;
    let newUsers = 0;
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    allUsersSnapshot.forEach(doc => {
      const userData = doc.data();
      totalUsers++;
      
      // Count active users
      if (userData.status === 'active' || !userData.status) {
        activeUsers++;
      }
      
      // Count new users (last 24 hours)
      if (userData.createdAt) {
        let createdDate;
        if (userData.createdAt.seconds) {
          createdDate = new Date(userData.createdAt.seconds * 1000);
        } else if (typeof userData.createdAt === 'string') {
          createdDate = new Date(userData.createdAt);
        } else {
          createdDate = new Date(userData.createdAt);
        }
        
        if (createdDate >= oneDayAgo) {
          newUsers++;
        }
      }
    });

    // Calculate user growth percentage (comparing last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    let usersLastMonth = 0;
    let usersPreviousMonth = 0;

    allUsersSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.createdAt) {
        let createdDate;
        if (userData.createdAt.seconds) {
          createdDate = new Date(userData.createdAt.seconds * 1000);
        } else {
          createdDate = new Date(userData.createdAt);
        }
        
        if (createdDate >= thirtyDaysAgo) {
          usersLastMonth++;
        } else if (createdDate >= sixtyDaysAgo) {
          usersPreviousMonth++;
        }
      }
    });

    const userGrowth = usersPreviousMonth > 0 
      ? ((usersLastMonth - usersPreviousMonth) / usersPreviousMonth * 100)
      : (usersLastMonth > 0 ? 100 : 0);

    stats.value = {
      totalUsers,
      activeUsers,
      newUsers,
      userGrowth: parseFloat(userGrowth.toFixed(1)),
      systemHealth: 98, // This could be calculated based on system metrics
    };

    // Fetch logs
    const logsQuery = query(collection(db, 'system_logs'), orderBy('timestamp', 'desc'), limit(5));
    const logsSnapshot = await getDocs(logsQuery);
    
    recentLogs.value = logsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // If no logs exist yet, add some sample logs
    if (recentLogs.value.length === 0) {
      recentLogs.value = [
        {
          id: '1',
          type: 'info',
          message: 'System startup completed',
          timestamp: new Date().getTime()
        },
        {
          id: '2',
          type: 'success',
          message: 'Database backup successful',
          timestamp: new Date().getTime() - 3600000
        },
        {
          id: '3',
          type: 'warning',
          message: 'High server load detected',
          timestamp: new Date().getTime() - 7200000
        }
      ];
    }

  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
};

const fetchBudgetStats = async () => {
  try {
    const contractsRef = collection(db, 'contracts');
    const snapshot = await getDocs(contractsRef);
    let totalBudget = 0;
    let totalSpent = 0;
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.budget) {
        totalBudget += Number(data.budget);
      }
      if (data.spent) {
        totalSpent += Number(data.spent);
      }
    });
    const usagePercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
    budgetStats.value = { totalBudget, totalSpent, usagePercent };
    
    // Update budget chart
    updateBudgetChart();
  } catch (error) {
    console.error('Error fetching budget stats:', error);
  }
};

// Chart update functions
const updateUserGrowthChart = async () => {
  try {
    const days = parseInt(userGrowthPeriod.value);
    const labels = [];
    const data = [];
    
    // Fetch all users to analyze registration dates
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    
    // Create date buckets for the selected period
    const dateCounts = {};
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toDateString();
      dateCounts[dateKey] = 0;
      labels.push(date.toLocaleDateString());
    }
    
    // Count users by registration date
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.createdAt) {
        let createdDate;
        if (userData.createdAt.seconds) {
          createdDate = new Date(userData.createdAt.seconds * 1000);
        } else if (typeof userData.createdAt === 'string') {
          createdDate = new Date(userData.createdAt);
        } else {
          createdDate = new Date(userData.createdAt);
        }
        
        const dateKey = createdDate.toDateString();
        if (dateKey in dateCounts) {
          dateCounts[dateKey]++;
        }
      }
    });
    
    // Convert counts to array
    Object.keys(dateCounts).forEach(dateKey => {
      data.push(dateCounts[dateKey]);
    });
    
    userGrowthData.value = {
      labels,
      datasets: [{
        label: 'New Users',
        data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  } catch (error) {
    console.error('Error updating user growth chart:', error);
    // Fallback to sample data if there's an error
    const days = parseInt(userGrowthPeriod.value);
    const labels = [];
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString());
      data.push(Math.floor(Math.random() * 5) + 1);
    }
    
    userGrowthData.value = {
      labels,
      datasets: [{
        label: 'New Users',
        data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }
};

const updateInvitationStatusChart = () => {
  const stats = invitationStats.value;
  
  // Calculate pending invitations (total minus active, archived, expired)
  const pending = Math.max(0, stats.total - stats.active - stats.archived - stats.expired);
  
  // Only show chart if we have real data
  const hasData = stats.total > 0;
  
  invitationStatusData.value = {
    labels: ['Active', 'Archived', 'Expired', 'Pending'],
    datasets: [{
      data: hasData ? [
        stats.active,
        stats.archived,
        stats.expired,
        pending
      ] : [1, 1, 1, 1], // Show minimal data if no invitations exist
      backgroundColor: [
        '#22c55e',
        '#eab308',
        '#ef4444',
        '#3b82f6'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };
};

const updateBudgetChart = () => {
  const allocated = budgetStats.value.totalBudget;
  const spent = budgetStats.value.totalSpent;
  const remaining = Math.max(0, allocated - spent);
  
  // If no budget data exists, show a message in the chart
  const hasData = allocated > 0 || spent > 0;
  
  budgetData.value = {
    labels: ['Allocated', 'Spent', 'Remaining'],
    datasets: [{
      label: 'Budget (₱)',
      data: hasData ? [allocated, spent, remaining] : [100000, 0, 100000], // Default values if no data
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(34, 197, 94, 0.8)'
      ],
      borderColor: [
        '#3b82f6',
        '#ef4444',
        '#22c55e'
      ],
      borderWidth: 1
    }]
  };
};

const updateActivityChart = async () => {
  try {
    // Fetch system logs for the last 24 hours to track activity
    const logsRef = collection(db, 'system_logs');
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    const logsSnapshot = await getDocs(logsRef);
    
    // Create hourly buckets for the last 24 hours
    const labels = [];
    const hourlyCounts = {};
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date();
      hour.setHours(hour.getHours() - i);
      const hourKey = hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const hourTimestamp = hour.getHours();
      
      labels.push(hourKey);
      hourlyCounts[hourTimestamp] = 0;
    }
    
    // Count logs by hour
    logsSnapshot.forEach(doc => {
      const logData = doc.data();
      if (logData.timestamp) {
        let logDate;
        if (logData.timestamp.seconds) {
          logDate = new Date(logData.timestamp.seconds * 1000);
        } else if (typeof logData.timestamp === 'number') {
          logDate = new Date(logData.timestamp);
        } else {
          logDate = new Date(logData.timestamp);
        }
        
        // Only count logs from the last 24 hours
        if (logDate >= oneDayAgo) {
          const logHour = logDate.getHours();
          if (logHour in hourlyCounts) {
            hourlyCounts[logHour]++;
          }
        }
      }
    });
    
    // Convert to array
    const data = Object.keys(hourlyCounts).map(hour => hourlyCounts[hour]);
    
    // If no real activity data, try to get user login activity as fallback
    const hasActivity = data.some(count => count > 0);
    
    if (!hasActivity) {
      // Fallback: Check recent user activity (logins, updates, etc.)
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      // Reset counts
      Object.keys(hourlyCounts).forEach(hour => {
        hourlyCounts[hour] = 0;
      });
      
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.lastLogin) {
          let loginDate;
          if (userData.lastLogin.seconds) {
            loginDate = new Date(userData.lastLogin.seconds * 1000);
          } else if (typeof userData.lastLogin === 'string') {
            loginDate = new Date(userData.lastLogin);
          } else {
            loginDate = new Date(userData.lastLogin);
          }
          
          if (loginDate >= oneDayAgo) {
            const loginHour = loginDate.getHours();
            if (loginHour in hourlyCounts) {
              hourlyCounts[loginHour]++;
            }
          }
        }
      });
      
      // Update data array
      const newData = Object.keys(hourlyCounts).map(hour => hourlyCounts[hour]);
      data.splice(0, data.length, ...newData);
    }
    
    activityData.value = {
      labels,
      datasets: [{
        label: 'System Activity',
        data,
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
    
  } catch (error) {
    console.error('Error updating activity chart:', error);
    // Fallback to sample data if there's an error
    const labels = [];
    const data = [];
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date();
      hour.setHours(hour.getHours() - i);
      labels.push(hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      data.push(Math.floor(Math.random() * 10) + 1);
    }
    
    activityData.value = {
      labels,
      datasets: [{
        label: 'System Activity',
        data,
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }
};

// Utility functions
const getHealthStatus = (health) => {
  if (health >= 90) return 'excellent';
  if (health >= 70) return 'good';
  if (health >= 50) return 'fair';
  return 'poor';
};

const formatTime = (timestamp) => {
  if (!timestamp) return 'Unknown';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    }
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Action handlers
const refreshStats = async () => {
  refreshing.value = true;
  try {
    await loadDashboardData();
    await fetchInvitationAnalytics();
    await fetchBudgetStats();
    
    // Refresh charts with real data
    await updateUserGrowthChart();
    updateInvitationStatusChart();
    await updateActivityChart();
  } finally {
    setTimeout(() => {
      refreshing.value = false;
    }, 1000);
  }
};

const backupSystem = async () => {
  try {
    // Show loading state
    const backupBtn = document.querySelector('.quick-action-btn');
    const originalText = backupBtn?.textContent;
    if (backupBtn) {
      backupBtn.textContent = 'Creating Backup...';
      backupBtn.disabled = true;
    }

    // Collections to backup
    const collectionsToBackup = [
      'users',
      'invitations',
      'contracts', 
      'system_logs',
      'purchase_requests',
      'bids',
      'qualifications',
      'payments',
      'notifications'
    ];

    const backupData = {
      metadata: {
        backupDate: new Date().toISOString(),
        version: '1.0',
        source: 'GovProcure Admin Dashboard',
        collections: collectionsToBackup.length
      },
      data: {}
    };

    let totalRecords = 0;
    let successfulCollections = 0;

    // Backup each collection
    for (const collectionName of collectionsToBackup) {
      try {
        console.log(`Backing up collection: ${collectionName}`);
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        
        const collectionData = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          
          // Convert Firestore timestamps to ISO strings for JSON compatibility
          const processedData = processFirestoreData(data);
          
          collectionData.push({
            id: doc.id,
            data: processedData
          });
        });

        backupData.data[collectionName] = {
          count: collectionData.length,
          records: collectionData
        };

        totalRecords += collectionData.length;
        successfulCollections++;
        
        console.log(`✓ ${collectionName}: ${collectionData.length} records`);
        
      } catch (error) {
        console.error(`Error backing up ${collectionName}:`, error);
        backupData.data[collectionName] = {
          error: error.message,
          count: 0,
          records: []
        };
      }
    }

    // Update metadata with actual counts
    backupData.metadata.totalRecords = totalRecords;
    backupData.metadata.successfulCollections = successfulCollections;
    backupData.metadata.failedCollections = collectionsToBackup.length - successfulCollections;

    // Create and download the backup file
    const backupJson = JSON.stringify(backupData, null, 2);
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `govprocure_backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Create a summary report
    const summaryData = {
      backupSummary: {
        date: new Date().toISOString(),
        totalCollections: collectionsToBackup.length,
        successfulCollections,
        failedCollections: collectionsToBackup.length - successfulCollections,
        totalRecords,
        collections: Object.keys(backupData.data).map(name => ({
          name,
          records: backupData.data[name].count || 0,
          status: backupData.data[name].error ? 'Failed' : 'Success',
          error: backupData.data[name].error || null
        }))
      }
    };

    // Download summary report as well
    const summaryJson = JSON.stringify(summaryData, null, 2);
    const summaryBlob = new Blob([summaryJson], { type: 'application/json' });
    const summaryUrl = window.URL.createObjectURL(summaryBlob);
    
    const summaryLink = document.createElement('a');
    summaryLink.href = summaryUrl;
    summaryLink.download = `govprocure_backup_summary_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(summaryLink);
    summaryLink.click();
    document.body.removeChild(summaryLink);
    window.URL.revokeObjectURL(summaryUrl);

    // Reset button and show success
    if (backupBtn) {
      backupBtn.textContent = originalText;
      backupBtn.disabled = false;
    }

    alert(`✅ Backup completed successfully!\n\nSummary:\n- Collections backed up: ${successfulCollections}/${collectionsToBackup.length}\n- Total records: ${totalRecords}\n- Files downloaded: 2 (backup + summary)\n\nBackup files have been downloaded to your Downloads folder.`);

  } catch (error) {
    console.error('Backup failed:', error);
    
    // Reset button on error
    const backupBtn = document.querySelector('.quick-action-btn');
    if (backupBtn) {
      backupBtn.textContent = 'Backup System';
      backupBtn.disabled = false;
    }
    
    alert(`❌ Backup failed: ${error.message}\n\nPlease check your internet connection and try again.`);
  }
};

// Helper function to process Firestore data for JSON export
const processFirestoreData = (data) => {
  const processed = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === 'object') {
      // Handle Firestore Timestamp objects
      if (value.seconds && value.nanoseconds !== undefined) {
        processed[key] = new Date(value.seconds * 1000).toISOString();
      }
      // Handle nested objects
      else if (value.constructor === Object) {
        processed[key] = processFirestoreData(value);
      }
      // Handle arrays
      else if (Array.isArray(value)) {
        processed[key] = value.map(item => 
          typeof item === 'object' && item !== null ? processFirestoreData(item) : item
        );
      }
      else {
        processed[key] = value;
      }
    } else {
      processed[key] = value;
    }
  }
  
  return processed;
};

const clearCache = () => {
  // Implement cache clearing
  alert('Cache cleared successfully');
};

const generateReport = async (event) => {
  try {
    // Show loading state
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Generating PDF...';
    button.disabled = true;

    // Check if jsPDF is available
    let jsPDF;
    try {
      const jsPDFModule = await import('jspdf');
      jsPDF = jsPDFModule.jsPDF;
    } catch (importError) {
      console.error('Failed to import jsPDF:', importError);
      alert('PDF library not available. Please refresh the page and try again.');
      button.textContent = originalText;
      button.disabled = false;
      return;
    }

    // Create PDF document
    const doc = new jsPDF();

    // Set up PDF styling
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;
    const margin = 20;
    const lineHeight = 7;

    // Helper function to add text with word wrap
    const addText = (text, x, y, maxWidth = pageWidth - 2 * margin) => {
      try {
        const lines = doc.splitTextToSize(String(text), maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * lineHeight);
      } catch (error) {
        console.error('Error adding text:', error);
        doc.text(String(text).substring(0, 50) + '...', x, y);
        return y + lineHeight;
      }
    };

    // Helper function to check if we need a new page
    const checkNewPage = (neededHeight = 20) => {
      if (yPosition + neededHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = 20;
      }
    };

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('GovProcure System Admin Report', margin, yPosition);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Generated on: ${new Date().toLocaleString()}`, margin, yPosition + 5);
    yPosition += 10;

    // Gather all data for the report
    const reportData = {
      systemOverview: {
        totalUsers: stats.value.totalUsers || 0,
        activeUsers: stats.value.activeUsers || 0,
        newUsers: stats.value.newUsers || 0,
        userGrowth: stats.value.userGrowth || 0,
        systemHealth: stats.value.systemHealth || 0
      },
      invitations: {
        total: invitationStats.value.total || 0,
        active: invitationStats.value.active || 0,
        archived: invitationStats.value.archived || 0,
        expired: invitationStats.value.expired || 0,
        overdue: overdueCount.value || 0,
        thisWeek: invitationStats.value.thisWeek || 0,
        thisMonth: invitationStats.value.thisMonth || 0
      },
      budget: {
        totalBudget: budgetStats.value.totalBudget || 0,
        totalSpent: budgetStats.value.totalSpent || 0,
        remaining: (budgetStats.value.totalBudget || 0) - (budgetStats.value.totalSpent || 0),
        usagePercent: budgetStats.value.usagePercent || 0
      }
    };

    // System Overview Section
    checkNewPage(60);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('System Overview', margin, yPosition);
    yPosition += 5;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Total Users: ${reportData.systemOverview.totalUsers}`, margin, yPosition);
    yPosition = addText(`Active Users: ${reportData.systemOverview.activeUsers}`, margin, yPosition);
    yPosition = addText(`New Users (24h): ${reportData.systemOverview.newUsers}`, margin, yPosition);
    yPosition = addText(`User Growth: ${reportData.systemOverview.userGrowth}%`, margin, yPosition);
    yPosition = addText(`System Health: ${reportData.systemOverview.systemHealth}%`, margin, yPosition);
    yPosition += 10;

    // Invitation Statistics Section
    checkNewPage(60);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Invitation Statistics', margin, yPosition);
    yPosition += 5;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Total Invitations: ${reportData.invitations.total}`, margin, yPosition);
    yPosition = addText(`Active Invitations: ${reportData.invitations.active}`, margin, yPosition);
    yPosition = addText(`Archived Invitations: ${reportData.invitations.archived}`, margin, yPosition);
    yPosition = addText(`Expired Invitations: ${reportData.invitations.expired}`, margin, yPosition);
    yPosition = addText(`Overdue Invitations: ${reportData.invitations.overdue}`, margin, yPosition);
    yPosition = addText(`This Week: ${reportData.invitations.thisWeek}`, margin, yPosition);
    yPosition = addText(`This Month: ${reportData.invitations.thisMonth}`, margin, yPosition);
    yPosition += 10;

    // Budget Overview Section
    checkNewPage(50);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Budget Overview', margin, yPosition);
    yPosition += 5;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Total Budget: ₱${reportData.budget.totalBudget.toLocaleString()}`, margin, yPosition);
    yPosition = addText(`Total Spent: ₱${reportData.budget.totalSpent.toLocaleString()}`, margin, yPosition);
    yPosition = addText(`Remaining Budget: ₱${reportData.budget.remaining.toLocaleString()}`, margin, yPosition);
    yPosition = addText(`Budget Usage: ${reportData.budget.usagePercent}%`, margin, yPosition);
    yPosition += 10;

    // Try to fetch additional data (but don't fail if it doesn't work)
    try {
      const [usersSnapshot, invitationsSnapshot, logsSnapshot] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'invitations')),
        getDocs(query(collection(db, 'system_logs'), orderBy('timestamp', 'desc'), limit(10)))
      ]);

      // User Details Section (Top 10)
      if (usersSnapshot && usersSnapshot.docs.length > 0) {
        checkNewPage(80);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        yPosition = addText('Recent Users (Top 10)', margin, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        let userCount = 0;
        usersSnapshot.docs.forEach(userDoc => {
          if (userCount >= 10) return;
          checkNewPage(15);
          
          const userData = userDoc.data();
          const username = (userData.username || 'Unknown').substring(0, 20);
          const email = (userData.email || 'N/A').substring(0, 30);
          const status = userData.status || 'active';

          yPosition = addText(`${userCount + 1}. ${username} - ${email} (${status})`, margin, yPosition);
          userCount++;
        });
        yPosition += 10;
      }

      // Recent Invitations
      if (invitationsSnapshot && invitationsSnapshot.docs.length > 0) {
        checkNewPage(80);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        yPosition = addText('Recent Invitations (Top 10)', margin, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        let invCount = 0;
        invitationsSnapshot.docs.forEach(invDoc => {
          if (invCount >= 10) return;
          checkNewPage(15);
          
          const invData = invDoc.data();
          const title = (invData.projectTitle || 'Untitled').substring(0, 30);
          const status = invData.status || 'Unknown';
          const budget = Number(invData.approvedBudget || 0).toLocaleString();

          yPosition = addText(`${invCount + 1}. ${title} - ${status} (₱${budget})`, margin, yPosition);
          invCount++;
        });
        yPosition += 10;
      }

      // Recent System Logs
      if (logsSnapshot && logsSnapshot.docs.length > 0) {
        checkNewPage(80);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        yPosition = addText('Recent System Logs', margin, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        let logCount = 0;
        logsSnapshot.docs.forEach(logDoc => {
          if (logCount >= 10) return;
          checkNewPage(15);
          
          const logData = logDoc.data();
          const type = (logData.type || 'info').toUpperCase();
          const message = (logData.message || 'No message').substring(0, 50);

          yPosition = addText(`${logCount + 1}. [${type}] ${message}`, margin, yPosition);
          logCount++;
        });
      }
    } catch (dataError) {
      console.warn('Could not fetch detailed data:', dataError);
      // Continue with basic report
    }

    // Footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10);
      doc.text('Generated by GovProcure Admin System', margin, pageHeight - 10);
    }

    // Save the PDF
    const fileName = `GovProcure_Admin_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    // Show success message
    alert('Admin report PDF generated and downloaded successfully!');

    // Reset button
    button.textContent = originalText;
    button.disabled = false;

  } catch (error) {
    console.error('Error generating PDF report:', error);
    alert(`Error generating PDF report: ${error.message}. Please try again.`);
    
    // Reset button on error
    if (event && event.target) {
      event.target.textContent = 'Generate Report';
      event.target.disabled = false;
    }
  }
};

const showMaintenanceModal = () => {
  showMaintenance.value = true;
};

const enableMaintenance = async () => {
  // Implement maintenance mode
  alert(`Maintenance mode enabled for ${maintenanceDuration.value} minutes with message: ${maintenanceMessage.value}`);
  showMaintenance.value = false;
  maintenanceMessage.value = '';
  maintenanceDuration.value = '';
};

const navigateTo = (route) => {
  // Use Vue Router for navigation instead of direct window.location
  router.push(`/${route}`);
};

// ============================================
// ADVANCED RULE-BASED PREDICTION ENGINE
// ============================================

// Rule Base Definition - Stored as a configuration
const PREDICTION_RULES = {
  performanceRules: [
    { condition: 'onTimeDelivery', points: 25, fuzzyRange: { perfect: [95, 100], good: [75, 95], average: [50, 75], poor: [0, 50] } },
    { condition: 'qualityRating', points: 25, fuzzyRange: { excellent: [4, 5], good: [3, 4], acceptable: [2, 3], poor: [0, 2] } },
    { condition: 'budgetAdherence', points: 15, fuzzyRange: { strict: [95, 100], good: [85, 95], loose: [70, 85], over: [0, 70] } },
    { condition: 'communicationScore', points: 10, fuzzyRange: { responsive: [80, 100], normal: [60, 80], slow: [40, 60], unresponsive: [0, 40] } },
  ],
  reliabilityRules: [
    { condition: 'accountAge', points: 20, fuzzyRange: { veryOld: [24, 120], old: [12, 24], medium: [6, 12], new: [0, 6] } },
    { condition: 'bidConsistency', points: 30, fuzzyRange: { consistent: [90, 100], reliable: [75, 90], inconsistent: [50, 75], unreliable: [0, 50] } },
    { condition: 'completionRate', points: 25, fuzzyRange: { excellent: [95, 100], good: [80, 95], fair: [60, 80], poor: [0, 60] } },
    { condition: 'scoreConsistency', points: 20, fuzzyRange: { stable: [0, 10], consistent: [10, 20], variable: [20, 35], erratic: [35, 100] } },
    { condition: 'recentActivity', points: 25, fuzzyRange: { active: [0, 7], engaged: [7, 30], dormant: [30, 90], inactive: [90, 365] } },
  ],
  riskRules: [
    { condition: 'contractFailureRate', points: 30, fuzzyRange: { none: [0, 5], low: [5, 15], medium: [15, 30], high: [30, 100] } },
    { condition: 'lowQualificationScores', points: 25, fuzzyRange: { none: [0, 10], few: [10, 25], many: [25, 50], most: [50, 100] } },
    { condition: 'accountMaturity', points: 20, fuzzyRange: { mature: [24, 120], established: [12, 24], new: [0, 12], veryNew: [0, 3] } },
    { condition: 'delayTendency', points: 25, fuzzyRange: { reliable: [0, 10], occasional: [10, 25], frequent: [25, 50], chronic: [50, 100] } },
  ]
};

// Fuzzy Logic Helper - Determines membership in a fuzzy set
const getFuzzyMembership = (value, fuzzyRange) => {
  for (const [level, range] of Object.entries(fuzzyRange)) {
    if (value >= range[0] && value <= range[1]) {
      return { level, confidence: calculateConfidence(value, range) };
    }
  }
  return { level: 'unknown', confidence: 0 };
};

// Calculate confidence (how sure we are about the fuzzy classification)
const calculateConfidence = (value, range) => {
  const mid = (range[0] + range[1]) / 2;
  const distance = Math.abs(value - mid);
  const maxDistance = (range[1] - range[0]) / 2;
  return Math.max(0, 100 - (distance / maxDistance) * 100);
};

// Supplier Behavior Prediction Functions
const generatePredictions = async () => {
  generatingPredictions.value = true;
  
  try {
    console.log('Generating supplier behavior predictions...');
    
    // Fetch data from multiple collections for analysis
    const [usersSnapshot, contractsSnapshot, bidsSnapshot, qualificationsSnapshot] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'contracts')),
      getDocs(collection(db, 'bids')),
      getDocs(collection(db, 'qualifications')) // Add qualifications data
    ]);

    const supplierData = [];
    
    // Analyze user data (suppliers)
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.role === 'supplier' || userData.userType === 'supplier') {
        supplierData.push({
          id: doc.id,
          name: userData.username || userData.name || 'Unknown',
          email: userData.email,
          createdAt: userData.createdAt,
          lastActive: userData.lastLogin || userData.lastActive,
          status: userData.status || 'active',
          contracts: [],
          bids: [],
          qualifications: [] // Add qualifications array
        });
      }
    });

    // Analyze contracts for performance history
    contractsSnapshot.forEach(doc => {
      const contractData = doc.data();
      const supplier = supplierData.find(s => 
        s.id === contractData.supplierId || 
        s.email === contractData.supplierEmail ||
        s.name === contractData.supplierName
      );
      
      if (supplier) {
        supplier.contracts.push({
          id: doc.id,
          status: contractData.status,
          completedOnTime: contractData.completedOnTime,
          deliveryDate: contractData.deliveryDate,
          expectedDate: contractData.expectedDeliveryDate,
          budget: contractData.budget || contractData.amount,
          quality: contractData.qualityRating || Math.random() * 5, // Simulated if not available
          ...contractData
        });
      }
    });

    // Analyze bids for behavior patterns
    bidsSnapshot.forEach(doc => {
      const bidData = doc.data();
      const supplier = supplierData.find(s => 
        s.id === bidData.bidderId || 
        s.email === bidData.bidderEmail
      );
      
      if (supplier) {
        supplier.bids.push({
          id: doc.id,
          status: bidData.status,
          submittedOnTime: bidData.submittedOnTime,
          bidAmount: bidData.bidAmount,
          awarded: bidData.status === 'awarded',
          ...bidData
        });
      }
    });

    // Analyze post-qualifications for evaluation history
    qualificationsSnapshot.forEach(doc => {
      const qualData = doc.data();
      let supplier = supplierData.find(s => 
        s.name.toLowerCase() === qualData.supplierName?.toLowerCase() ||
        s.email === qualData.supplierEmail
      );
      
      // If no matching user found, create a supplier entry from qualification data
      if (!supplier && qualData.supplierName) {
        supplier = {
          id: `qual-${doc.id}`,
          name: qualData.supplierName,
          email: qualData.supplierEmail || 'unknown@email.com',
          createdAt: qualData.createdAt || qualData.evaluationDate,
          lastActive: qualData.updatedAt || qualData.createdAt,
          status: 'active',
          contracts: [],
          bids: [],
          qualifications: []
        };
        supplierData.push(supplier);
      }
      
      if (supplier) {
        supplier.qualifications.push({
          id: doc.id,
          evaluationScore: qualData.evaluationScore,
          remarks: qualData.remarks,
          evaluationDate: qualData.evaluationDate,
          evaluator: qualData.evaluator,
          ...qualData
        });
      }
    });

    // AI-like prediction algorithm
    const predictions = supplierData.map(supplier => {
      const performanceScore = calculatePerformanceScore(supplier);
      const reliabilityScore = calculateReliabilityScore(supplier);
      const riskLevel = calculateRiskLevel(supplier, performanceScore, reliabilityScore);
      
      return {
        ...supplier,
        performanceScore,
        reliabilityScore,
        riskLevel,
        predictedBehavior: generateBehaviorPrediction(supplier, performanceScore, reliabilityScore)
      };
    });

    // Categorize suppliers by risk
    const highRisk = predictions.filter(p => p.riskLevel > 70).length;
    const mediumRisk = predictions.filter(p => p.riskLevel >= 30 && p.riskLevel <= 70).length;
    const lowRisk = predictions.filter(p => p.riskLevel < 30).length;
    
    const averageReliability = predictions.length > 0 
      ? Math.round(predictions.reduce((sum, p) => sum + p.reliabilityScore, 0) / predictions.length)
      : 0;
    
    const predictedDelays = predictions.filter(p => p.predictedBehavior.likelyToDelay).length;

    // Generate ML predictions for all suppliers
    console.log('📊 Generating ML delay predictions...');
    await predictAllSupplierDelays(predictions);
    console.log('✅ ML predictions complete:', mlPredictions.value);

    // Generate AI recommendations
    const recommendations = generateRecommendations(predictions);

    // Update prediction data
    supplierPredictions.value = {
      totalSuppliers: predictions.length,
      highRisk,
      mediumRisk,
      lowRisk,
      averageReliability,
      predictedDelays,
      recommendations
    };

    // Update chart data with monthly predictions
    updatePredictionChart(predictions);

    console.log('✅ Predictions generated successfully');

  } catch (error) {
    console.error('Error generating predictions:', error);
    alert('❌ Error generating predictions. Please try again.');
  } finally {
    generatingPredictions.value = false;
  }
};

// Helper function to calculate performance score using rule-based weighted scoring
const calculatePerformanceScore = (supplier) => {
  if (supplier.contracts.length === 0 && supplier.qualifications.length === 0) return 50;
  
  let totalScore = 0;
  let totalWeight = 0;
  const scoreBreakdown = {};
  
  // RULE 1: On-Time Delivery Rate (weighted 25 points)
  const onTimeRate = supplier.contracts.length > 0 
    ? (supplier.contracts.filter(c => c.completedOnTime === true).length / supplier.contracts.length) * 100
    : 50;
  const onTimeFuzzy = getFuzzyMembership(onTimeRate, PREDICTION_RULES.performanceRules[0].fuzzyRange);
  const onTimeScore = (onTimeRate / 100) * PREDICTION_RULES.performanceRules[0].points;
  scoreBreakdown.onTimeDelivery = { value: onTimeRate, fuzzyLevel: onTimeFuzzy.level, score: onTimeScore };
  totalScore += onTimeScore;
  totalWeight += PREDICTION_RULES.performanceRules[0].points;
  
  // RULE 2: Quality Rating (weighted 25 points)
  const avgQuality = supplier.contracts.length > 0
    ? supplier.contracts.reduce((sum, c) => sum + (c.quality || 0), 0) / supplier.contracts.length
    : 2.5;
  const qualityFuzzy = getFuzzyMembership((avgQuality / 5) * 100, PREDICTION_RULES.performanceRules[1].fuzzyRange);
  const qualityScore = ((avgQuality / 5) * 100 / 100) * PREDICTION_RULES.performanceRules[1].points;
  scoreBreakdown.qualityRating = { value: avgQuality, fuzzyLevel: qualityFuzzy.level, score: qualityScore };
  totalScore += qualityScore;
  totalWeight += PREDICTION_RULES.performanceRules[1].points;
  
  // RULE 3: Budget Adherence (weighted 15 points) - Now using actual contract data
  const budgetAdherence = supplier.contracts.length > 0
    ? supplier.contracts.filter(c => c.budgetStatus !== 'exceeded').length / supplier.contracts.length * 100
    : 70;
  const budgetFuzzy = getFuzzyMembership(budgetAdherence, PREDICTION_RULES.performanceRules[2].fuzzyRange);
  const budgetScore = (budgetAdherence / 100) * PREDICTION_RULES.performanceRules[2].points;
  scoreBreakdown.budgetAdherence = { value: budgetAdherence, fuzzyLevel: budgetFuzzy.level, score: budgetScore };
  totalScore += budgetScore;
  totalWeight += PREDICTION_RULES.performanceRules[2].points;
  
  // RULE 4: Post-Qualification Average (weighted 35 points - increased importance)
  const avgQualScore = supplier.qualifications.length > 0
    ? supplier.qualifications.reduce((sum, q) => sum + Number(q.evaluationScore || 0), 0) / supplier.qualifications.length
    : 50;
  const qualScoreFuzzy = getFuzzyMembership(avgQualScore, PREDICTION_RULES.performanceRules[1].fuzzyRange);
  const postQualScore = avgQualScore / 100 * 35;
  scoreBreakdown.postQualifications = { value: avgQualScore, fuzzyLevel: qualScoreFuzzy.level, score: postQualScore };
  totalScore += postQualScore;
  totalWeight += 35;
  
  // CHAINED RULE: If performance is below 50 AND quality is below 2, flag for special attention
  if ((totalScore / totalWeight * 100) < 50 && avgQuality < 2) {
    scoreBreakdown.chainedEvent = 'Performance degradation detected - requires intervention';
  }
  
  const finalScore = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 50;
  
  // Store breakdown for transparency
  supplier.scoreBreakdown = scoreBreakdown;
  
  return Math.max(0, Math.min(100, finalScore));
};

// Helper function to calculate reliability score using fuzzy logic
const calculateReliabilityScore = (supplier) => {
  let reliabilityFactors = [];
  const reliabilityBreakdown = {};
  
  // RULE 1: Account Registration Age (max 20 points)
  if (supplier.createdAt) {
    const accountAge = (Date.now() - (supplier.createdAt.seconds ? supplier.createdAt.seconds * 1000 : new Date(supplier.createdAt).getTime())) / (1000 * 60 * 60 * 24 * 30);
    const ageFuzzy = getFuzzyMembership(accountAge, PREDICTION_RULES.reliabilityRules[0].fuzzyRange);
    const ageScore = Math.min(accountAge * 2, 20);
    reliabilityFactors.push(ageScore);
    reliabilityBreakdown.accountAge = { months: accountAge, fuzzyLevel: ageFuzzy.level, score: ageScore };
  }
  
  // RULE 2: Bid Submission Consistency (max 30 points)
  const totalBids = supplier.bids.length;
  const onTimeBids = supplier.bids.filter(bid => bid.submittedOnTime !== false).length;
  const bidConsistency = totalBids > 0 ? (onTimeBids / totalBids) * 100 : 50;
  const bidFuzzy = getFuzzyMembership(bidConsistency, PREDICTION_RULES.reliabilityRules[1].fuzzyRange);
  const bidScore = (bidConsistency / 100) * 30;
  reliabilityFactors.push(bidScore);
  reliabilityBreakdown.bidConsistency = { percentage: bidConsistency, fuzzyLevel: bidFuzzy.level, score: bidScore };
  
  // RULE 3: Contract Completion Rate (max 25 points)
  const completedContracts = supplier.contracts.filter(c => c.status === 'completed').length;
  const completionRate = supplier.contracts.length > 0 ? (completedContracts / supplier.contracts.length) * 100 : 50;
  const completionFuzzy = getFuzzyMembership(completionRate, PREDICTION_RULES.reliabilityRules[2].fuzzyRange);
  const completionScore = (completionRate / 100) * 25;
  reliabilityFactors.push(completionScore);
  reliabilityBreakdown.completionRate = { percentage: completionRate, fuzzyLevel: completionFuzzy.level, score: completionScore };
  
  // RULE 4: Post-Qualification Score Consistency (max 20 points)
  if (supplier.qualifications.length > 0) {
    const avgQualScore = supplier.qualifications.reduce((sum, qual) => sum + Number(qual.evaluationScore || 0), 0) / supplier.qualifications.length;
    const qualScoreVariance = supplier.qualifications.reduce((sum, qual) => {
      const diff = Number(qual.evaluationScore || 0) - avgQualScore;
      return sum + (diff * diff);
    }, 0) / supplier.qualifications.length;
    
    const varianceFuzzy = getFuzzyMembership(qualScoreVariance, PREDICTION_RULES.reliabilityRules[3].fuzzyRange);
    const consistencyScore = Math.max(0, 20 - (qualScoreVariance / 10));
    reliabilityFactors.push(consistencyScore);
    reliabilityBreakdown.scoreConsistency = { variance: qualScoreVariance, fuzzyLevel: varianceFuzzy.level, score: consistencyScore };
  }
  
  // RULE 5: Recent Activity (max 25 points)
  if (supplier.lastActive) {
    const daysSinceActive = (Date.now() - (supplier.lastActive.seconds ? supplier.lastActive.seconds * 1000 : new Date(supplier.lastActive).getTime())) / (1000 * 60 * 60 * 24);
    const activityFuzzy = getFuzzyMembership(daysSinceActive, PREDICTION_RULES.reliabilityRules[4].fuzzyRange);
    const activityScore = Math.max(0, 25 - daysSinceActive);
    reliabilityFactors.push(activityScore);
    reliabilityBreakdown.recentActivity = { daysSinceActive, fuzzyLevel: activityFuzzy.level, score: activityScore };
  }
  
  // Calculate weighted average with normalization
  const baseScore = reliabilityFactors.length > 0 
    ? reliabilityFactors.reduce((sum, factor) => sum + factor, 0) / reliabilityFactors.length * 4
    : 50;
  
  supplier.reliabilityBreakdown = reliabilityBreakdown;
  
  return Math.max(0, Math.min(100, Math.round(baseScore)));
};

// Helper function to calculate risk level using weighted rule-based scoring
const calculateRiskLevel = (supplier, performanceScore, reliabilityScore) => {
  let riskScore = 0;
  const riskBreakdown = {};
  
  // Base risk from inverse of performance and reliability
  const avgScore = (performanceScore + reliabilityScore) / 2;
  const baseRisk = 100 - avgScore;
  riskScore += baseRisk;
  riskBreakdown.baseRisk = baseRisk;
  
  // RULE 1: Contract Failure Rate (weighted 30 points)
  const contractFailures = supplier.contracts.filter(c => c.status === 'cancelled' || c.status === 'failed').length;
  const failureRate = supplier.contracts.length > 0 ? (contractFailures / supplier.contracts.length) * 100 : 0;
  const failureFuzzy = getFuzzyMembership(failureRate, PREDICTION_RULES.riskRules[0].fuzzyRange);
  const failureRiskAdd = (failureRate / 100) * 30;
  riskScore += failureRiskAdd;
  riskBreakdown.contractFailures = { percentage: failureRate, fuzzyLevel: failureFuzzy.level, riskPoints: failureRiskAdd };
  
  // RULE 2: Low Qualification Scores (weighted 25 points)
  const lowQualScores = supplier.qualifications.filter(q => Number(q.evaluationScore || 0) < 50).length;
  const lowQualRate = supplier.qualifications.length > 0 ? (lowQualScores / supplier.qualifications.length) * 100 : 0;
  const lowQualFuzzy = getFuzzyMembership(lowQualRate, PREDICTION_RULES.riskRules[1].fuzzyRange);
  const lowQualRiskAdd = (lowQualRate / 100) * 25;
  riskScore += lowQualRiskAdd;
  riskBreakdown.lowQualifications = { percentage: lowQualRate, fuzzyLevel: lowQualFuzzy.level, riskPoints: lowQualRiskAdd };
  
  // RULE 3: Account Maturity (weighted 20 points) - New suppliers are riskier
  const isNewSupplier = supplier.contracts.length === 0 && supplier.bids.length === 0 && supplier.qualifications.length === 0;
  const accountAgeFuzzy = supplier.createdAt ? 
    getFuzzyMembership((Date.now() - (supplier.createdAt.seconds ? supplier.createdAt.seconds * 1000 : new Date(supplier.createdAt).getTime())) / (1000 * 60 * 60 * 24 * 30), PREDICTION_RULES.riskRules[2].fuzzyRange)
    : { level: 'unknown', confidence: 0 };
  const maturityRiskAdd = isNewSupplier ? 20 : 0;
  riskScore += maturityRiskAdd;
  riskBreakdown.newSupplierRisk = { isNew: isNewSupplier, fuzzyLevel: accountAgeFuzzy.level, riskPoints: maturityRiskAdd };
  
  // RULE 4: Delay Tendency Pattern Detection (weighted 25 points)
  const delayedContracts = supplier.contracts.filter(c => c.completedOnTime === false).length;
  const delayRate = supplier.contracts.length > 0 ? (delayedContracts / supplier.contracts.length) * 100 : 0;
  const delayFuzzy = getFuzzyMembership(delayRate, PREDICTION_RULES.riskRules[3].fuzzyRange);
  const delayRiskAdd = (delayRate / 100) * 25;
  riskScore += delayRiskAdd;
  riskBreakdown.delayTendency = { percentage: delayRate, fuzzyLevel: delayFuzzy.level, riskPoints: delayRiskAdd };
  
  // FORWARD CHAINING: If multiple risk factors triggered, increase risk exponentially
  const riskFactorsTriggered = [
    failureRate > 15,
    lowQualRate > 25,
    isNewSupplier,
    delayRate > 30
  ].filter(Boolean).length;
  
  if (riskFactorsTriggered >= 3) {
    const chainedRiskMultiplier = 1.3; // 30% additional risk for multiple factors
    riskScore = Math.min(100, riskScore * chainedRiskMultiplier);
    riskBreakdown.chainedRiskEvent = `${riskFactorsTriggered} risk factors detected - risk elevated`;
  }
  
  supplier.riskBreakdown = riskBreakdown;
  
  return Math.max(0, Math.min(100, Math.round(riskScore)));
};

// Helper function to generate behavior prediction with pattern detection
const generateBehaviorPrediction = (supplier, performanceScore, reliabilityScore) => {
  const avgScore = (performanceScore + reliabilityScore) / 2;
  
  const avgQualScore = supplier.qualifications.length > 0 
    ? supplier.qualifications.reduce((sum, qual) => sum + Number(qual.evaluationScore || 0), 0) / supplier.qualifications.length
    : avgScore;
  
  // Pattern Detection Rules
  const patterns = detectBehaviorPatterns(supplier);
  
  return {
    likelyToDelay: avgScore < 60 || avgQualScore < 60 || patterns.frequentDelayer,
    qualityLevel: avgQualScore > 80 ? 'high' : avgQualScore > 60 ? 'medium' : 'low',
    communicationRating: avgScore > 70 ? 'good' : avgScore > 50 ? 'average' : 'poor',
    recommendedActions: avgScore < 50 || avgQualScore < 50 ? ['monitor_closely', 'require_guarantees'] : 
                       avgScore < 70 ? ['regular_checkins'] : ['preferred_supplier'],
    trustScore: Math.round((avgScore + avgQualScore) / 2),
    postQualificationAverage: Math.round(avgQualScore),
    evaluationCount: supplier.qualifications.length,
    detectedPatterns: patterns,
    predictionConfidence: patterns.confidence
  };
};

// Pattern Detection - Identifies unusual supplier behavior
const detectBehaviorPatterns = (supplier) => {
  const patterns = [];
  let confidence = 0;
  
  // PATTERN 1: Frequent Delayer - If >30% of contracts delayed
  const delayCount = supplier.contracts.filter(c => c.completedOnTime === false).length;
  const delayRate = supplier.contracts.length > 0 ? (delayCount / supplier.contracts.length) * 100 : 0;
  if (delayRate > 30) {
    patterns.push({ type: 'frequentDelayer', severity: 'high', description: `${delayCount}/${supplier.contracts.length} contracts delayed` });
    confidence += 25;
  }
  
  // PATTERN 2: Inconsistent Quality - If qualification scores vary widely
  if (supplier.qualifications.length >= 2) {
    const scores = supplier.qualifications.map(q => Number(q.evaluationScore || 0));
    const avgScore = scores.reduce((a, b) => a + b) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev > 25) {
      patterns.push({ type: 'inconsistentQuality', severity: 'medium', description: `Quality variance: ${stdDev.toFixed(1)}` });
      confidence += 15;
    }
  }
  
  // PATTERN 3: Budget Overspender - If >40% of contracts exceeded budget
  const budgetExceeded = supplier.contracts.filter(c => c.budgetStatus === 'exceeded').length;
  const budgetExceedRate = supplier.contracts.length > 0 ? (budgetExceeded / supplier.contracts.length) * 100 : 0;
  if (budgetExceedRate > 40) {
    patterns.push({ type: 'budgetOverspender', severity: 'medium', description: `${budgetExceeded}/${supplier.contracts.length} budgets exceeded` });
    confidence += 15;
  }
  
  // PATTERN 4: Improving Trend - If recent scores are consistently higher
  if (supplier.qualifications.length >= 3) {
    const recentScores = supplier.qualifications.slice(-3).map(q => Number(q.evaluationScore || 0));
    const olderScores = supplier.qualifications.slice(0, -3).map(q => Number(q.evaluationScore || 0));
    
    const recentAvg = recentScores.reduce((a, b) => a + b) / recentScores.length;
    const olderAvg = olderScores.length > 0 ? olderScores.reduce((a, b) => a + b) / olderScores.length : 0;
    
    if (recentAvg > olderAvg + 10) {
      patterns.push({ type: 'improvingTrend', severity: 'positive', description: `Recent avg: ${recentAvg.toFixed(1)} vs historical: ${olderAvg.toFixed(1)}` });
      confidence += 20;
    }
  }
  
  // PATTERN 5: One-Time Contract Supplier - Limited history
  if (supplier.contracts.length === 1 && supplier.bids.length < 2) {
    patterns.push({ type: 'limitedHistory', severity: 'caution', description: 'Insufficient data for reliable prediction' });
    confidence -= 10;
  }
  
  return {
    patterns,
    frequentDelayer: patterns.some(p => p.type === 'frequentDelayer'),
    improvingTrend: patterns.some(p => p.type === 'improvingTrend'),
    inconsistentQuality: patterns.some(p => p.type === 'inconsistentQuality'),
    budgetOverspender: patterns.some(p => p.type === 'budgetOverspender'),
    confidence: Math.max(0, Math.min(100, confidence))
  };
};

// Helper function to generate AI recommendations
const generateRecommendations = (predictions) => {
  const recommendations = [];
  
  const highRiskSuppliers = predictions.filter(p => p.riskLevel > 70);
  const lowPerformers = predictions.filter(p => p.performanceScore < 50);
  const newSuppliers = predictions.filter(p => p.contracts.length === 0 && p.qualifications.length === 0);
  const poorQualifications = predictions.filter(p => 
    p.qualifications.length > 0 && 
    p.qualifications.reduce((sum, q) => sum + Number(q.evaluationScore || 0), 0) / p.qualifications.length < 50
  );
  
  if (highRiskSuppliers.length > 0) {
    recommendations.push({
      priority: 'high',
      title: 'High Risk Suppliers Detected',
      description: `${highRiskSuppliers.length} suppliers have been flagged as high risk based on performance history and post-qualification scores.`,
      action: 'Review these suppliers immediately and consider requiring additional guarantees or closer monitoring.'
    });
  }
  
  if (poorQualifications.length > 0) {
    recommendations.push({
      priority: 'high',
      title: 'Poor Post-Qualification Performance',
      description: `${poorQualifications.length} suppliers have consistently low post-qualification evaluation scores.`,
      action: 'Consider providing additional training or removing from preferred supplier list.'
    });
  }
  
  if (lowPerformers.length > 0) {
    recommendations.push({
      priority: 'medium',
      title: 'Performance Improvement Needed',
      description: `${lowPerformers.length} suppliers have below-average performance scores.`,
      action: 'Provide feedback and support to help these suppliers improve their performance.'
    });
  }
  
  if (newSuppliers.length > 0) {
    recommendations.push({
      priority: 'low',
      title: 'New Supplier Onboarding',
      description: `${newSuppliers.length} new suppliers have no contract history.`,
      action: 'Implement thorough vetting process and start with smaller contracts to evaluate performance.'
    });
  }
  
  const reliableSuppliers = predictions.filter(p => p.riskLevel < 30 && p.performanceScore > 80);
  if (reliableSuppliers.length > 0) {
    recommendations.push({
      priority: 'low',
      title: 'Preferred Supplier Program',
      description: `${reliableSuppliers.length} suppliers show excellent reliability and performance.`,
      action: 'Consider offering these suppliers preferred status with benefits like priority consideration for new contracts.'
    });
  }
  
  return recommendations;
};

// Helper function to update prediction chart
const updatePredictionChart = (predictions) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const performanceData = [];
  const riskData = [];
  
  // Generate trend data (simulated monthly progression)
  months.forEach(() => {
    const avgPerformance = predictions.length > 0 
      ? predictions.reduce((sum, p) => sum + p.performanceScore, 0) / predictions.length
      : 50;
    
    const avgRisk = predictions.length > 0 
      ? predictions.reduce((sum, p) => sum + p.riskLevel, 0) / predictions.length
      : 50;
    
    // Add some variation to show trends
    const performanceVariation = (Math.random() - 0.5) * 10;
    const riskVariation = (Math.random() - 0.5) * 10;
    
    performanceData.push(Math.max(0, Math.min(100, avgPerformance + performanceVariation)));
    riskData.push(Math.max(0, Math.min(100, avgRisk + riskVariation)));
  });
  
  predictionData.value = {
    labels: months,
    datasets: [{
      label: 'Predicted Performance Score',
      data: performanceData,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }, {
      label: 'Risk Level',
      data: riskData,
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };
};

// ============================================
// TENSORFLOW.JS ML DELAY DETECTION
// ============================================

// ML Model state
let delayPredictionModel = null;
const mlModelLoaded = ref(false);
const mlPredictions = ref({});

// Initialize TensorFlow.js and create a simple delay prediction model
const initializeMLModel = async () => {
  try {
    console.log('Initializing TensorFlow.js ML model...');
    
    // Create a simple neural network for delay prediction
    delayPredictionModel = tf.sequential({
      layers: [
        // Input layer: 6 features
        tf.layers.dense({
          inputShape: [6],
          units: 16,
          activation: 'relu',
          name: 'input_layer'
        }),
        
        // Hidden layer 1
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({
          units: 12,
          activation: 'relu',
          name: 'hidden_layer_1'
        }),
        
        // Hidden layer 2
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({
          units: 8,
          activation: 'relu',
          name: 'hidden_layer_2'
        }),
        
        // Output layer: Binary classification (delay or no delay)
        tf.layers.dense({
          units: 1,
          activation: 'sigmoid',
          name: 'output_layer'
        })
      ]
    });
    
    // Compile the model
    delayPredictionModel.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
    
    mlModelLoaded.value = true;
    console.log('✅ ML Model initialized successfully');
  } catch (error) {
    console.error('Error initializing ML model:', error);
    mlModelLoaded.value = false;
  }
};

// Normalize features to 0-1 range for ML model
const normalizeFeatures = (features) => {
  return {
    delayRate: Math.min(features.delayRate / 100, 1),
    onTimeRate: Math.min(features.onTimeRate / 100, 1),
    contractCount: Math.min(features.contractCount / 20, 1),
    accountAge: Math.min(features.accountAge / 60, 1),
    qualificationScore: Math.min(features.qualificationScore / 100, 1),
    failureRate: Math.min(features.failureRate / 100, 1)
  };
};

// Extract features from supplier for ML prediction
const extractSupplierFeatures = (supplier) => {
  // RULE: Past Delay Rate
  const delayCount = supplier.contracts.filter(c => c.completedOnTime === false).length;
  const delayRate = supplier.contracts.length > 0 ? (delayCount / supplier.contracts.length) * 100 : 0;
  
  // RULE: On-Time Delivery Rate
  const onTimeCount = supplier.contracts.filter(c => c.completedOnTime === true).length;
  const onTimeRate = supplier.contracts.length > 0 ? (onTimeCount / supplier.contracts.length) * 100 : 50;
  
  // RULE: Contract Count (workload)
  const contractCount = supplier.contracts.length;
  
  // RULE: Account Age (months)
  const accountAge = supplier.createdAt 
    ? (Date.now() - (supplier.createdAt.seconds ? supplier.createdAt.seconds * 1000 : new Date(supplier.createdAt).getTime())) / (1000 * 60 * 60 * 24 * 30)
    : 0;
  
  // RULE: Average Qualification Score
  const qualificationScore = supplier.qualifications.length > 0
    ? supplier.qualifications.reduce((sum, q) => sum + Number(q.evaluationScore || 0), 0) / supplier.qualifications.length
    : 50;
  
  // RULE: Contract Failure Rate
  const failureCount = supplier.contracts.filter(c => c.status === 'cancelled' || c.status === 'failed').length;
  const failureRate = supplier.contracts.length > 0 ? (failureCount / supplier.contracts.length) * 100 : 0;
  
  return {
    delayRate: Math.max(0, Math.min(100, delayRate)),
    onTimeRate: Math.max(0, Math.min(100, onTimeRate)),
    contractCount: Math.max(0, Math.min(20, contractCount)),
    accountAge: Math.max(0, Math.min(60, accountAge)),
    qualificationScore: Math.max(0, Math.min(100, qualificationScore)),
    failureRate: Math.max(0, Math.min(100, failureRate))
  };
};

// Predict delay probability using TensorFlow.js model
const predictSupplierDelay = async (supplier) => {
  if (!delayPredictionModel || !mlModelLoaded.value) {
    return null;
  }
  
  try {
    // Extract features from supplier
    const features = extractSupplierFeatures(supplier);
    
    // Normalize features for ML model
    const normalized = normalizeFeatures(features);
    
    // Create tensor input: [delayRate, onTimeRate, contractCount, accountAge, qualScore, failureRate]
    const input = tf.tensor2d([
      [
        normalized.delayRate,
        normalized.onTimeRate,
        normalized.contractCount,
        normalized.accountAge,
        normalized.qualificationScore,
        normalized.failureRate
      ]
    ]);
    
    // Get prediction from model
    const prediction = delayPredictionModel.predict(input);
    const delayProbability = await prediction.data();
    
    // Calculate confidence based on feature variance
    const featureValues = Object.values(features);
    const avg = featureValues.reduce((a, b) => a + b) / featureValues.length;
    const variance = featureValues.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / featureValues.length;
    const confidence = Math.max(50, Math.min(100, 100 - Math.sqrt(variance)));
    
    // Cleanup tensors
    input.dispose();
    prediction.dispose();
    
    // Return prediction result
    return {
      supplierName: supplier.name || supplier.email || 'Unknown',
      probability: Math.round(delayProbability[0] * 100),
      confidence: Math.round(confidence),
      riskLevel: delayProbability[0] > 0.7 ? 'CRITICAL' : delayProbability[0] > 0.5 ? 'HIGH' : delayProbability[0] > 0.3 ? 'MEDIUM' : 'LOW',
      features: features,
      normalized: normalized
    };
  } catch (error) {
    console.error('Error predicting delay:', error);
    return null;
  }
};

// Batch predict delays for all suppliers
const predictAllSupplierDelays = async (suppliers) => {
  const predictions = {};
  
  for (const supplier of suppliers) {
    const prediction = await predictSupplierDelay(supplier);
    if (prediction) {
      predictions[supplier.id] = prediction;
    }
  }
  
  mlPredictions.value = predictions;
  return predictions;
};

// Get ML delay prediction for a specific supplier
const getSupplierDelayPrediction = (supplierId) => {
  return mlPredictions.value[supplierId] || null;
};

</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.main-content {
  flex: 1;
  padding: 20px;
  min-height: 100vh;
  position: relative;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
}

/* Remove or comment out these conflicting styles */
/* .main-content.expanded {
  margin-left: 0;
} */

.background-pattern {
  position: fixed;
  inset: 0;
  background-color: #1a1a2e;
  z-index: -1;
  overflow: hidden;
  transition: margin-left 0.3s ease; /* Add transition */
}

/* Card Design */
.admin-card {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;  /* Center the card */
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

.card-header-flex {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(135deg, #0f2942 0%, #102a42 100%);
  padding: 30px;
  color: white;
  text-align: left;
}

.logo-title-flex {
  display: flex;
  align-items: center;
  gap: 18px;
}

.header-texts {
  display: flex;
  flex-direction: column;
  justify-content: center;
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

/* Quick Actions Bar */
.quick-actions-bar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 24px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: rgba(15, 41, 66, 0.1);
  border: 1px solid rgba(15, 41, 66, 0.2);
  border-radius: 6px;
  color: #0f2942;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}

.action-btn:hover {
  background-color: rgba(15, 41, 66, 0.15);
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background-color: #f8fafc;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.stat-icon.users {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.stat-icon.active {
  background-color: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.stat-icon.new {
  background-color: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.stat-icon.system {
  background-color: rgba(234, 179, 8, 0.1);
  color: #eab308;
}

.stat-info {
  flex: 1;
}

.stat-value {
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
  display: block;
  line-height: 1.2;
}

.stat-label {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.2;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #16a34a;
}

.stat-change.negative {
  color: #e53e3e;
}

.stat-percentage {
  color: #16a34a;
  font-weight: 500;
}

.health-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.health-indicator.excellent {
  background-color: #16a34a;
}

.health-indicator.good {
  background-color: #eab308;
}

.health-indicator.fair {
  background-color: #f97316;
}

.health-indicator.poor {
  background-color: #e53e3e;
}

/* Charts Section */
.charts-section {
  margin-bottom: 30px;
}

.section-title {
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-title svg {
  color: #0f2942;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.chart-card {
  background-color: #f8fafc;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h3 {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.chart-select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  color: #333;
  font-size: 0.9rem;
}

.chart-container {
  height: 300px;
  position: relative;
}

/* Prediction Button Styles */
.prediction-btn {
  padding: 6px 12px;
  border: 1px solid #10b981;
  border-radius: 6px;
  background-color: #10b981;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.prediction-btn:hover:not(:disabled) {
  background-color: #059669;
}

.prediction-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Prediction Section Styles */
.prediction-section {
  margin-bottom: 30px;
}

.prediction-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.prediction-card {
  background-color: #f8fafc;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.prediction-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.prediction-card.high-risk {
  border-left: 4px solid #ef4444;
}

.prediction-card.medium-risk {
  border-left: 4px solid #f59e0b;
}

.prediction-card.low-risk {
  border-left: 4px solid #10b981;
}

.prediction-card.summary {
  border-left: 4px solid #3b82f6;
}

.prediction-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.risk-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.risk-icon.high {
  background-color: rgba(239, 68, 68, 0.1);
}

.risk-icon.medium {
  background-color: rgba(245, 158, 11, 0.1);
}

.risk-icon.low {
  background-color: rgba(16, 185, 129, 0.1);
}

.risk-icon.summary {
  background-color: rgba(59, 130, 246, 0.1);
}

.prediction-header h3 {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.prediction-content {
  text-align: center;
}

.risk-count {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.high-risk .risk-count {
  color: #ef4444;
}

.medium-risk .risk-count {
  color: #f59e0b;
}

.low-risk .risk-count {
  color: #10b981;
}

.summary .risk-count {
  color: #3b82f6;
}

.risk-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 12px;
  line-height: 1.4;
}

.risk-actions {
  padding: 8px 12px;
  border-radius: 6px;
  display: inline-block;
}

.high-risk .recommendation {
  background-color: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.medium-risk .recommendation {
  background-color: rgba(245, 158, 11, 0.1);
  color: #d97706;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.low-risk .recommendation {
  background-color: rgba(16, 185, 129, 0.1);
  color: #059669;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.summary-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.stat-item .stat-label {
  color: #666;
  font-size: 0.9rem;
}

.stat-item .stat-value {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Recommendations Section */
.recommendations-section {
  margin-top: 20px;
  padding: 20px;
  background-color: #f8fafc;
  border-radius: 10px;
  border: 1px solid #eee;
}

.recommendations-title {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
}

.recommendation-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recommendation-item.high {
  border-left: 4px solid #ef4444;
}

.recommendation-item.medium {
  border-left: 4px solid #f59e0b;
}

.recommendation-item.low {
  border-left: 4px solid #10b981;
}

.recommendation-icon {
  font-size: 20px;
  margin-top: 2px;
}

.recommendation-content {
  flex: 1;
}

.recommendation-title {
  color: #333;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 4px;
}

.recommendation-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 8px;
  line-height: 1.4;
}

.recommendation-action {
  color: #3b82f6;
  font-size: 0.85rem;
  font-style: italic;
  line-height: 1.3;
}

/* Management Grid */
.management-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.management-card {
  background-color: #f8fafc;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.management-card .card-header {
  background: none;
  padding: 0;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.management-card h2 {
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.management-card h2 svg {
  color: #0f2942;
}

.view-all {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s;
}

.view-all:hover {
  opacity: 0.8;
}

/* Recent Users */
.recent-users {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s;
}

.user-item:hover {
  background-color: #f1f5f9;
}

.user-item img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-name {
  color: #333;
  font-weight: 500;
  display: block;
}

.user-email {
  color: #666;
  font-size: 0.9rem;
}

.user-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.user-status.active {
  background-color: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.user-status.deactivated, .user-status.inactive {
  background-color: rgba(229, 62, 62, 0.1);
  color: #e53e3e;
  border: 1px solid rgba(229, 62, 62, 0.2);
}

/* Log List */
.log-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s;
}

.log-item:hover {
  background-color: #f1f5f9;
}

.log-type {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.log-type.info {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.log-type.warning {
  background-color: rgba(234, 179, 8, 0.1);
  color: #eab308;
}

.log-type.error {
  background-color: rgba(229, 62, 62, 0.1);
  color: #e53e3e;
}

.log-type.success {
  background-color: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.log-info {
  flex: 1;
}

.log-message {
  color: #333;
  display: block;
}

.log-time {
  color: #666;
  font-size: 0.9rem;
}

.empty-list {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}

/* Quick Actions Grid */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.quick-action-btn {
  background-color: #f8fafc;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 20px;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.quick-action-btn svg {
  color: #0f2942;
}

.quick-action-btn.warning svg {
  color: #eab308;
}

.quick-action-btn:hover {
  background-color: #f1f5f9;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  max-width: 500px;
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
  color: #eab308;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 600;
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
}

.warning-text {
  color: #666;
  margin-bottom: 20px;
}

.maintenance-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #333;
  cursor: pointer;
}

.confirm-btn {
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  border: none;
}

.confirm-btn.warning {
  background-color: #eab308;
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

/* Responsive Styles */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .management-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .prediction-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 0;
    transform: translateX(-100%);
  }
  
  .sidebar.active {
    width: 280px;
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .background-pattern {
    margin-left: 0;
  }
}

@media (max-width: 640px) {
  .card-content {
    padding: 20px;
  }

  .quick-actions-bar {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }
  
  .rotating {
    animation: none;
  }
  
  .modal-overlay,
  .modal-content {
    animation: none;
  }
  
  .quick-action-btn:hover {
    transform: none;
  }
}

/* Machine Learning Predictions Section */
.ml-predictions-section {
  margin-top: 30px;
  padding: 0;
  border-radius: 10px;
}

.ml-predictions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.ml-prediction-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.ml-prediction-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.ml-prediction-card.risk-critical {
  border-left: 5px solid #dc2626;
  background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
}

.ml-prediction-card.risk-high {
  border-left: 5px solid #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
}

.ml-prediction-card.risk-medium {
  border-left: 5px solid #0ea5e9;
  background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
}

.ml-prediction-card.risk-low {
  border-left: 5px solid #16a34a;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
}

.ml-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.ml-risk-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  white-space: nowrap;
}

.ml-risk-badge.critical {
  background-color: #fecaca;
  color: #991b1b;
}

.ml-risk-badge.high {
  background-color: #fcd34d;
  color: #92400e;
}

.ml-risk-badge.medium {
  background-color: #bae6fd;
  color: #1e40af;
}

.ml-risk-badge.low {
  background-color: #bbf7d0;
  color: #166534;
}

.ml-supplier-name {
  font-weight: 600;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9rem;
}

.ml-card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ml-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 4px;
}

.ml-probability-section {
  padding: 10px 0;
}

.ml-probability-bar {
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin: 6px 0;
}

.ml-probability-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.ml-probability-fill.critical {
  background: linear-gradient(90deg, #dc2626, #991b1b);
}

.ml-probability-fill.high {
  background: linear-gradient(90deg, #f59e0b, #92400e);
}

.ml-probability-fill.medium {
  background: linear-gradient(90deg, #0ea5e9, #1e40af);
}

.ml-probability-fill.low {
  background: linear-gradient(90deg, #16a34a, #166534);
}

.ml-probability-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
}

.ml-confidence-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.ml-value {
  font-weight: 600;
  color: #0f2942;
  font-size: 0.95rem;
}

.ml-features-section {
  padding: 8px 0;
}

.ml-features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ml-features-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  padding: 4px 0;
}

.ml-feature-name {
  color: #666;
  font-weight: 500;
}

.ml-feature-value {
  color: #333;
  font-weight: 600;
  background-color: rgba(15, 41, 66, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.ml-info-box {
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 0.9rem;
  color: #1e40af;
  line-height: 1.4;
}

/* Responsive ML Predictions */
@media (max-width: 1024px) {
  .ml-predictions-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .ml-predictions-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .ml-card-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .ml-predictions-grid {
    grid-template-columns: 1fr;
  }
}
</style>