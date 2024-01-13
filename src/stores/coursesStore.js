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
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
  router.push("/");
}

export const useCoursesStore = defineStore("course", {
  state: () => ({
    courses: [],
    singleCourse: null,
  }),

  getters: {
    totalCourses: (state) => state.courses.length,
    filterCourses: (state) =>
      state.courses.filter((course) => course.type === "software"),
  },

  actions: {
    async addCourse(courseData) {
      const { type, image, description, title, date, subject } = courseData;

      try {
        // Check if required fields are defined
        if (!type || !image || !description || !title || !date || !subject) {
          throw new Error("All fields are required.");
        }

        const imageUrl = await uploadImage(
          image,
          `course_images/${image.name}`
        );
        const courseDataWithImageUrl = {
          type,
          image: imageUrl,
          description,
          title,
          date,
          subject,
        };

        const docRef = await addDoc(
          collection(getFirestore(), "courses"),
          courseDataWithImageUrl
        );

        await navigateAfterAction("Course Added Successfully!");
      } catch (error) {
        console.error("Error adding document: ", error);
        Swal.fire({
          icon: "error",
          title: "Course Addition Error",
          text: error.message,
        });
      }
    },
    async addCourseTopic(courseId, courseData) {
      const { topic, content } = courseData;
    
      try {
        // Check if required fields are defined
        if (!topic || !content) {
          throw new Error("All fields are required.");
        }
    
        // Get Firestore instance
        const db = getFirestore();
        if (!db) {
          throw new Error("Firestore instance is not available.");
        }
    
        // Construct the reference to the course document
        const courseRef = doc(db, "courses", courseId);
        const courseSnapshot = await getDoc(courseRef);
    
        // Check if the course document exists
        if (!courseSnapshot.exists()) {
          throw new Error(`course with ID ${courseId} does not exist.`);
        }
    
        // Update the course document to include the new topic
        await updateDoc(courseRef, {
          topics: [
            ...(courseSnapshot.data().topics || []), // Keep existing topics if any
            { topic, content },
          ],
        });
    
        // Fetch the updated course to get the newly added topic
        const updatedcourse = (await getDoc(courseRef)).data();
    
        // Assuming this.courses is a local state variable, update it with the updated course
        this.courses = [
          ...this.courses.filter((course) => course.id !== courseId),
          { id: courseId, ...updatedcourse },
        ];
    
        // Navigate to the dashboard after a successful action
        await navigateAfterAction(`course topic for course ${courseId} added!`);
        router.push("/dashboard");
      } catch (error) {
        console.error("Error adding course topic: ", error);
        Swal.fire({
          icon: "error",
          title: "course topic Addition Error",
          text: error.message,
        });
      }
    },













    async updateCourse(courseId, courseData) {
      try {
        const { type, description, title, date, subject, image } = courseData;

        let imageUrl;
        if (image instanceof File) {
          imageUrl = await uploadImage(
            image,
            `course_images/${courseId}_${image.name}`
          );
        }
        console.log("Updating course with ID:", courseId);
        console.log("Updated details:", courseData);
        const userConfirmed = await Swal.fire({
          title: "Update Course",
          text: "Are you sure you want to update this course?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, update it!",
        });

        if (!userConfirmed.isConfirmed) {
          return;
        }

        await updateDoc(doc(getFirestore(), "courses", courseId), {
          type,
          description,
          subject,
          date,
          title,
          ...(imageUrl && { image: imageUrl }), // Only include image if it exists
        });

        const index = this.courses.findIndex(
          (course) => course.id === courseId
        );
        if (index !== -1) {
          this.courses[index] = {
            ...this.courses[index],
            type,
            description,
            subject,
            date,
            title,
            image: imageUrl || this.courses[index].image,
          };
        }

        await navigateAfterAction("Course updated successfully!");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error Updating",
          text: error.message || "An error occurred while updating the course.",
        });
        console.error("Error updating course details: ", error);
        throw error;
      }
    },

    async fetchAllCourses() {
      try {
        const db = getFirestore();
        const coursesCollection = collection(db, "courses");
        const querySnapshot = await getDocs(coursesCollection);

        const courses = [];
        querySnapshot.forEach((doc) => {
          courses.push({ id: doc.id, ...doc.data() });
        });

        const typeSorted = courses.sort((a, b) => {
          const typeOrder = {
            software: 1,
            "information tech": 2,
            cybersecurity: 3,
          };
          return typeOrder[a.type] - typeOrder[b.type];
        });

        this.courses = typeSorted;
      } catch (error) {
        console.error("Error fetching courses: ", error);
        throw error;
      }
    },

    async fetchSingleCourse(courseId) {
      try {
        const db = getFirestore();
        const coursesCollection = collection(db, "courses");
        const courseDoc = await getDoc(doc(coursesCollection, courseId));

        if (courseDoc.exists()) {
          const courseData = { id: courseDoc.id, ...courseDoc.data() };
          this.singleCourse = courseData;
        } else {
          console.warn(`Course with ID ${courseId} does not exist.`);
          this.singleCourse = null;
        }
      } catch (error) {
        console.error("Error fetching single course: ", error.message);
        throw error;
      }
    },

    async deleteCourse(courseId) {
      try {
        const userConfirmed = await Swal.fire({
          title: "Delete Course",
          text: "Are you sure you want to delete this course?",
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
        const courseRef = doc(db, "courses", courseId);
        await deleteDoc(courseRef);

        this.courses = this.courses.filter((course) => course.id !== courseId);

        await navigateAfterAction("Course deleted successfully!", "warning");
      } catch (error) {
        console.error("Error deleting course: ", error);
        throw error;
      }
    },
  },
});
