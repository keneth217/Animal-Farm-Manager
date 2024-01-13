<template>
    <button @click="logout" class="btn btn-primary">Logout</button>
</template>

<script>
import { useAuthStore } from '../stores/authStore';

export default {
    setup() {
        const authStore = useAuthStore();

        const logout = async () => {
            try {
                await authStore.logout();
                console.log('User logged out successfully');
            } catch (error) {
                console.error('Logout error:', error);
            }
        };

        return {
            logout
        };
    }
};
</script>
