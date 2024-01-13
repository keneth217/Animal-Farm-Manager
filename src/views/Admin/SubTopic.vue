<template>
  <div class="container mb-2">
    <div class="row justify-content-center">
      <div class="col-md-6 text-primary font-weight-bold text-center text-uppercase">
        <h6>Add new blog topic</h6>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card mt-2 border-primary">
          <form @submit.prevent="add" class="p-4">
            <div class="mb-3">
              <label for="topic" class="form-label">Topic</label>
              <input type="text" v-model="blog.topic" class="form-control" id="topic" required>
            </div>
            <div class="mb-3">
              <label for="content" class="form-label">Content</label>
              <input type="text" v-model="blog.content" class="form-control" id="content" required>
            </div>
            <div class="align-items-center">
              <button class="btn btn-primary text-center" type="submit" :disabled="isPosting">
                <span v-if="!isPosting">ADD NEW BLOG TOPIC</span>
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
import { useBlogStore } from '../../stores/blogStore';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const blogStore = useBlogStore();
    const route = useRoute();

    const blogId = ref(null); // Use ref for blogId

    // On component mount, set the blogId from the route params
    onMounted(() => {
      blogId.value = route.params.id; // Assuming the id is available in the route params
    });

    const blog = ref({
      id: blogId.value, // Use blogId.value
      topic: '',
      content: '',
    });
    const isPosting = ref(false);

    const add = async () => {
      try {
        isPosting.value = true;

        await blogStore.addBlogTopic(blogId.value, {
          topic: blog.value.topic,
          content: blog.value.content,
        });

        console.log('Blog topic added successfully');

        // Clear the form after successful submission
        blog.value.topic = '';
        blog.value.content = '';
      } catch (error) {
        console.error('Error adding blog topic:', error.message);
      } finally {
        isPosting.value = false;
      }
    };

    return {
      blog,
      add,
      isPosting,
    };
  },
};
</script>