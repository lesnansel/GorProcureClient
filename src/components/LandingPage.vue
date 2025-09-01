<template>
  <div class="landing-page">
    <!-- Background Pattern -->
    <div class="background-pattern">
      <div class="pattern-overlay"></div>
    </div>

    <!-- Navigation -->
    <nav class="navbar">
      <div class="container">
        <div class="logo">
          <img src="@/assets/proculogo.png" alt="GovProcure Logo" class="logo-img" />
          <span class="logo-text">GovProcure</span>
        </div>
        <div class="nav-links">
          <a href="#features" class="nav-link">Features</a>
          <a href="#benefits" class="nav-link">Benefits</a>
          <a href="#testimonials" class="nav-link">Testimonials</a>
          <a href="#contact" class="nav-link">Contact</a>
        </div>
        <div class="auth-buttons">
          <button class="auth-button login" @click="navigateToLogin">Login</button>
          <button class="auth-button register" @click="navigateToRegister">Register</button>
        </div>
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
        
        <!-- Mobile Menu -->
        <div class="mobile-menu" :class="{ 'active': mobileMenuOpen }">
          <button class="close-menu-btn" @click="toggleMobileMenu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div class="mobile-nav-links">
            <a href="#features" class="mobile-nav-link" @click="toggleMobileMenu">Features</a>
            <a href="#benefits" class="mobile-nav-link" @click="toggleMobileMenu">Benefits</a>
            <a href="#testimonials" class="mobile-nav-link" @click="toggleMobileMenu">Testimonials</a>
            <a href="#contact" class="mobile-nav-link" @click="toggleMobileMenu">Contact</a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="hero">
      <div class="container hero-container">
        <div class="hero-content">
          <h1 class="hero-title">Streamline Your Government Procurement Process</h1>
          <p class="hero-subtitle">Empowering public sector organizations with AI-driven procurement solutions for efficiency, transparency, and compliance.</p>
          <div class="hero-buttons">
            <button class="cta-button primary">Get Started</button>
            <button class="cta-button secondary">Watch Demo</button>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">98%</span>
              <span class="stat-label">Compliance Rate</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">30%</span>
              <span class="stat-label">Cost Reduction</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">5x</span>
              <span class="stat-label">Process Speed</span>
            </div>
          </div>
        </div>
        <div class="hero-image">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DMhJ7yxRS27akpmujhIR7jjrwxMuiT.png" alt="Dashboard Preview" class="dashboard-img" />
        </div>
      </div>
    </header>

    <!-- Trusted By Section -->
    <section class="trusted-by">
      <div class="container">
        <p class="trusted-text">Trusted by government agencies and organizations worldwide</p>
        <div class="logo-grid">
          <div class="client-logo-wrapper">
            <img src="@/assets/proculogo.png" alt="Client Logo" class="client-logo" />
          </div>
          <div class="client-logo-wrapper">
            <img src="@/assets/proculogo.png" alt="Client Logo" class="client-logo" />
          </div>
          <div class="client-logo-wrapper">
            <img src="@/assets/proculogo.png" alt="Client Logo" class="client-logo" />
          </div>
          <div class="client-logo-wrapper">
            <img src="@/assets/proculogo.png" alt="Client Logo" class="client-logo" />
          </div>
          <div class="client-logo-wrapper">
            <img src="@/assets/proculogo.png" alt="Client Logo" class="client-logo" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Features</span>
          <h2 class="section-title">Why Choose GovProcure?</h2>
          <p class="section-subtitle">Discover the powerful tools and features that make government procurement seamless and transparent.</p>
        </div>
        
        <div class="feature-grid">
          <div class="feature-card">
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feature-icon"><path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z"/><path d="M16 8V5c0-1.1.9-2 2-2"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M20.5 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/><path d="M16.5 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/><path d="M20.5 21a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/><path d="M18.5 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/></svg>
            </div>
            <h3>AI-Powered Insights</h3>
            <p>Leverage advanced analytics to identify procurement trends and optimize spending across departments.</p>
            <a href="#" class="feature-link">
              Learn more
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
          
          <div class="feature-card">
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feature-icon"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
            </div>
            <h3>Real-Time Monitoring</h3>
            <p>Track procurement activities in real-time with customizable dashboards and automated alerts.</p>
            <a href="#" class="feature-link">
              Learn more
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
          
          <div class="feature-card">
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feature-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h3>Compliance Management</h3>
            <p>Ensure adherence to procurement regulations with automated compliance checks and audit trails.</p>
            <a href="#" class="feature-link">
              Learn more
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Process</span>
          <h2 class="section-title">How It Works</h2>
          <p class="section-subtitle">Our streamlined approach makes implementation and adoption simple for government agencies</p>
        </div>
        
        <div class="process-steps">
          <div class="process-step">
            <div class="step-number">1</div>
            <h3>Data Integration</h3>
            <p>Connect your existing procurement systems and data sources with our secure API integrations.</p>
          </div>
          <div class="process-step">
            <div class="step-number">2</div>
            <h3>AI Analysis</h3>
            <p>Our AI engine analyzes your procurement data to identify patterns, risks, and opportunities.</p>
          </div>
          <div class="process-step">
            <div class="step-number">3</div>
            <h3>Actionable Insights</h3>
            <p>Receive customized dashboards and reports with actionable recommendations.</p>
          </div>
          <div class="process-step">
            <div class="step-number">4</div>
            <h3>Continuous Improvement</h3>
            <p>The system learns from your data and actions to continuously improve recommendations.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section id="benefits" class="benefits">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Benefits</span>
          <h2 class="section-title">Why Choose Our System</h2>
          <p class="section-subtitle">Transforming government procurement operations with measurable results</p>
        </div>
        
        <div class="benefits-grid">
          <div class="benefit-item">
            <div class="benefit-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
            </div>
            <div class="benefit-content">
              <h3>Cost Reduction</h3>
              <p>Reduce procurement costs by up to 15% through data-driven decision making and process optimization.</p>
            </div>
          </div>
          
          <div class="benefit-item">
            <div class="benefit-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="benefit-content">
              <h3>Time Efficiency</h3>
              <p>Streamline procurement processes and reduce administrative workload by automating routine tasks.</p>
            </div>
          </div>
          
          <div class="benefit-item">
            <div class="benefit-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <div class="benefit-content">
              <h3>Enhanced Transparency</h3>
              <p>Improve visibility into procurement processes with comprehensive audit trails and reporting capabilities.</p>
            </div>
          </div>
          
          <div class="benefit-item">
            <div class="benefit-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <div class="benefit-content">
              <h3>Risk Mitigation</h3>
              <p>Identify potential compliance issues and supplier risks before they impact your operations.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="testimonials">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Testimonials</span>
          <h2 class="section-title">What Our Clients Say</h2>
          <p class="section-subtitle">Hear from government organizations that have transformed their procurement processes</p>
        </div>
        
        <div class="testimonial-grid">
          <div class="testimonial-card">
            <div class="testimonial-content">
              <svg class="quote-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
              <p>"The GovProcure system has revolutionized how we manage public contracts. We've seen significant cost savings and improved compliance across all departments."</p>
            </div>
            <div class="testimonial-author">
              <img src="/placeholder.svg?height=50&width=50&query=professional woman headshot" alt="Sarah Johnson" class="author-image" />
              <div class="author-info">
                <h4>Sarah Johnson</h4>
                <p>Chief Procurement Officer, City of Metropolis</p>
              </div>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-content">
              <svg class="quote-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
              <p>"Implementation was seamless, and the insights generated by the AI have helped us identify savings opportunities we never would have found manually."</p>
            </div>
            <div class="testimonial-author">
              <img src="/placeholder.svg?height=50&width=50&query=professional man headshot" alt="Michael Chen" class="author-image" />
              <div class="author-info">
                <h4>Michael Chen</h4>
                <p>Director of Procurement, State Department of Transportation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section id="contact" class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Transform Your Procurement Process?</h2>
          <p>Join hundreds of government organizations already benefiting from GovProcure.</p>
          <div class="cta-form">
            <input type="email" placeholder="Enter your official email" class="cta-input" />
            <button class="cta-button primary">Request Demo</button>
          </div>
          <p class="cta-note">No credit card required. Free 30-day trial available for government agencies.</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="logo">
              <img src="@/assets/proculogo.png" alt="GovProcure Logo" class="logo-img" />
              <span class="logo-text">GovProcure</span>
            </div>
            <p>AI-Powered Government Procurement Solutions</p>
            <div class="social-links">
              <a href="#" class="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" class="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" class="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" class="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
          
          <div class="footer-links">
            <h4>Product</h4>
            <ul>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Case Studies</a></li>
              <li><a href="#">Security</a></li>
            </ul>
          </div>
          
          <div class="footer-links">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Partners</a></li>
            </ul>
          </div>
          
          <div class="footer-links">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Security</a></li>
              <li><a href="#">Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 GovProcure. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Mobile menu state
