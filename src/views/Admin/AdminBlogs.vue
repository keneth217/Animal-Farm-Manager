<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6 text-primaryfont-weight-bold text-center mb-3 ">
                <h3>my blogs list</h3>
            </div>
            <p class="text-white text-uppercase">total blogs{{ totalBlogs }}</p>
        </div>
        <div class="row justify-content-center text-white mt-5">
            <div class="col-md-6  mb-5">
                <div class="">
                    <div class=" mx-auto" v-for="(blog, index) in paginatedBlogData" :key="index">
                        <div class=" mb-3">
                            <!-- Date -->
                            <div>{{ blog.date }}</div>
                        </div>
                        <!-- Card -->
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">{{ blog.title }}</h5>
                                <p class="card-text">{{ blog.subject }}</p>
                                <router-link :to="`/dashboard/blogs/${blog.id}`" class="text-decoration-none">
                                    Read more<i class="bi bi-chevron-right me-2"></i>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <nav aria-label="Page navigation example">
                <ul class="pagination justify-content-end">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" @click="changePage(currentPage - 1)">Previous</a>
                    </li>
                    <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                        <a class="page-link" @click="changePage(page)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <a class="page-link" @click="changePage(currentPage + 1)">Next</a>
                    </li>
                </ul>
            </nav>

        </div>
    </div>
</template>
<script>
import { ref, onMounted, computed, watch } from 'vue';
import { useBlogStore } from '../../stores/blogStore';

export default {
    setup() {
        const blog_data = ref([]);
        const blogStore = useBlogStore();
        const itemsPerPage = 4;

        const currentPage = ref(1);
        const loading = ref(false);
        const error = ref(null);

        const totalBlogs = computed(() => blogStore.totalBlogs);

        watch(totalBlogs, (newValue) => {
            console.log('Total blogs changed:', newValue);
        });

        const fetchBlogs = async () => {
            try {
                loading.value = true;
                await blogStore.fetchAllBlogs();

                // Sort blogs by date in descending order
                blog_data.value = blogStore.blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
            } catch (error) {
                console.error('Error fetching blogs: ', error.message);
                // Set the error state to display an error message to the user
                error.value = 'Error fetching blogs. Please try again later.';
            } finally {
                loading.value = false;
            }
        };

        const paginatedBlogData = computed(() => {
            const startIndex = (currentPage.value - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return blog_data.value.slice(startIndex, endIndex);
        });

        const totalPages = computed(() => Math.ceil(blog_data.value.length / itemsPerPage));

        const changePage = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
            }
        };

        onMounted(() => {
            fetchBlogs();
        });

        return {
            blog_data,
            paginatedBlogData,
            currentPage,
            totalPages,
            totalBlogs,
            loading,
            error
        };
    },
};
</script>
