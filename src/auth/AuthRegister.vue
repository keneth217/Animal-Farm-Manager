<template>
    <section class="min-vh-100 d-flex align-items-center text-center background">
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6 text-primary mt-5 font-weight-bold text-center text-uppercase">
                    <h6 class="p-3" style="background-color: rgba(0, 0, 0, 0.6);">Register Here</h6>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card border-primary mt-5">
                        <form @submit.prevent="registerUser" class="p-4">
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input v-model="register_form.email" type="email" class="form-control" id="email">
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <div class="input-group">
                                    <input v-model="register_form.password" :type="passwordFieldType" class="form-control"
                                        id="password">
                                    <button @click="togglePasswordVisibility" class="btn btn-outline-secondary"
                                        type="button">
                                        <i :class="passwordFieldType === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="mb-3">
                                <button class="btn btn-primary text-center" type="submit" :disabled="isSigningUp">
                                    <span v-if="!isSigningUp">Register</span>
                                    <span v-else>Signing up...</span>
                                </button>
                            </div>
                        </form>
                        <div class="mb-3 text-center justify-items-center">
                            Already have an account? Click here to <router-link to="/auth/login">Login</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
export default {
    setup() {
        const register_form = ref({
            email: '',
            password: '',
        });
        const authStore = useAuthStore();
        const isSigningUp = ref(false);
        const showPassword = ref(false);

        const togglePasswordVisibility = () => {
            showPassword.value = !showPassword.value;
        };

        const registerUser = async () => {
            try {
                isSigningUp.value = true; // Start the loading spinner

                await authStore.register({
                    email: register_form.value.email,
                    password: register_form.value.password,
                });

                // Reset the form fields after successful registration
                register_form.email = '';
                register_form.password = '';

                console.log('User registered successfully');
            } catch (error) {
                // Handle specific error types
                if (error.code === 'auth/email-already-in-use') {
                    console.error('Registration error: The provided email is already in use.');
              
                }
            } finally {
                isSigningUp.value = false; // Stop the loading spinner
            }
        };

        return {
            register_form,
            registerUser,
            isSigningUp,
            showPassword,
            togglePasswordVisibility,
            get passwordFieldType() {
                return showPassword.value ? 'text' : 'password';
            },
        };
    },
};
</script>
<style scoped>
.background {
    background: url(../assets/animals/calves.jpg);
    width: 100%;
    min-height: 100vh;
    text-align: center;
    display: flex;
    background-attachment: fixed;

    background-position: center;
    background-size: cover;
    opacity: 1;

}
</style>


