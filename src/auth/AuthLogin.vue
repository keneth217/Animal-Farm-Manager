<template>
    <section class="min-vh-100 d-flex align-items-center text-center background">
        <div class="container-fluid mb-3" >
            <div class="row justify-content-center" >
                <div class="col-md-6 text-primary mt-5 font-weight-bold text-center text-uppercase">
                    <h6 class="p-3" style="background-color: rgba(0, 0, 0, 0.6);">Login Here</h6>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card border-primary mt-2">
                        <form @submit.prevent="loginUser" class="p-4">
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input v-model="login_form.email" type="email" class="form-control" id="email">
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <div class="input-group">
                                    <input v-model="login_form.password" :type="passwordFieldType" class="form-control"
                                        id="password">
                                    <button @click="togglePasswordVisibility" class="btn btn-outline-secondary"
                                        type="button">
                                        <i :class="passwordFieldType === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="mb-3">
                                <button class="btn btn-primary text-center" type="submit" :disabled="isLoggingIn">
                                    <span v-if="!isLoggingIn">Login</span>
                                    <span v-else>Logging In...</span>
                                </button>
                            </div>
                        </form>
                        <div class="mb-3 text-center justify-items-center">
                            Do not have an account? Click here to <router-link to="/auth/register">Register</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { ref } from 'vue';
// import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
export default {
    setup() {
        const login_form = ref({
            email: '',
            password: '',
        });
        // const router = useRoute;
        const authStore = useAuthStore();
        const isLoggingIn = ref(false);
        const showPassword = ref(false);

        const togglePasswordVisibility = () => {
            showPassword.value = !showPassword.value;
        };

        const loginUser = async () => {
            try {
                isLoggingIn.value = true; // Start the loading spinner

                await authStore.login({
                    email: login_form.value.email,
                    password: login_form.value.password,
                });

                // Reset the form fields after successful registration
                login_form.email = '';
                login_form.password = '';
                // router.push("/dashboard")
                console.log('User logged in successfully');
            } catch (error) {

                console.error('Login error:', error);


            } finally {
                isLoggingIn.value = false; // Stop the loading spinner
            }
        };

        return {
            login_form,
            isLoggingIn,
            loginUser,
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


