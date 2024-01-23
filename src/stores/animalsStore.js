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
import auth from "../firebase/index";
import router from "../router";
import Swal from "sweetalert2";

// Helper function for uploading images
async function uploadImage(image, storagePath) {
  const storage = getStorage();
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, image);
  return getDownloadURL(storageRef);
}

// Helper function for navigation after an action
async function navigateAfterAction(message, icon = "success") {
  await Swal.fire({
    icon,
    owner: message,
    showConfirmButton: false,
    timer: 1500,
  });
  router.push("/");
}

export const useAnimalsStore = defineStore("animal", {
  state: () => ({
    animals: [],
    singleAnimal: null,
  }),

  getters: {
    totalAnimals: (state) => state.animals.length,
    filterAnimals: (state) =>
      state.animals.filter((animal) => animal.type === "cow"),
  },

  actions: {
    async addAnimal(animalData) {
      const { type, image, description, owner, date, location,status } = animalData;

      try {
        // Check if required fields are defined
        if (!type || !image || !description || !owner || !date || !status || !location) {
          throw new Error("All fields are required.");
        }

        const imageUrl = await uploadImage(
          image,
          `animal_images/${image.name}`
        );
        const animalDataWithImageUrl = {
          type,
          image: imageUrl,
          description,
          owner,
          date,
          location,
          status
        };

        const docRef = await addDoc(
          collection(getFirestore(), "animals"),
          animalDataWithImageUrl
        );

        await navigateAfterAction("animal Added Successfully!");
      } catch (error) {
        console.error("Error adding document: ", error);
        Swal.fire({
          icon: "error",
          owner: "animal Addition Error",
          text: error.message,
        });
      }
    },
    

    async updateAnimal(animalId, animalData) {
      try {
        const { type, description, owner, date, location, image,status } = animalData;

        let imageUrl;
        if (image instanceof File) {
          imageUrl = await uploadImage(
            image,
            `animal_images/${animalId}_${image.name}`
          );
        }
        console.log("Updating animal with ID:", animalId);
        console.log("Updated details:", animalData);
        const userConfirmed = await Swal.fire({
          owner: "Update animal",
          text: "Are you sure you want to update this animal?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, update it!",
        });

        if (!userConfirmed.isConfirmed) {
          return;
        }

        await updateDoc(doc(getFirestore(), "animals", animalId), {
          type,
          description,
          location,
          date,
          owner,
          ...(imageUrl && { image: imageUrl }), // Only include image if it exists
        });

        const index = this.animals.findIndex(
          (animal) => animal.id === animalId
        );
        if (index !== -1) {
          this.animals[index] = {
            ...this.animals[index],
            type,
            description,
            location,
            date,
            owner,
            status,
            image: imageUrl || this.animals[index].image,
          };
        }

        await navigateAfterAction("animal updated successfully!");
      } catch (error) {
        Swal.fire({
          icon: "error",
          owner: "Error Updating",
          text: error.message || "An error occurred while updating the animal.",
        });
        console.error("Error updating animal details: ", error);
        throw error;
      }
    },

    async fetchAllAnimals() {
      try {
        const db = getFirestore();
        const animalsCollection = collection(db, "animals");
        const querySnapshot = await getDocs(animalsCollection);

        const animals = [];
        querySnapshot.forEach((doc) => {
          animals.push({ id: doc.id, ...doc.data() });
        });

        const typeSorted = animals.sort((a, b) => {
          const typeOrder = {
            cow: 1,
            goat: 2,
            sheep: 3,
          };
          return typeOrder[a.type] - typeOrder[b.type];
        });

        this.animals = typeSorted;
      } catch (error) {
        console.error("Error fetching animals: ", error);
        throw error;
      }
    },

    async fetchSingleAnimal(animalId) {
      try {
        const db = getFirestore();
        const animalsCollection = collection(db, "animals");
        const animalDoc = await getDoc(doc(animalsCollection, animalId));

        if (animalDoc.exists()) {
          const animalData = { id: animalDoc.id, ...animalDoc.data() };
          this.singleanimal = animalData;
        } else {
          console.warn(`animal with ID ${animalId} does not exist.`);
          this.singleanimal = null;
        }
      } catch (error) {
        console.error("Error fetching single animal: ", error.message);
        throw error;
      }
    },

    async deleteAnimal(animalId) {
      try {
        const userConfirmed = await Swal.fire({
          owner: "Delete animal",
          text: "Are you sure you want to delete this animal?",
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
        const animalRef = doc(db, "animals", animalId);
        await deleteDoc(animalRef);

        this.animals = this.animals.filter((animal) => animal.id !== animalId);

        await navigateAfterAction("animal deleted successfully!", "warning");
      } catch (error) {
        console.error("Error deleting animal: ", error);
        throw error;
      }
    },
  },
});
