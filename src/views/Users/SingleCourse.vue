<template>
    <section class="min-vh-100 d-flex bg-dark text-white">
        <div class="container-fluid mt-5">
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
                    <div class="row mt-3  p-3">
                        <div class="col-lg-12 col-md-12">
                            <div class="col mt-3  font-weight-bold  ">
                                <p>Updated on {{ course.date }} </p>
                            </div>
                            <div class="col mt-3  font-weight-bold  ">
                                <h3>{{ course.title }} </h3>
                            </div>
                            <div class="col mt-3 mx-auto ">
                                <img :src="course.image" class="card-img-top " alt="...">
                            </div>

                            <div class="col mt-3  font-weight-bold text-primary text-decoration-underline ">
                                <p>{{ course.subject }} </p>
                            </div>
                            <div class="col mt-3 ">
                                <p>{{ course.description }}</p>
                            </div>
                            <div class="col mt-3">
                                <div v-for="(course, index) in course.topics" :key="index">
                                    <p class="text-primary text-decoration-underline">{{ course.topic }}</p>
                                    <p>{{ course.content }}</p>
                                </div>
                            </div>




                        </div>
                    </div>
                </div>
                <hr>
            </div>
        </div>
        <hr>
    </section>
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
                // const result = await Swal.fire({
                //     title: 'Are you sure?',
                //     text: 'You will not be able to recover this course!',
                //     icon: 'warning',
                //     showCancelButton: true,
                //     confirmButtonColor: '#d33',
                //     cancelButtonColor: '#3085d6',
                //     confirmButtonText: 'Yes, delete it!',
                // });

                // if (result.isConfirmed) {
                //     const courseId = route.params.id;
                //     await singleCourse.deleteCourse(courseId);
                //     Swal.fire({
                //         icon: 'success',
                //         title: 'Course deleted successfully!',
                //         showConfirmButton: false,
                //         timer: 1500,
                //     });
                // }
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
            const courseTitle = route.params.title;
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
<style scoped>
.card-img-top {
    width: 20% !important;
    height: 20% !important;
    text-align: center;
    display: flex;
    background-position: center;

}
</style>