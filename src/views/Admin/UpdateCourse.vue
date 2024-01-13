<template>
    <div class="container-fluid">
        <div class="row align-items-center">
            <div class="row justify-content-center">
                <div class="col-md-6 text-primary font-weight-bold text-center text-uppercase">
                    <h6>Update Selected Course Here</h6>
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
                            <label for="type" class="form-label">Select course type</label>
                            <select name="name" v-model="course.type" class="form-select" id="type">
                                <option value="software">software</option>
                                <option value="information tech">information tech</option>
                                <option value="Cybersecurity">Cybersecurity</option>
                                <option value="Networking">Networking</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="title" class="form-label">Title</label>
                            <input type="text" v-model="course.title" class="form-control" id="title">
                        </div>
                        <div class="mb-3">
                            <label for="subject" class="form-label">Subject</label>
                            <input type="text" v-model="course.subject" class="form-control" id="subject">
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <input type="text" v-model="course.description" class="form-control" id="description">
                        </div>
                        <div class="mb-3">
                            <label for="image" class="form-label">Image</label>
                            <input type="file" @change="handleImageChange" class="form-control" id="image">
                        </div>
                        <div class="mb-3">
                            <label for="image" class="form-label">Image Preview</label>
                            <img :src="imagePreview" alt="course image" class="img-thumbnail"
                                style="width: 10rem; height: 8rem;">
                        </div>
                        <div class="mb-3">
                            <label for="date" class="form-label">Date</label>
                            <input type="date" v-model="course.date" class="form-control" id="date">
                        </div>
                        <div class="">
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
import { useCoursesStore } from '../../stores/coursesStore';

export default {
    setup() {
        const course = ref({});
        const loading = ref(true);
        const courseStore = useCoursesStore();
        const route = useRoute();
        const imagePreview = ref(null);
        const isUpdating = ref(false);

        const fetchedCourse = async (courseId) => {
            try {
                loading.value = true;

                await courseStore.fetchAllCourses(courseId);
                const fetchedCourses = courseStore.courses.filter(c => c.id === courseId);

                if (fetchedCourses.length > 0) {
                    course.value = { ...fetchedCourses[0] };
                    updateImagePreview(); // Move this line here
                } else {
                    course.value = null;
                }
            } catch (error) {
                console.error('Error fetching course: ', error.message);
            } finally {
                loading.value = false;
            }
        };


        const update = async () => {
            try {
                isUpdating.value = true;
                console.log('Before update:', course.value);

                // Update the course
                await courseStore.updateCourse(course.value.id, { ...course.value });

                // Log the updated course
                console.log('After update:', courseStore.courses.find(c => c.id === course.value.id));
            } catch (error) {
                console.error('Error updating course: ', error);
            } finally {
                isUpdating.value = false;
            }
        };


        const handleImageChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                course.value.image = file;
                updateImagePreview();
            }
        };

        const updateImagePreview = () => {
            if (course.value.image && course.value.image instanceof File) {
                imagePreview.value = URL.createObjectURL(course.value.image);
            }
        };
        const handleSubmit = () => {
            const courseId = course.value.id;
            update(courseId);
        };
        onMounted(() => {
            const courseId = route.params.id;
            if (courseId) {
                fetchedCourse(courseId);
                updateImagePreview();
            }
        });

        return {
            loading,
            course,
            imagePreview,
            isUpdating,
            handleImageChange,
            handleSubmit,
        };
    },
};
</script>

