<template>
    <div class="container mt-3">
        <div class="row align-items-center">
            <div class="row justify-content-center p-2">
                <div class="col-md-6 text-primary font-weight-bold text-center text-uppercase">
                    <h6>Course details</h6>
                </div>
            </div>
            <div class="col text-center" v-if="loading">
                <div class="d-flex justify-content-center">
                    <div class="spinner-border text-warning" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
            <div v-else-if="Object.keys(course).length !== 0" class="col justify-items-start">

                <div class="card border-primary mx-auto" style="width: 25rem; height: 30rem;">
                    <img :src="course.image" class="card-img-top" style="width: 25rem;height: 15rem;" alt="...">
                    <div class="card-body">
                        <h5 class="card-title text-success">Type: {{ course.type }}</h5>
                        <p class="card-text text-danger">Title: {{ course.title }}</p>
                        <p class="card-text text-danger">Date added: {{ course.date }}</p>
                        <!-- <p class="card-text text-danger">Subject: {{ course.subject }}</p>
                            <p class="card-text text-primary">Description: {{ course.description }}</p> -->
                    </div>
                    <div class="d-flex justify-content-center card-title">
                        <router-link :to="`/dashboard/topic/add/${course.id}`">
                            <button type="button" class="btn btn-outline-primary me-2">ADD A subtopic</button>
                        </router-link>
                        <router-link :to="`/dashboard/update/${course.id}`">
                            <button type="button" class="btn btn-outline-success me-2">Update Course</button>
                        </router-link>
                        <button class="btn btn-outline-danger text-center me-2" type="button" :disabled="isDeleting"
                            @click="confirmDelete">
                            <span v-if="!isDeleting">DELETE</span>
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
import Swal from 'sweetalert2';
import { useCoursesStore } from '../../stores/coursesStore';

export default {
    setup() {
        const route = useRoute();
        const loading = ref(true);
        const course = ref({});
        const singleCourse = useCoursesStore();
        const isDeleting = ref(false);

        const fetchCourse = async (courseId) => {
            try {
                loading.value = true;
                await singleCourse.fetchAllCourses(courseId);
                course.value = singleCourse.courses.find(c => c.id === courseId);
                console.log(course.value);
            } catch (error) {
                console.error('Error fetching course: ', error.message);
            } finally {
                loading.value = false;
            }
        }
        const deleteCourse = async () => {
            try {
                isDeleting.value = true;
                const courseId = route.params.id;
                await singleCourse.deleteCourse(courseId);
            } catch (error) {
                console.error('Error deleting course: ', error);
            } finally {
                isDeleting.value = false;
            }
        };

        const confirmDelete = () => {
            deleteCourse();
        };

        onMounted(() => {
            const courseId = route.params.id;
            console.log('Course ID:', courseId);
            if (courseId) {
                fetchCourse(courseId);
            }
        });

        return {
            loading,
            course,
            isDeleting,
            confirmDelete,
        };
    },
};
</script>
