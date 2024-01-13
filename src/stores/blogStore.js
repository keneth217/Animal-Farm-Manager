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
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formattedDate = new Date(date);
  const dayOfWeek = daysOfWeek[formattedDate.getDay()];
  const month = months[formattedDate.getMonth()];
  const day = String(formattedDate.getDate()).padStart(2, "0");
  const year = formattedDate.getFullYear();

  return `${dayOfWeek}, ${month}, ${day}, ${year}`;
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

export const useBlogStore = defineStore("blog", {
  state: () => ({
    blogs: [],
  }),

  getters: {
    totalBlogs: (state) => state.blogs.length,

    filterBlogsByDate: (state) => (date) => {
      return state.blogs.filter((blog) => blog.date === date);
    },
  },

  actions: {
    async addBlog(blogData) {
      const { title, subject, description} = blogData;

      try {
        // Check if required fields are defined
        if (!title || !subject || !description) {
          throw new Error("All fields are required.");
        }

        const db = getFirestore();
        const blogsCollection = collection(db, "blogs");
        const currentDate = formatDate(Date.now());

        const docRef = await addDoc(blogsCollection, {
          title,
          subject,
          date: currentDate,
          description,
        
        });

        // Assuming this.blogs is a local state variable, update it with the new blog
        this.blogs = [
          ...this.blogs,
          { id: docRef.id, title, subject, date: currentDate},
        ];

        await navigateAfterAction("Blog Added Successfully!");
        router.push("/dashboard");
      } catch (error) {
        console.error("Error adding Blog: ", error);
        Swal.fire({
          icon: "error",
          title: "Blog Addition Error",
          text: error.message,
        });
      }
    },
    async addBlogTopic(blogId, blogData) {
      const { topic, content } = blogData;
    
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
    
        // Construct the reference to the blog document
        const blogRef = doc(db, "blogs", blogId);
        const blogSnapshot = await getDoc(blogRef);
    
        // Check if the blog document exists
        if (!blogSnapshot.exists()) {
          throw new Error(`Blog with ID ${blogId} does not exist.`);
        }
    
        // Update the blog document to include the new topic
        await updateDoc(blogRef, {
          topics: [
            ...(blogSnapshot.data().topics || []), // Keep existing topics if any
            { topic, content },
          ],
        });
    
        // Fetch the updated blog to get the newly added topic
        const updatedBlog = (await getDoc(blogRef)).data();
    
        // Assuming this.blogs is a local state variable, update it with the updated blog
        this.blogs = [
          ...this.blogs.filter((blog) => blog.id !== blogId),
          { id: blogId, ...updatedBlog },
        ];
    
        // Navigate to the dashboard after a successful action
        await navigateAfterAction(`Blog topic for Blog ${blogId} added!`);
        router.push("/dashboard");
      } catch (error) {
        console.error("Error adding Blog topic: ", error);
        Swal.fire({
          icon: "error",
          title: "Blog topic Addition Error",
          text: error.message,
        });
      }
    },
    
    
    
    
    
  
    async fetchAllBlogs() {
      try {
        const db = getFirestore();
        const blogsCollection = collection(db, "blogs");
        const querySnapshot = await getDocs(blogsCollection);

        const blogs = [];
        querySnapshot.forEach((doc) => {
          blogs.push({ id: doc.id, ...doc.data() });
        });

        this.blogs = blogs;
      } catch (error) {
        console.error("Error fetching blogs: ", error.message);
        throw error;
      }
    },
    async fetchSingleBlog(BlogId) {
      try {
        const db = getFirestore();
        const blogRef = doc(db, "blogs", BlogId);
        const docSnapshot = await getDoc(blogRef);

        if (docSnapshot.exists()) {
          this.blogs = { ...docSnapshot.data(), id: docSnapshot.id };
        } else {
          console.warn(`Blog with ID ${BlogId} does not exist.`);
          this.blogs = null;
        }
      } catch (error) {
        console.error("Error fetching single blog: ", error.message);
        throw error;
      }
    },
    async updateBlog({ BlogId, blogData }) {
      try {
        // Display a confirmation dialog using SweetAlert
        const userConfirmed = await Swal.fire({
          title: "Update Blog",
          text: "Are you sure you want to update this blog?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, update it!",
        });
    
        // If the user cancels the update, return
        if (!userConfirmed.isConfirmed) {
          return;
        }
    
        const db = getFirestore();
        const blogRef = doc(db, "blogs", BlogId);
        const docSnapshot = await getDoc(blogRef);
    
        if (docSnapshot.exists()) {
          const existingBlogData = docSnapshot.data();
    
          const updatedBlogData = { ...existingBlogData, ...blogData };
    
          await updateDoc(blogRef, updatedBlogData);
    
          // Assuming that this.blogs is an array
          if (Array.isArray(this.blogs)) {
            // Update the local array
            const index = this.blogs.findIndex((blog) => blog.id === BlogId);
    
            if (index !== -1) {
              this.blogs[index] = { ...this.blogs[index], ...updatedBlogData };
            }
          } else {
            // Assuming this.blogs is a single object
            this.blogs = { ...this.blogs, ...updatedBlogData };
          }
    
          await navigateAfterAction("Blog Updated Successfully!");
          router.push("/dashboard");
        } else {
          console.warn(`Blog with ID ${BlogId} does not exist.`);
        }
      } catch (error) {
        console.error("Error updating blog: ", error.message);
        // Handle errors appropriately
        Swal.fire({
          icon: "error",
          title: "Error Updating Blog",
          text: error.message || "An error occurred while updating the blog.",
        });
        throw error;
      }
    }
    ,
    async deleteBlog(BlogId) {
      try {
        const userConfirmed = await Swal.fire({
          title: "Delete Blog",
          text: "Are you sure you want to delete this Blog?",
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
        const blogRef = doc(db, "blogs", BlogId);
        await deleteDoc(blogRef);

        this.blogs = this.blogs.filter((blog) => blog.id !== BlogId);

        await navigateAfterAction("blog deleted successfully!", "warning");
        router.push("/dashboard");
      } catch (error) {
        console.error("Error deleting blog: ", error);
        throw error;
      }
    },
  },
});
