<template>
    <div class="container mt-3">
        <div class="row align-items-center">
            <div class="row justify-content-center p-2">
                <div class="col-md-6 text-primary font-weight-bold text-center text-uppercase">
                    <h6>Blog details</h6>
                </div>
            </div>
            <div class="col text-center" v-if="loading">
                <div class="d-flex justify-content-center">
                    <div class="spinner-border text-warning" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
            <div v-else-if="Object.keys(blog).length !== 0" class="col-lg-6 col-md-12 justify-items-start">

                <div class="card border-primary mx-auto">
                    <div class="card-body">
                        <p class="card-text ">Title: {{ blog.title }}</p>
                        <p class="card-text ">Date added: {{ blog.date }}</p>
                        <p class="card-text ">Subject: {{ blog.subject }}</p>
                        <!--  <p class="card-text text-primary">Description: {{ course.description }}</p> -->
                    </div>
                    <div class="d-flex justify-content-center card-title">
                        <router-link :to="`/dashboard/topics/add/${blog.id}`">
                            <button type="button" class="btn btn-outline-primary me-2">add new blog topic</button>
                        </router-link>
                        <router-link :to="`/dashboard/blogs/update/${blog.id}`">
                            <button type="button" class="btn btn-outline-success me-2">Update BLog</button>
                        </router-link>
                        <button class="btn btn-outline-danger text-center me-2" type="button" :disabled="isDeleting"
                            @click="confirmDelete">
                            <span v-if="!isDeleting">DELETE blog</span>
                            <span v-else>Deleting...</span>
                            <div v-if="isDeleting" class="spinner-border text-warning" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </button>
                    </div>
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
        const route = useRoute();
        const loading = ref(true);
        const blog = ref({});
        const useBlog = useBlogStore();
        const isDeleting = ref(false);

        const fetchBlog = async (BlogId) => {
            try {
                loading.value = true;
                await useBlog.fetchAllBlogs(BlogId);
                blog.value = useBlog.blogs.find(b => b.id === BlogId);
                console.log(blog.value);
            } catch (error) {
                console.error('Error fetching blogs: ', error.message);
            } finally {
                loading.value = false;
            }
        }
        const deleteBlog = async () => {
            try {
                isDeleting.value = true;
                const BlogId = route.params.id;
                await useBlog.deleteBlog(BlogId);



            } catch (error) {
                console.error('Error deleting blog: ', error);
            } finally {
                isDeleting.value = false;
            }
        };

        const confirmDelete = () => {
            deleteBlog();
        };

        onMounted(() => {
            const BlogId = route.params.id;
            console.log('Blog ID:', BlogId);
            if (BlogId) {
                fetchBlog(BlogId);
            }
        });

        return {
            loading,
            blog,
            isDeleting,
            confirmDelete,
        };
    },
};
</script>
