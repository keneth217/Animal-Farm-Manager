<template>
    <section class="min-vh-100 text-white bg-dark background">
        <div class="container-fluid text-center">
            <div class="row mt-5 justify-content-center p-2">
                <div class="col-md-6  font-weight-bold text-center ">
                    <h3>If you want to learn something new check out one of my courses. </h3>
                </div>
                <div>
                    <p>Below you will find a list of courses that I currently have available. I put a lot of effort and
                        passion into each one of my courses and I hope that shows. If you're interested in a topic that
                        I don't have listed here please contact me.</p>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col">
                    <div class="row mt-2 mb-2 justify-content-center">
                        <div class="col-md-6 font-weight-bold  type text-uppercase">
                            <ul class="nav nav-tabs text-danger">
                                <li class="nav-item">
                                    <a class="nav-link" @click="changeCourseType('ALL')">ALL</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" @click="changeCourseType('software')">software</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" @click="changeCourseType('cybersecurity')">cybersecurity</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" @click="changeCourseType('information tech')">information
                                        tech</a>
                                </li>
                            </ul>
                        </div>
                        <div class="text-uppercase ms-5"> total availablecourses:<span class="text-primary">{{ totalCourses }}</span></div>
                    </div>

                </div>
            </div>
            <hr>
            <div class="col text-center" v-if="course_data.length === 0">
                <div class="d-flex justify-content-center">
                    <div class="spinner-border mx-auto text-warning" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <h4>
                    No records of articles found.Will be added sooon keep checking...

                </h4>
            </div>
            <div v-else class="row justify-content-center">
                <div class="col-md-4 col-lg-3 col-sm-12 mb-3 mx-auto" v-for="(course, index) in course_data" :key="index">
                    <div class="card border-primary" style="width: 18rem; height: 18rem;">
                        <img :src="course.image" class="card-img-top" style="width: 18rem;height: 10rem;" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">{{ course.type }}</h5>
                            <router-link type="button" class="btn btn-info" :to="`/my/${course.id}/${course.title}`">view
                                more</router-link>
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
            <hr>
        </div>

    </section>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { useCoursesStore } from '../../stores/coursesStore';

export default {
    setup() {
        const course_data = ref([]);
        const courseStore = useCoursesStore();
        const itemsPerPage = 4;
        // const total = courseStore.totalCourses
        const currentPage = ref(1);
        const currentCourseType = ref('ALL');
        const totalCourses = computed(() => courseStore.totalCourses);
        console.log(totalCourses)
        // Watcher for totalMessages
        watch(totalCourses, (newValue) => {
            console.log('Total courses changed:', newValue);
        });

        const fetchCourses = async () => {
            await courseStore.fetchAllCourses();
            course_data.value = courseStore.courses;
        };

        const getFilteredCourseData = () => {
            return currentCourseType.value === 'ALL'
                ? course_data.value
                : course_data.value.filter(course => {
                    return currentCourseType.value === 'ALL' || course.type === currentCourseType.value;
                });
        };

        const paginatedCourseData = computed(() => {
            const filteredData = getFilteredCourseData();
            const startIndex = (currentPage.value - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return filteredData.slice(startIndex, endIndex);
        });

        const totalPages = computed(() => Math.ceil(getFilteredCourseData().length / itemsPerPage));

        const changePage = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
            }
        };

        const changeCourseType = (type) => {
            console.log('Changing course type to:', type);
            currentCourseType.value = type;
            currentPage.value = 1;
            fetchCourses();
        };

        onMounted(() => {
            fetchCourses();
        });

        return {
            course_data,
            paginatedCourseData,
            currentPage,
            totalPages,
            changePage,
            changeCourseType,
            totalCourses
        };
    },
};
</script>
<style scoped>
.background {

    background: rgb(154, 154, 89);
    width: 100%;
    min-height: 100vh;
    text-align: center;
    display: flex;
    background-attachment: fixed;

    background-position: center;
    background-size: cover;
    opacity: 1;
}

.type {
    color: black;
}
</style>