const mobileMenuOpen = ref(false);

// Router instance
const router = useRouter();

// Function to navigate to login page
const navigateToLogin = () => {
  router.push('/login');
};

// Function to navigate to register page
const navigateToRegister = () => {
  router.push('/register');
};

// Function to toggle mobile menu
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  updateBodyOverflow();
};

// Function to update body overflow based on mobile menu state
const updateBodyOverflow = () => {
  document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : '';
};

// Call updateBodyOverflow on component mount to ensure correct initial state
onMounted(() => {
  updateBodyOverflow();
});
</script>

<style scoped>
/* Base Styles */
:root {
  --primary: #0f2942;
  --primary-light: #1a4971;
  --primary-dark: #0a1f33;
  --accent: #3b82f6;
  --accent-light: #60a5fa;
  --accent-dark: #2563eb;
  --text-dark: #1e293b;
  --text-medium: #475569;
  --text-light: #94a3b8;
  --background-light: #f8fafc;
  --background-medium: #f1f5f9;
  --white: #ffffff;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: var(--white);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}

img {
  max-width: 100%;
  height: auto;
}

/* Background Pattern */
.landing-page {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
}

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
    linear-gradient(150deg, rgba(16, 42, 66, 0.5) 12%, transparent 12.5%, transparent 87%, rgba(16, 42, 66, 0.5)   rgba(16, 42, 66, 0.5) 12%, transparent 12.5%, transparent 87%, rgba(16, 42, 66, 0.5) 87.5%, rgba(16, 42, 66, 0.5)),
    linear-gradient(60deg, rgba(0, 0, 0, 0.1) 25%, transparent 25.5%, transparent 75%, rgba(0, 0, 0, 0.1) 75%, rgba(0, 0, 0, 0.1)),
    linear-gradient(60deg, rgba(0, 0, 0, 0.1) 25%, transparent 25.5%, transparent 75%, rgba(0, 0, 0, 0.1) 75%, rgba(0, 0, 0, 0.1));
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
  opacity: 0.2;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-tag {
  display: inline-block;
  background-color: rgba(15, 41, 66, 0.2);
  color: var(--accent-light);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 2.25rem;
  color: var(--white);
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 700px;
  margin: 0 auto;
}

/* Navigation */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(10, 31, 51, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-img {
  width: 40px;
  height: 40px;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--white);
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: var(--accent-light);
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.auth-button {
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
}

.auth-button.login {
  background-color: transparent;
  color: var(--white);
  border: 1px solid var(--white);
}

.auth-button.login:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.auth-button.register {
  background-color: var(--accent);
  color: var(--white);
  border: none;
}

.auth-button.register:hover {
  background-color: var(--accent-dark);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--white);
  cursor: pointer;
}

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  max-width: 320px;
  height: 100vh;
  background-color: var(--primary);
  z-index: 1001;
  padding: 60px 30px;
  transition: right 0.3s ease;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
}

