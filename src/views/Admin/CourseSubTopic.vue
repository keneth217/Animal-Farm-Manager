<template>
    <div class="container mb-2">
      <div class="row justify-content-center">
        <div class="col-md-6 text-primary font-weight-bold text-center text-uppercase">
          <h6>Add new course topic</h6>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card mt-2 border-primary">
            <form @submit.prevent="add" class="p-4">
              <div class="mb-3">
                <label for="topic" class="form-label">Topic</label>
                <input type="text" v-model="course.topic" class="form-control" id="topic" required>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">Content</label>
                <input type="text" v-model="course.content" class="form-control" id="content" required>
              </div>
              <div class="align-items-center">
                <button class="btn btn-primary text-center" type="submit" :disabled="isPosting">
                  <span v-if="!isPosting">ADD NEW COURSE TOPIC</span>
                  <span v-else>Posting ...</span>
                  <div v-if="isPosting" class="spinner-border text-warning" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  import { ref, onMounted } from 'vue';
  import {useCoursesStore} from '../../stores/coursesStore';
  import { useRoute } from 'vue-router';
  
  export default {
    setup() {
      const courseStore = useCoursesStore();
      const route = useRoute();
  
      const courseId = ref(null); // Use ref for courseId
  
      // On component mount, set the courseId from the route params
      onMounted(() => {
        courseId.value = route.params.id; // Assuming the id is available in the route params
      });
  
      const course = ref({
        id: courseId.value, // Use courseId.value
        topic: '',
        content: '',
      });
      const isPosting = ref(false);
  
      const add = async () => {
        try {
          isPosting.value = true;
  
          await courseStore.addCourseTopic(courseId.value, {
            topic: course.value.topic,
            content: course.value.content,
          });
  
          console.log('course topic added successfully');
  
          // Clear the form after successful submission
          course.value.topic = '';
          course.value.content = '';
        } catch (error) {
          console.error('Error adding course topic:', error.message);
        } finally {
          isPosting.value = false;
        }
      };
  
      return {
        course,
        add,
        isPosting,
      };
    },
  };
  </script>