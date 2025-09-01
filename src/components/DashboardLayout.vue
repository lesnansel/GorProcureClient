<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside :class="[
      'bg-white dark:bg-gray-800 shadow-lg transition-all duration-300',
      sidebarOpen ? 'w-64' : 'w-20'
    ]" class="h-screen">
      <div class="p-4 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2a1 1 0 011-1h8a1 1 0 011 1z" clip-rule="evenodd" />
          </svg>
          <span :class="[sidebarOpen ? 'block' : 'hidden']" class="font-bold text-lg">GovProcureX</span>
        </div>
        <button @click="toggleSidebar" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
      </div>
      
      <nav class="mt-6">
        <div v-for="(item, index) in navigationItems" :key="index" class="px-4 py-2">
          <router-link :to="item.path" class="flex items-center py-2 px-4 rounded-lg transition-colors" 
            :class="[
              $route.path.includes(item.path) ? 
                'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 
                'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]">
            <component :is="item.icon" class="h-5 w-5" />
            <span :class="[sidebarOpen ? 'ml-3 block' : 'hidden']">{{ item.name }}</span>
          </router-link>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navigation -->
      <header class="bg-white dark:bg-gray-800 shadow-sm z-10">
        <div class="px-4 py-3 flex justify-between items-center">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold">{{ pageTitle }}</h1>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <div class="relative">
              <button @click="toggleNotifications" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span v-if="notifications.length > 0" class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {{ notifications.length }}
                </span>
              </button>
              
              <!-- Notifications Dropdown -->
              <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border dark:border-gray-700">
                <div class="px-4 py-2 border-b dark:border-gray-700 flex justify-between items-center">
                  <h3 class="font-semibold">Notifications</h3>
                  <button @click="markAllAsRead" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Mark all as read
                  </button>
                </div>
                <div class="max-h-64 overflow-y-auto">
                  <div v-if="notifications.length === 0" class="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                    No new notifications
                  </div>
                  <div v-for="(notification, idx) in notifications" :key="idx" 
                    class="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-0">
                    <div class="flex items-start">
                      <div class="flex-shrink-0 mr-3">
                        <div :class="[
                          'rounded-full w-8 h-8 flex items-center justify-center',
                          notification.type === 'warning' ? 'bg-yellow-100 text-yellow-500' : 
                          notification.type === 'alert' ? 'bg-red-100 text-red-500' : 
                          'bg-blue-100 text-blue-500'
                        ]">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p class="text-sm font-medium">{{ notification.message }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ notification.time }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="px-4 py-2 border-t dark:border-gray-700 text-center">
                  <button class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Dark Mode Toggle -->
            <button @click="toggleDarkMode" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            
            <!-- User Menu -->
            <div class="relative">
              <button @click="toggleUserMenu" class="flex items-center space-x-2 focus:outline-none">
                <img src="/placeholder.svg?height=32&width=32" alt="User Avatar" class="h-8 w-8 rounded-full" />
                <span :class="[sidebarOpen ? 'block' : 'hidden']" class="text-sm font-medium">{{ userName }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- User Dropdown -->
              <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border dark:border-gray-700">
                <router-link to="/profile-display" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Your Profile
                </router-link>
                <router-link to="/edit-profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Settings
                </router-link>
                <div class="border-t dark:border-gray-700"></div>
                <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { logoutUser } from '../router';

export default {
  name: 'DashboardLayout',
  props: {
    pageTitle: {
      type: String,
      default: 'Dashboard'
    },
    userRole: {
      type: String,
      default: 'user'
    }
  },
  setup(props) {
    const router = useRouter();
    const sidebarOpen = ref(true);
    const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');
    const showNotifications = ref(false);
    const showUserMenu = ref(false);
    const userName = ref('User Name');
    
    // Sample notifications
    const notifications = ref([
      { 
        type: 'alert', 
        message: 'PR #1234 is pending approval for more than 3 days', 
        time: '2 hours ago' 
      },
      { 
        type: 'warning', 
        message: 'Bid evaluation deadline approaching for ITB #5678', 
        time: '5 hours ago' 
      },
      { 
        type: 'info', 
        message: 'New bid submitted by Supplier XYZ', 
        time: '1 day ago' 
      }
    ]);

    // Navigation items based on user role
    const navigationItems = computed(() => {
      const items = [
        { 
          name: 'Dashboard', 
          path: '/dashboard', 
          icon: 'HomeIcon',
          roles: ['admin', 'user', 'supplier', 'finance']
        },
        { 
          name: 'Purchase Requests', 
          path: '/procurement-plan', 
          icon: 'ClipboardIcon',
          roles: ['admin', 'user']
        },
        { 
          name: 'Bid Invitations', 
          path: '/invitation-to-bid', 
          icon: 'DocumentTextIcon',
          roles: ['admin', 'supplier']
        },
        { 
          name: 'Submit Bid', 
          path: '/submit-bid', 
          icon: 'DocumentAddIcon',
          roles: ['supplier']
        },
        { 
          name: 'Bid Evaluation', 
          path: '/evaluate-bids', 
          icon: 'ChartSquareBarIcon',
          roles: ['admin']
        },
        { 
          name: 'Contracts', 
          path: '/contract-management', 
          icon: 'DocumentDuplicateIcon',
          roles: ['admin', 'supplier']
        },
        { 
          name: 'Payments', 
          path: '/payment-processing', 
          icon: 'CashIcon',
          roles: ['admin', 'finance', 'supplier']
        },
        { 
          name: 'Reports', 
          path: '/reports', 
          icon: 'ChartBarIcon',
          roles: ['admin', 'finance']
        },
        { 
          name: 'User Management', 
          path: '/admin-management', 
          icon: 'UsersIcon',
          roles: ['admin']
        }
      ];
      
      return items.filter(item => item.roles.includes(props.userRole));
    });

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
    };

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      localStorage.setItem('darkMode', isDarkMode.value);
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      if (showNotifications.value) {
        showUserMenu.value = false;
      }
    };

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
      if (showUserMenu.value) {
        showNotifications.value = false;
      }
    };

    const markAllAsRead = () => {
      notifications.value = [];
    };

    const logout = async () => {
      await logoutUser();
      router.push('/login');
    };

    // Close dropdowns when clicking outside
    onMounted(() => {
      document.addEventListener('click', (event) => {
        const target = event.target;
        if (!target.closest('.relative')) {
          showNotifications.value = false;
          showUserMenu.value = false;
        }
      });
    });

    return {
      sidebarOpen,
      isDarkMode,
      showNotifications,
      showUserMenu,
      userName,
      notifications,
      navigationItems,
      toggleSidebar,
      toggleDarkMode,
      toggleNotifications,
      toggleUserMenu,
      markAllAsRead,
      logout
    };
  },
  components: {
    HomeIcon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>`
    },
    ClipboardIcon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
      </svg>`
    },
    DocumentTextIcon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
      </svg>`
    },
    DocumentAddIcon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clip-rule="evenodd" />
      </svg>`
    },
    ChartSquareBarIcon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clip-rule="evenodd" />
      </svg>`
    },
    DocumentDuplicateIcon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
        <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      </svg>`
    },
    CashIcon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
      </svg>`
    },
    ChartBarIcon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>`
    },
    UsersIcon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>`
    }
  }
}
</script>