.mobile-menu.active {
  right: 0;
}

.close-menu-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: var(--white);
  cursor: pointer;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
}

.mobile-nav-link {
  color: var(--white);
  font-size: 1.25rem;
  font-weight: 500;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Hero Section */
.hero {
  padding: 160px 0 100px;
  position: relative;
  overflow: hidden;
}

.hero-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-content {
  max-width: 600px;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 20px;
  background: linear-gradient(to right, var(--white), var(--accent-light));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
}

.cta-button {
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cta-button.primary {
  background-color: var(--accent);
  color: var(--white);
  border: none;
}

.cta-button.primary:hover {
  background-color: var(--accent-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.cta-button.secondary {
  background-color: transparent;
  color: var(--white);
  border: 2px solid var(--white);
}

.cta-button.secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.hero-stats {
  display: flex;
  gap: 40px;
  margin-top: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-light);
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
}

.hero-image {
  position: relative;
}

.dashboard-img {
  width: 100%;
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
  transition: all 0.5s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dashboard-img:hover {
  transform: perspective(1000px) rotateY(0) rotateX(0);
}

/* Trusted By Section */
.trusted-by {
  padding: 60px 0;
  background-color: rgba(10, 31, 51, 0.5);
  backdrop-filter: blur(10px);
}

.trusted-text {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 30px;
  font-size: 1.125rem;
}

.logo-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 40px;
}

.client-logo-wrapper {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 80px;
  transition: all 0.3s ease;
}

.client-logo-wrapper:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-5px);
}

.client-logo {
  height: 40px;
  width: auto;
  filter: brightness(0) invert(1);
  opacity: 0.8;
  transition: all 0.3s;
}

.client-logo-wrapper:hover .client-logo {
  opacity: 1;
}

/* Features Section */
.features {
  padding: 100px 0;
  background-color: rgba(10, 31, 51, 0.3);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.feature-card {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  border-color: var(--accent-light);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  margin-bottom: 20px;
}

.feature-icon {
  color: var(--accent-light);
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 15px;
  color: var(--white);
}

.feature-card p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
  flex-grow: 1;
}

.feature-link {
  color: var(--accent-light);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: gap 0.3s;
  margin-top: auto;
}

.feature-link:hover {
  gap: 8px;
}

/* How It Works Section */
.how-it-works {
  padding: 100px 0;
  background-color: rgba(16, 42, 66, 0.5);
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.process-step {
  text-align: center;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
}

.step-number {
  width: 40px;
  height: 40px;
  background-color: var(--accent);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin: 0 auto 20px;
}

.process-step h3 {
  font-size: 1.25rem;
  margin-bottom: 15px;
  color: var(--white);
}

.process-step p {
  color: rgba(255, 255, 255, 0.7);
}

/* Benefits Section */
.benefits {
  padding: 100px 0;
  background-color: rgba(10, 31, 51, 0.3);
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.benefit-icon {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  background-color: rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-light);
}

.benefit-content h3 {
  font-size: 1.25rem;
  margin-bottom: 10px;
  color: var(--white);
}

.benefit-content p {
  color: rgba(255, 255, 255, 0.7);
}

/* Testimonials Section */
.testimonials {
  padding: 100px 0;
  background-color: rgba(16, 42, 66, 0.5);
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.testimonial-card {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
}

.testimonial-content {
  position: relative;
  margin-bottom: 30px;
}

.quote-icon {
  position: absolute;
  top: -10px;
  left: -10px;
  color: rgba(59, 130, 246, 0.2);
  z-index: 0;
}

.testimonial-content p {
  position: relative;
  z-index: 1;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 15px;
}

.author-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.author-info h4 {
  font-size: 1rem;
  color: var(--white);
}

.author-info p {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
}

/* CTA Section */
.cta-section {
  padding: 100px 0;
  background-color: rgba(10, 31, 51, 0.7);
  position: relative;
  overflow: hidden;
}

.cta-content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.cta-section h2 {
  font-size: 2.25rem;
  margin-bottom: 20px;
  color: var(--white);
}

.cta-section p {
  margin-bottom: 40px;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.8);
}

.cta-form {
  display: flex;
  gap: 10px;
  max-width: 500px;
  margin: 0 auto 20px;
}

.cta-input {
  flex: 1;
  padding: 14px 20px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--white);
  font-size: 1rem;
}

.cta-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.cta-note {
  font-size: 0.875rem;
  opacity: 0.7;
}

/* Footer */
.footer {
  background-color: rgba(10, 31, 51, 0.9);
  color: var(--white);
  padding: 80px 0 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 60px;
  margin-bottom: 60px;
}

.footer-brand p {
  margin: 20px 0;
  opacity: 0.7;
  max-width: 300px;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.3s;
}

.social-link:hover {
  background-color: var(--accent);
  transform: translateY(-3px);
}

.footer-links h4 {
  font-size: 1.125rem;
  margin-bottom: 20px;
  color: var(--white);
}

.footer-links ul {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s;
}

.footer-links a:hover {
  color: var(--white);
  padding-left: 5px;
}

.footer-bottom {
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-bottom p {
  font-size: 0.875rem;
  opacity: 0.7;
}

/* Responsive Adjustments */
@media (max-width: 992px) {
  .hero-container {
    grid-template-columns: 1fr;
  }
  
  .hero-content {
    text-align: center;
    margin: 0 auto;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.875rem;
  }
  
  .hero {
    padding: 140px 0 80px;
  }
  
  .hero-title {
    font-size: 2.25rem;
  }
  
  .nav-links {
    display: none;
  }
  
  .auth-buttons {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .benefit-item {
    flex-direction: column;
    text-align: center;
  }
  
  .benefit-icon {
    margin: 0 auto 15px;
  }
  
  .cta-form {
    flex-direction: column;
  }
  
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .footer-brand {
    text-align: center;
  }
  
  .footer-brand p {
    margin-left: auto;
    margin-right: auto;
  }
  
  .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.875rem;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
  
  .hero-buttons {
    flex-direction: column;
  }
  
  .hero-stats {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .stat-item {
    align-items: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-img, 
  .feature-card, 
  .social-link, 
  .cta-button, 
  .nav-link, 
  .footer-links a {
    transition: none;
    transform: none;
  }
  
  .dashboard-img:hover,
  .feature-card:hover,
  .social-link:hover,
  .cta-button:hover {
    transform: none;
  }
}
</style>