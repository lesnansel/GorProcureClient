<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { watch } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useTawk } from './composables/useTawk';

const route = useRoute();
const { loadTawk, unloadTawk, shouldLoadTawk } = useTawk();

let previousUid = null;

const checkTawkStatus = () => {
  const user = auth.currentUser;
  const path = route.path;

  if (user && shouldLoadTawk(path)) {
    if (user.uid !== previousUid) {
      previousUid = user.uid;
      unloadTawk(); // Fully reset Tawk widget

      setTimeout(() => {
        try {
          loadTawk(); // Re-inject after cleanup delay
        } catch (e) {
          console.warn('Tawk load error:', e.message);
        }
      }, 500); // ⏱ Delay to prevent race condition
    }
  } else {
    previousUid = null;
    unloadTawk(); // Clean up if no user or excluded route
  }
};

// 🔁 React to route changes
watch(() => route.path, checkTawkStatus, { immediate: true });

// 👤 React to auth state changes
onAuthStateChanged(auth, checkTawkStatus);
</script>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #e2e5e8;
}

main {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
