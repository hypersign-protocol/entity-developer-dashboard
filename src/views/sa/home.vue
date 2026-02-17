<template>
    <div class="home-container">
        <header class="admin-header">
            <h1>Super Admin Dashboard</h1>
            <p>Welcome, Admin. Use the tools below to manage the platform.</p>
        </header>

        <main class="content-area">
            <div v-if="isSuperAdminUser">

                <div class="admin-card" :class="{ 'is-active': activeSection === 'onboarding' }">
                    <div class="card-header" @click="toggleSection('onboarding')">
                        <div class="header-left">
                            <span class="icon">👤</span>
                            <h3>Approve Customer Onboarding</h3>
                        </div>
                        <span class="arrow">{{ activeSection === 'onboarding' ? '▲' : '▼' }}</span>
                    </div>

                    <transition name="fade-slide">
                        <div v-if="activeSection === 'onboarding'" class="card-body">
                            <ApproveCustomerOnboarding />
                        </div>
                    </transition>
                </div>
                
                <div class="admin-card" :class="{ 'is-active': activeSection === 'credits' }">
                    <div class="card-header" @click="toggleSection('credits')">
                        <div class="header-left"><span>💳</span>
                            <h3>Recharge Service Credits</h3>
                        </div>
                        <span class="arrow">{{ activeSection === 'credits' ? '▲' : '▼' }}</span>
                    </div>
                    <div v-if="activeSection === 'credits'" class="card-body">
                        <CreditRecharge />
                    </div>
                </div>

            </div>

            <div v-else class="access-denied">
                <AccessDenied />
            </div>
        </main>
    </div>
</template>

<script>
import ApproveCustomerOnboarding from './components/ApproveCustomerOnboarding.vue';
import AccessDenied from '../AccessDenied.vue';
import { mapGetters } from "vuex/dist/vuex.common.js";
import CreditRecharge from './components/CreditRecharge.vue';
export default {
    name: 'SuperAdminHome',
    components: {
        ApproveCustomerOnboarding,
        AccessDenied,
        CreditRecharge
    },
    data() {
        return {
            // Tracks which section is expanded. Default to onboarding or null.
            activeSection: 'onboarding'
        };
    },
    computed: {
        ...mapGetters("mainStore", ["getUserDetails"]),
        isSuperAdminUser() {
            return this.getUserDetails?.role === "SUPER_ADMIN";
        },
    },
    methods: {
        toggleSection(sectionName) {
            // If the section is already open, close it; otherwise, open the new one.
            this.activeSection = this.activeSection === sectionName ? null : sectionName;
        }
    }
};
</script>

<style scoped>
.home-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.admin-header {
    border-bottom: 2px solid #34495e;
    margin-bottom: 30px;
    padding-bottom: 10px;
}

/* Card Styling */
.admin-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 15px;
    overflow: hidden;
    background: #fff;
    transition: box-shadow 0.3s ease;
}

.admin-card.is-active {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #3498db;
}

.card-header {
    padding: 15px 20px;
    background: #f8f9fa;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.card-header:hover {
    background: #f0f2f5;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-left h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #2c3e50;
}

.card-body {
    padding: 20px;
    border-top: 1px solid #eee;
}

.arrow {
    color: #7f8c8d;
    font-size: 0.8rem;
}

/* Simple Transition Animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
    max-height: 1000px;
    /* Large enough to fit content */
}

.fade-slide-enter,
.fade-slide-leave-to {
    opacity: 0;
    max-height: 0;
}

.access-denied {
    text-align: center;
    padding: 50px;
}
</style>