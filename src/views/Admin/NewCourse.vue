<template>
    <div class="container mb-2">
        <div class="row justify-content-center">
            <div class="col-md-6 text-primary font-weight-bold text-center text-uppercase">
                <h6>Add course to list here</h6>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card mt-2 border-primary">
                    <!-- <form @submit.prevent="add" class="p-4"> -->
                    <form @submit.prevent class="p-4">
                        <div class="mb-3">
                            <label for="status" class="form-label">Select course type</label>
                            <select name="name" v-model="course_form.type" class="form-select" id="type">
                                <option value="software">software</option>
                                <option value="information tech">information tech</option>
                                <option value="Cybersecurity">Cybersecurity</option>
                                <option value="Networking">Networking</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="title" class="form-label">title</label>
                            <input type="text" v-model="course_form.title" class="form-control" id="title">
                        </div>
                        <div class="mb-3">
                            <label for="subject" class="form-label">subject</label>
                            <input type="text" v-model="course_form.subject" class="form-control" id="subject">
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <input type="text" v-model="course_form.description" class="form-control" id="description">
                        </div>

                        <div class="mb-3">
                            <label for="image" class="form-label">Image</label>
                            <input type="file" @change="handleImageChange" class="form-control" id="image">

                        </div>
                        <div class="mb-3">
                            <label for="image" class="form-label">Image Preview</label>
                            <img :src="course_form.imagePreview" alt="course image" class="img-thumbnail"
                                style="width: 10rem; height: 8rem;">
                        </div>
                        <div class="mb-3">
                            <label for="date" class="form-label">Date</label>
                            <input type="date" v-model="course_form.date" class="form-control" id="date">
                        </div>
                        <div class="align-items-center">
                            <button class="btn btn-primary text-center" type="submit" :disabled="isAdding" @click="add">
                                <span v-if="!isAdding">ADD NEW COURSE</span>
                                <span v-else>Adding ...</span>
                                <div v-if="isAdding" class="spinner-border text-warning" role="status">
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
import { ref } from 'vue';
import { useCoursesStore } from '../../stores/coursesStore';

export default {
    setup() {
        const courseStore = useCoursesStore()
        const course_form = ref({
            type: 'software',
            title: '',
            subject: '',
            description: '',
            image: null,
            date: '',
        });
        const isAdding = ref(false);
        const add = async () => {
            try {
                isAdding.value = true;
                // Pass the course_form data to the add action
                await courseStore.addCourse({
                    type: course_form.value.type,
                    title: course_form.value.title,
                    subject: course_form.value.subject,
                    description: course_form.value.description,
                    date: course_form.value.date,
                    image: course_form.value.image

                })
                console.log('course added succesfully')
            } catch (error) {
                console.log(error.message)
            } finally {
                isAdding.value = false;
            }
        }
        const handleImageChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                course_form.value.image = file;
                course_form.value.imagePreview = URL.createObjectURL(file);
            }
        };
        return {
            course_form,
            add,
            handleImageChange,
            isAdding
        };
    },
};
</script>