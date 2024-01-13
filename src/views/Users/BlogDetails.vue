<template>
    <section class="min-vh-100 bg-dark text-white">
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
                <div v-else-if="Object.keys(blog).length !== 0" class="col-lg-10 col-md-12 justify-items-start">
                    <div class="row mt-3  p-3">
                        <div class="col-lg-12 col-md-12">
                            <div class="col mt-3  font-weight-bold  ">
                                <p>Updated on {{ blog.date }} </p>
                            </div>
                            <div class="col mt-3  font-weight-bold  ">
                                <h3>{{ blog.title }} </h3>
                            </div>
                            <div class="col mt-3  font-weight-bold text-primary text-decoration-underline ">
                                <p>{{ blog.subject }} </p>
                            </div>
                            <div class="col mt-3 ">
                                <p>{{ blog.description }}</p>
                            </div>
                            <div class="col mt-3">
                                <div v-for="(topic, index) in blog.topics" :key="index">
                                    <p class="text-primary text-decoration-underline">{{ topic.topic }}</p>
                                    <p>{{ topic.content }}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <hr>
            </div>
        </div>
    </section>
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

        const fetchBlog = async (BlogId) => {
            try {
                loading.value = true;
                await useBlog.fetchSingleBlog(BlogId);
                blog.value = useBlog.blogs;
                console.log(blog.value);
            } catch (error) {
                console.error('Error fetching blog: ', error.message);
            } finally {
                loading.value = false;
            }
        }

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
        };
    },
};
</script>
