import { defineStore } from "pinia";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import router from "../router";
import Swal from "sweetalert2";
// Helper function to format date
function formatDate(date) {
  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear();
  const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
  const day = String(formattedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
// Helper function for navigation after an action
async function navigateAfterAction(message, icon = "success") {
  await Swal.fire({
    icon,
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
  // router.push("/");
}

export const useMessageStore = defineStore("message", {
  state: () => ({
    messages: [],
  }),

  getters: {
    totalMessages: (state) => state.messages.length,

    filterMessagesByDate: (state) => (date) => {
      return state.messages.filter((message) => message.date === date);
    },
  },

  actions: {
    async addMessage(messageData) {
      const { name, subject, email, information } = messageData;

      try {
        // Check if required fields are defined
        if (!name || !subject || !email || !information) {
          throw new Error("All fields are required.");
        }

        const db = getFirestore();
        const messagesCollection = collection(db, "messages");
        const currentDate = formatDate(Date.now());

        const docRef = await addDoc(messagesCollection, {
          name,
          subject,
          email,
          date: currentDate,
          information,
        });

        await navigateAfterAction("Message Added Successfully!");
        router.push("/");
      } catch (error) {
        console.error("Error adding message: ", error);
        Swal.fire({
          icon: "error",
          title: "Message Addition Error",
          text: error.message,
        });
      }
    },
    async fetchAllMessages() {
      try {
        const db = getFirestore();
        const messagesCollection = collection(db, "messages");
        const querySnapshot = await getDocs(messagesCollection);

        const messages = [];
        querySnapshot.forEach((doc) => {
          messages.push({ id: doc.id, ...doc.data() });
        });

        this.messages = messages;
      } catch (error) {
        console.error("Error fetching messages: ", error);
        throw error;
      }
    },
    async fetchSingleMessage(messageId) {
      try {
        const db = getFirestore();
        const messageRef = doc(db, "messages", messageId);
        const docSnapshot = await getDoc(messageRef);

        if (docSnapshot.exists()) {
          this.singleMessage = { ...docSnapshot.data(), id: docSnapshot.id };
        } else {
          console.warn(`Message with ID ${messageId} does not exist.`);
          this.singleMessage = null;
        }
      } catch (error) {
        console.error("Error fetching single message: ", error.message);
        throw error;
      }
    },
    async updateMessage({ messageId, updatedDetails }) {
      try {
        const { name, subject, email, date, information } = updatedDetails;

        const userConfirmed = await Swal.fire({
          title: "Update Message",
          text: "Are you sure you want to update this message?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, update it!",
        });

        if (!userConfirmed.isConfirmed) {
          return;
        }

        const db = getFirestore();
        const messageRef = doc(db, "messages", messageId);
        await updateDoc(messageRef, {
          name,
          subject,
          email,
          date,
          information,
        });

        const index = this.messages.findIndex(
          (message) => message.id === messageId
        );
        if (index !== -1) {
          this.messages[index] = {
            ...this.messages[index],
            name,
            subject,
            email,
            date,
            information,
          };
        }

        await navigateAfterAction("Message updated successfully!");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error Updating",
          text:
            error.message || "An error occurred while updating the message.",
        });
        console.error("Error updating message details: ", error);
        throw error;
      }
    },
    async deleteMessage(messageId) {
      try {
        const userConfirmed = await Swal.fire({
          title: "Delete Message",
          text: "Are you sure you want to delete this message?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        });

        if (!userConfirmed.isConfirmed) {
          return;
        }

        const db = getFirestore();
        const messageRef = doc(db, "messages", messageId);
        await deleteDoc(messageRef);

        this.messages = this.messages.filter(
          (message) => message.id !== messageId
        );

        await navigateAfterAction("Message deleted successfully!", "warning");
        router.push("/dashboard");
      } catch (error) {
        console.error("Error deleting message: ", error);
        throw error;
      }
    },
  },
});
