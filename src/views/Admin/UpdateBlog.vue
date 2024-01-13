<template>
  <div class="container-fluid">
    <div class="row align-items-center">
      <div class="row justify-content-center">
        <div class="col-md-6 text-primary font-weight-bold text-center text-uppercase">
          <h6>Update Selected Blog Here</h6>
        </div>
      </div>
      <div class="col text-center mx-auto" v-if="loading">
        <div class="d-flex mx-auto justify-content-center">
          <div class="spinner-border text-warning" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      <div v-else class="col text-center">
        <div class="card border-primary mx-auto" style="width: 30rem;">
          <form @submit.prevent="handleSubmit" class="p-4">
            <div class="mb-3">
              <label for="title" class="form-label">Title</label>
              <input type="text" v-model="blog.title" class="form-control" id="title">
            </div>
            <div class="mb-3">
              <label for="subject" class="form-label">Subject</label>
              <input type="text" v-model="blog.subject" class="form-control" id="subject">
            </div>
            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <input type="text" v-model="blog.description" class="form-control" id="description">
            </div>
            <div class="mb-3">
              <label for="date" class="form-label">Date</label>
              <input type="date" v-model="blog.date" class="form-control" id="date">
            </div>
            <div>
              <button class="btn btn-primary text-center" type="submit" :disabled="isUpdating">
                <span v-if="!isUpdating">UPDATE</span>
                <span v-else>Updating in...</span>
                <div v-if="isUpdating" class="spinner-border text-warning" role="status">
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
import { useRoute } from 'vue-router';
import { useBlogStore } from '../../stores/blogStore';

export default {
  setup() {
    const blog = ref({
      title: '',
      subject: '',
      description: '',
      date: '',
    });

    const loading = ref(true);
    const blogStore = useBlogStore();
    const route = useRoute();
    const isUpdating = ref(false);

    const fetchedBlog = async (BlogId) => {
      try {
        loading.value = true;
        await blogStore.fetchSingleBlog(BlogId);
        const fetchedBlog = blogStore.blogs;

        if (fetchedBlog) {
          blog.value = { ...fetchedBlog };
        } else {
          blog.value = null;
        }
      } catch (error) {
        console.error('Error fetching blog: ', error.message);
      } finally {
        loading.value = false;
      }
    };

    const update = async () => {
      try {
        isUpdating.value = true;

        if (blog.value) {
          const BlogId = blog.value.id;
          await blogStore.updateBlog({ BlogId, blogData: { ...blog.value } });
        }
      } catch (error) {
        console.error('Error updating blog: ', error);
      } finally {
        isUpdating.value = false;
      }
    };

    const handleSubmit = () => {
      update();
    };

    onMounted(() => {
      const BlogId = route.params.id;
      if (BlogId) {
        fetchedBlog(BlogId);
      }
    });

    return {
      loading,
      blog,
      isUpdating,
      handleSubmit,
    };
  },
};
</script>
