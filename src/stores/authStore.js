import { defineStore } from "pinia";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import auth from "../firebase/index";
import router from "../router";
import Swal from "sweetalert2";

export const useAuthStore = defineStore("users", {
  state: () => ({
    user: null,
  }),
  getters: {
    // totalUsers: (state) => state.user.length,
  },
  actions: {
    async register(userCredentials) {
      try {
        console.log("Registering user:", userCredentials);
        const { email, password } = userCredentials;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Signed up
        const user = userCredential.user;
        this.setUser(user);

        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          showConfirmButton: true,
          timer: 1500,
        });

        router.push("/auth/login");
      } catch (error) {
        this.handleAuthError(error);
      }
    },
    async login(userCredentials) {
      console.log("Logging user in:", userCredentials);
      const { email, password } = userCredentials;
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Generate a token (you can use a library like uuid for this)
        const token = user.accessToken;
        // const uid = user.uid;

        // Store the token in local storage
        localStorage.setItem("token", token);

        // localStorage.setItem("uid", uid);
        // Update the user state in Pinia
        this.setUser(user);
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          showConfirmButton: false,
          timer: 1500,
        });

        // Navigate to the dashboard
        router.push("/dashboard");

        console.log("User logged in with UID:", user.uid);
      } catch (error) {
        this.handleAuthError(error);
        Swal.fire({
          icon: "error",
          title: "Authorized acces-only",
          text: "you are not allowed to acces this page",
          toast: true,
          position: "top-end",
        });
      }
    },
    async fetchUser() {
      try {
        const user = await new Promise((resolve, reject) => {
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
              resolve(user);
            } else {
              reject(new Error("No user"));
            }
            // Make sure to unsubscribe to avoid memory leaks
            unsubscribe();
          });
        });

        this.setUser(user);
        localStorage.setItem("token", user ? user.accessToken : "");
      } catch (error) {
        this.handleAuthError(error);
      }
    },
    async logout() {
      try {
        await signOut(auth);

        // Remove the token from localStorage
        localStorage.removeItem("token");

        // Clear the user state in your Pinia store
        this.clearUser();

        // Redirect to the home page or login page
        router.push("/");
      } catch (error) {
        this.handleAuthError(error);
      }
    },
    handleAuthError(error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      // Handle errors (e.g., show a message to the user)
      console.error("Authentication Error:", errorCode, errorMessage);
    },
    setUser(user) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
    },
  },
});
