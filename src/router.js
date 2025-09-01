import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

// Import existing components
import UserRegister from '@/components/User_Register.vue';
import UserLogin from '@/components/User_Login.vue';
import EditUserProfile from '@/components/EditUserProfile.vue';
import UserDashboard from '@/components/User_Dashboard.vue';
import UserProfileDisplay from '@/components/UserProfileDisplay.vue';
import AdminDashboard from '@/components/Admin_Dashboard.vue';
import ResetPassword from '@/components/ResetPassword.vue';
import AdminManagement from "@/components/AdminManagement.vue";
import LandingPage from '@/components/LandingPage.vue';

// Import new procurement-related components
import ProcurementPlan from "@/components/Procurement_Plan.vue";
import InvitationToBid from "@/components/InvitationToBid.vue";
import SubmitBid from "@/components/SubmitBid.vue";
import AdminBidReview from "@/components/AdminBidReview.vue";
import EvaluateBids from "@/components/EvaluateBid.vue";
import PostQualification from "@/components/PostQualification.vue";
import ContractManagement from "@/components/ContractManagement.vue";
import PaymentProcessing from "@/components/PaymentProcessing.vue";
import DashboardLayout from "@/components/DashboardLayout.vue";
import PurchaseRequest from '@/components/PurchaseRequest.vue';
import ApprovedPurchases from "@/components/Approved_Purchases.vue";
import Settings from '@/components/Settings.vue';
import PaymentTracking from '@/components/PaymentTracking.vue';
import RequestDetail from '@/components/RequestDetail.vue';
import BidDetail from '@/components/BidDetail.vue';
import BidEvaluation from '@/components/BidEvaluation.vue';
import AddQualification from '@/components/AddQualification.vue';
import AddContract from '@/components/AddContract.vue';
import AddPayment from '@/components/AddPayment.vue';
import Records from '@/components/Records.vue';
import EditQualification from '@/components/EditQualification.vue';
import QualificationDetails from '@/components/QualificationDetails.vue';

const routes = [
  { path: '/', name: 'LandingPage', component: LandingPage },
  { path: '/register', name: 'UserRegister', component: UserRegister },
  { path: '/login', name: 'UserLogin', component: UserLogin },
  { path: '/edit-profile', name: 'EditUserProfile', component: EditUserProfile, meta: { requiresAuth: true, role: 'user' } },
  { path: '/dashboard', name: 'UserDashboard', component: UserDashboard, meta: { requiresAuth: true, role: 'user' } },
  { path: '/profile-display', name: 'UserProfileDisplay', component: UserProfileDisplay, meta: { requiresAuth: true, role: 'user' } },
  { path: '/admin-dashboard', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: "/admin-management", name: "AdminManagement", component: AdminManagement, meta: { requiresAuth: true, role: "admin" } },
  { path: '/dashboard-layout', name: 'DashboardLayout', component: DashboardLayout, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/purchase-requests', name: 'PurchaseRequests', component: PurchaseRequest, meta: { requiresAuth: true, role: 'user' } },

  // Procurement process routes
  { path: '/procurement-plan', name: 'Procurement_Plan', component: ProcurementPlan, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/invitation-to-bid', name: 'InvitationToBid', component: InvitationToBid, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/submit-bid', name: 'SubmitBid', component: SubmitBid, meta: { requiresAuth: true, role: 'user' } },
  { path: '/admin-bid-review', name: 'AdminBidReview', component: AdminBidReview, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/evaluate-bids', name: 'EvaluateBid', component: EvaluateBids, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/post-qualification', name: 'PostQualification', component: PostQualification, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/contract-management', name: 'ContractManagement', component: ContractManagement, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/payment-processing', name: 'PaymentProcessing', component: PaymentProcessing, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/approved-purchases', name: 'ApprovedPurchases', component: ApprovedPurchases, meta: { requiresAuth: true, role: 'user' } },
  { path: '/settings', name: 'Settings', component: Settings, meta: { requiresAuth: true } },
  { path: '/payment-tracking', name: 'PaymentTracking', component: PaymentTracking, meta: { requiresAuth: true, role: 'user' } },
  { path: '/request-detail/:id', name: 'RequestDetail', component: RequestDetail, meta: { requiresAuth: true } },
  { path: '/bid-detail/:id', name: 'BidDetail', component: BidDetail, meta: { requiresAuth: true } },
  { path: '/bid-evaluation/:id', name: 'BidEvaluation', component: BidEvaluation, meta: { requiresAuth: true } },
  { path: '/add-qualification', name: 'AddQualification', component: AddQualification, meta: { requiresAuth: true } },
  { path: '/add-contract', name: 'AddContract', component: AddContract, meta: { requiresAuth: true } },
  { path: '/add-payment', name: 'AddPayment', component: AddPayment, meta: { requiresAuth: true } },
  { path: '/records', name: 'Records', component: Records },
  { path: '/edit-qualification/:id', name: 'EditQualification', component: EditQualification, meta: { requiresAuth: true } },
  { path: '/qualification-details/:id', name: 'QualificationDetails', component: QualificationDetails, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔹 Navigation Guard to Protect Routes
router.beforeEach(async (to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (to.meta.requiresAuth) {
    if (!user) {
      return next("/login");
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (to.meta.role && to.meta.role !== userData.role) {
          return next("/unauthorized");
        }
      }
    } catch (error) {
      console.error("Error during navigation guard:", error);
      return next("/login");
    }
  }

  next();
});

// 🔹 Logout Function
export const logoutUser = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    alert("You have been logged out.");
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export default router;
