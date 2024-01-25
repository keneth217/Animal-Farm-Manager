// import { firebase } from "@firebase/app";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAenV-SsD2plOYHIIQvsLeFnrJoP7415aM",
  authDomain: "farm-bbfce.firebaseapp.com",
  projectId: "farm-bbfce",
  storageBucket: "farm-bbfce.appspot.com",
  messagingSenderId: "976360809056",
  appId: "1:976360809056:web:793b297342a854eed21905",





  // apiKey: "AIzaSyAE6CbkHcVv6Ia5UDi2GrSbwuMjgmKz1uo",
  // authDomain: "farm2-1bab3.firebaseapp.com",
  // databaseURL: "https://farm2-1bab3-default-rtdb.firebaseio.com",
  // projectId: "farm2-1bab3",
  // storageBucket: "farm2-1bab3.appspot.com",
  // messagingSenderId: "62644824867",
  // appId: "1:62644824867:web:bc1f3a34b5ebf3d1c3ba96",
  // measurementId: "G-C52N3K8ZX7"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

export default auth;

// export { auth };
