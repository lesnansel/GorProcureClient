<template>
  <div class="notifications-wrapper">
    <h2 class="notifications-title">Notifications</h2>
    <div v-if="loading" class="loading-state">Loading notifications...</div>
    <div v-else-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-else>
      <div v-if="notifications.length === 0" class="no-notifications">No notifications yet.</div>
      <ul v-else class="notifications-list">
        <li v-for="notif in notifications" :key="notif.id" :class="['notification-item', notif.read ? 'read' : 'unread']">
          <div class="notif-content">
            <span class="notif-message">{{ notif.message }}</span>
            <span class="notif-date">{{ formatDate(notif.timestamp) }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db, auth } from '@/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export default {
  name: 'UserNotifications',
  setup() {
    const loading = ref(true);
    const errorMessage = ref('');
    const notifications = ref([]);

    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch {
        return 'N/A';
      }
    };

    onMounted(async () => {
      loading.value = true;
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          errorMessage.value = 'You must be logged in to view notifications.';
          loading.value = false;
          return;
        }
        const notifQuery = query(
          collection(db, 'notifications'),
          where('userId', '==', currentUser.uid),
          orderBy('timestamp', 'desc')
        );
        const querySnapshot = await getDocs(notifQuery);
        notifications.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        errorMessage.value = 'Error loading notifications: ' + error.message;
      } finally {
        loading.value = false;
      }
    });

    return {
      loading,
      errorMessage,
      notifications,
      formatDate
    };
  }
};
</script>

<style scoped>
.notifications-wrapper {
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  padding: 32px 24px;
  color: #1e293b;
}
.notifications-title {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 18px;
  color: #0f2942;
}
.loading-state {
  color: #334155;
  font-size: 1.1rem;
  font-weight: 600;
}
.error-message {
  color: #b91c1c;
  font-weight: 700;
  margin-bottom: 12px;
}
.no-notifications {
  color: #334155;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  padding: 24px 0;
}
.notifications-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.notification-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
}
.notification-item.unread {
  border-left: 4px solid #0f2942;
}
.notification-item.read {
  opacity: 0.7;
}
.notif-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.notif-message {
  font-weight: 700;
  color: #0f2942;
}
.notif-date {
  font-size: 0.98rem;
  color: #334155;
}
</style>
