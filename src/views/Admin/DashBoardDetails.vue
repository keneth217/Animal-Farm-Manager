<template>
    <section class="min-vh-100 d-flex bg-dark">
        <div class="container-fluid">
            <div class="col text-center ps-md-2">
                <div class="page-header pt-3">
                    <h2 class="text-uppercase text-white">records and statistics</h2>
                </div>
            </div>
            <div class="row">
               
                <div class="col-lg-4 col-md-12 mx-auto">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">courses</h5>
                            <p class="card-text">{{ totalCourses }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-12">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">blogs</h5>
                            <p class="card-text">{{ totalBlogs }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-12">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">messages</h5>
                            <p class="card-text">{{ totalMessages }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row text-center justify-items-center">
                <div class="col-lg-6 col-md-6  text-center justify-items-center">
                    <div class="card mb-3">
                        <BarChart />
                    </div>
                </div>
            </div>
            <hr>
        </div>
    </section>
</template>

<script>
import BarChart from './Statistics.vue'
import { ref, onMounted, computed, watch } from 'vue';
import { useCoursesStore } from '../../stores/coursesStore';
import { useBlogStore } from '../../stores/blogStore';
import { useMessageStore } from '../../stores/contactsStore';
import { useAuthStore } from '../../stores/authStore';

export default {
    name: 'DashBoardDetails',
    components: { BarChart },

    setup() {
        const courseStore = useCoursesStore();
        const messageStore = useMessageStore();
        const blogStore = useBlogStore();
       

        // Fetch data on component mount
        onMounted(async () => {
            await courseStore.fetchAllCourses();
            await messageStore.fetchAllMessages();
            await blogStore.fetchAllBlogs();
        
        });

        watch(() => courseStore.totalCourses, (newValue) => {
            console.log('Total courses changed:', newValue);
        });

        const totalCourses = computed(() => courseStore.totalCourses);
        const totalMessages = computed(() => messageStore.totalMessages);
        const totalBlogs = computed(() => blogStore.totalBlogs);
      

        return {
            totalCourses,
            totalMessages,
            totalBlogs,
        
        };
    },
};
</script>



