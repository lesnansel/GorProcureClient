<template>
  <div>
    <!-- Overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-black bg-opacity-30 z-30 transition-opacity duration-300" @click="toggleSidebar"></div>
    <!-- Sidebar -->
    <aside :class="['fixed top-0 left-0 h-full bg-[#14263d] text-white shadow-lg z-40 transition-transform duration-300', sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64']">
      <!-- Toggle Button (inside sidebar when open) -->
      <button @click="toggleSidebar" class="absolute top-4 right-[-2.5rem] z-50 bg-[#22334a] rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg" v-if="sidebarOpen">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <!-- User Profile Section -->
      <div class="flex flex-col items-center py-6 border-b border-[#22334a]" v-show="sidebarOpen">
        <div class="relative flex flex-col items-center">
          <div class="rounded-full border border-[#3a4a5e] w-20 h-20 flex items-center justify-center mb-2">
            <span class="text-3xl font-semibold">JD</span>
            <span class="absolute bottom-2 right-2 bg-green-700 text-xs px-2 py-0.5 rounded-full font-bold" style="font-size:10px;">USER</span>
          </div>
          <div class="text-lg font-semibold">ansel</div>
          <div class="text-xs text-gray-300">user</div>
        </div>
      </div>
      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto mt-2">
        <div v-show="sidebarOpen" class="px-4 py-2 text-xs text-gray-400 tracking-wider">GENERAL</div>
        <router-link to="/dashboard" class="sidebar-link" active-class="active" :class="{ 'sidebar-link-collapsed': !sidebarOpen }">
          <span v-if="sidebarOpen">Home</span>
          <span v-else><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" /></svg></span>
        </router-link>
        <router-link to="/dashboard" class="sidebar-link" active-class="active" :class="{ 'sidebar-link-collapsed': !sidebarOpen }">
          <span v-if="sidebarOpen">Dashboard</span>
          <span v-else><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg></span>
        </router-link>
        <router-link to="/profile-display" class="sidebar-link" active-class="active" :class="{ 'sidebar-link-collapsed': !sidebarOpen }">
          <span v-if="sidebarOpen">Profile</span>
          <span v-else><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /></svg></span>
        </router-link>
        <div v-show="sidebarOpen" class="px-4 py-2 text-xs text-gray-400 tracking-wider mt-4">PROCUREMENT</div>
        <router-link to="/purchase-request" class="sidebar-link" active-class="active" :class="{ 'sidebar-link-collapsed': !sidebarOpen }">
          <span v-if="sidebarOpen">Request Purchase</span>
          <span v-else><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg></span>
        </router-link>
        <router-link to="/payment-tracking" class="sidebar-link" active-class="active" :class="{ 'sidebar-link-collapsed': !sidebarOpen }">
          <span v-if="sidebarOpen">Track Payments</span>
          <span v-else><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg></span>
        </router-link>
        <router-link to="/approved-purchases" class="sidebar-link" active-class="active" :class="{ 'sidebar-link-collapsed': !sidebarOpen }">
          <span v-if="sidebarOpen">PR Lists</span>
          <span v-else><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></span>
        </router-link>
        <div v-show="sidebarOpen" class="px-4 py-2 text-xs text-gray-400 tracking-wider mt-4">USER MANAGEMENT</div>
        <router-link to="/edit-profile" class="sidebar-link" active-class="active" :class="{ 'sidebar-link-collapsed': !sidebarOpen }">
          <span v-if="sidebarOpen">Edit Profile</span>
          <span v-else><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" /></svg></span>
        </router-link>
        <router-link to="/reset-password" class="sidebar-link" active-class="active" :class="{ 'sidebar-link-collapsed': !sidebarOpen }">
          <span v-if="sidebarOpen">Reset Password</span>
          <span v-else><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m0-6v2m-6 4v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /></svg></span>
        </router-link>
        <div v-show="sidebarOpen" class="px-4 py-2 text-xs text-gray-400 tracking-wider mt-4">ADMIN CONTROLS</div>
        <!-- Add admin links here if needed -->
      </nav>
      <!-- Bottom Action Buttons -->
      <div class="p-4 border-t border-[#22334a] flex flex-col gap-2">
        <router-link to="/profile-display" class="sidebar-action-btn">
          <span class="inline-flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg><span v-if="sidebarOpen">View Profile</span></span>
        </router-link>
        <router-link to="/edit-profile" class="sidebar-action-btn">
          <span class="inline-flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg><span v-if="sidebarOpen">Settings</span></span>
        </router-link>
        <button class="sidebar-action-btn bg-[#2d1a2e] text-red-400 hover:bg-[#3a223a]" @click="$emit('logout')">
          <span class="inline-flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg><span v-if="sidebarOpen">Log Out</span></span>
        </button>
      </div>
    </aside>
    <!-- Floating Toggle Button (always visible when sidebar is closed) -->
    <button v-if="!sidebarOpen" @click="toggleSidebar" class="fixed top-4 left-4 z-50 bg-[#22334a] rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sidebarOpen: true,
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
  },
};
</script>

<style scoped>
.sidebar-link {
  display: block;
  padding: 0.75rem 1.5rem;
  color: #e5e7eb;
  border-radius: 0.375rem;
  margin-bottom: 0.25rem;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
}
.sidebar-link.active,
.sidebar-link.router-link-exact-active {
  background: #1e3350;
  color: #fff;
}
.sidebar-link:hover {
  background: #22334a;
  color: #fff;
}
.sidebar-link-collapsed {
  justify-content: center;
  text-align: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.sidebar-action-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.75rem 1.5rem;
  background: #1e3350;
  color: #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
  border: none;
  cursor: pointer;
}
.sidebar-action-btn:hover {
  background: #22334a;
  color: #fff;
}
</style>
