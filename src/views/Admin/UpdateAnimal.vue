<template>
    <div class="container-fluid">
        <div class="row align-items-center">
            <div class="row justify-content-center">
                <div class="col-md-6 text-primary font-weight-bold text-center text-uppercase">
                    <h6>Update Selected animal Here</h6>
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
                            <label for="status" class="form-label">Select animal type</label>
                            <select name="name" v-model="animal_form.type" class="form-select" id="type">
                                <option value="cow">cow</option>
                                <option value="goat">goat</option>
                                <option value="sheep">sheep</option>
                               
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="owner" class="form-label">owner</label>
                            <input type="text" v-model="animal_form.owner" class="form-control" id="owner">
                        </div>
                        <div class="mb-3">
                            <label for="status" class="form-label">Select animal location</label>
                            <select name="name" v-model="animal_form.location" class="form-select" id="location">
                                <option value="chelemei">chelemei</option>
                                <option value="kamongil">kamongil</option>
                                <option value="kipsingei">kipsingei</option>
                                <option value="others">others</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="status" class="form-label">Select animal status</label>
                            <select name="name" v-model="animal_form.status" class="form-select" id="status">
                                <option value="died">died</option>
                                <option value="available">available</option>
                                <option value="sold">sold</option>
                               
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <input type="text" v-model="animal.description" class="form-control" id="description">
                        </div>
                        <div class="mb-3">
                            <label for="image" class="form-label">Image</label>
                            <input type="file" @change="handleImageChange" class="form-control" id="image">
                        </div>
                        <div class="mb-3">
                            <label for="image" class="form-label">Image Preview</label>
                            <img :src="imagePreview" alt="animal image" class="img-thumbnail"
                                style="width: 10rem; height: 8rem;">
                        </div>
                        <div class="mb-3">
                            <label for="date" class="form-label">Date</label>
                            <input type="date" v-model="animal.date" class="form-control" id="date">
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
import { useAnimalsStore } from '../../stores/animalsStore';

export default {
    setup() {
        const animal = ref({});
        const loading = ref(true);
        const animalStore = useAnimalsStore();
        const route = useRoute();
        const imagePreview = ref(null);
        const isUpdating = ref(false);

        const fetchedAnimal = async (animalId) => {
            try {
                loading.value = true;

                await animalStore.fetchAllAnimals(animalId);
                const fetchedAnimals = animalStore.animals.filter(c => c.id === animalId);

                if (fetchedAnimals.length > 0) {
                    animal.value = { ...fetchedAnimals[0] };
                    updateImagePreview(); // Move this line here
                } else {
                    animal.value = null;
                }
            } catch (error) {
                console.error('Error fetching animal: ', error.message);
            } finally {
                loading.value = false;
            }
        };


        const update = async () => {
            try {
                isUpdating.value = true;
                console.log('Before update:', animal.value);

                // Update the animal
                await animalStore.updateanimal(animal.value.id, { ...animal.value });

                // Log the updated animal
                console.log('After update:', animalStore.animals.find(c => c.id === animal.value.id));
            } catch (error) {
                console.error('Error updating animal: ', error);
            } finally {
                isUpdating.value = false;
            }
        };


        const handleImageChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                animal.value.image = file;
                updateImagePreview();
            }
        };

        const updateImagePreview = () => {
            if (animal.value.image && animal.value.image instanceof File) {
                imagePreview.value = URL.createObjectURL(animal.value.image);
            }
        };
        const handleSubmit = () => {
            const animalId = animal.value.id;
            update(animalId);
        };
        onMounted(() => {
            const animalId = route.params.id;
            if (animalId) {
                fetchedAnimal(animalId);
                updateImagePreview();
            }
        });

        return {
            loading,
            animal,
            imagePreview,
            isUpdating,
            handleImageChange,
            handleSubmit,
        };
    },
};
</script>

