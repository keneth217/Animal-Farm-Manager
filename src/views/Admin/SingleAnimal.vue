<template>
    <div class="container mt-3">
        <div class="row align-items-center">
            <div class="row justify-content-center p-2">
                <div class="col-md-6 text-primary font-weight-bold text-center text-uppercase">
                    <h6>Animaldetails</h6>
                </div>
            </div>
            <div class="col text-center" v-if="loading">
                <div class="d-flex justify-content-center">
                    <div class="spinner-border text-warning" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
            <div v-else-if="Object.keys(animal).length !== 0" class="col justify-items-start">

                <div class="card border-primary mx-auto" style="width: 25rem; height: 30rem;">
                    <img :src="animal.image" class="card-img-top" style="width: 25rem;height: 15rem;" alt="...">
                    <div class="card-body">
                        <h5 class="card-title text-success">Type: {{ animal.type }}</h5>
                        <p class="card-text text-danger">owner: {{ animal.owner }}</p>
                        <p class="card-text text-danger">Location: {{ animal.location }}</p>
                        <p class="card-text text-danger">status: {{ animal.status }}</p>
                        <p class="card-text text-danger">Date added: {{ animal.date }}</p>
                        <!-- <p class="card-text text-danger">Subject: {{ animal.subject }}</p>
                            <p class="card-text text-primary">Description: {{ animal.description }}</p> -->
                    </div>
                    <div class="d-flex justify-content-center card-title">
                        <router-link :to="`/dashboard/update/${animal.id}`">
                            <button type="button" class="btn btn-outline-success me-2">Update animal</button>
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
// import Swal from 'sweetalert2';
import { useAnimalsStore } from '../../stores/animalsStore';

export default {
    setup() {
        const route = useRoute();
        const loading = ref(true);
        const animal= ref({});
        const singleAnimal= useAnimalsStore();
        const isDeleting = ref(false);

        const fetchAnimal= async (animalId) => {
            try {
                loading.value = true;
                await singleAnimal.fetchAllAnimals(animalId);
                animal.value = singleAnimal.animals.find(c => c.id === animalId);
                console.log(animal.value);
            } catch (error) {
                console.error('Error fetching animal: ', error.message);
            } finally {
                loading.value = false;
            }
        }
        const deleteAnimal= async () => {
            try {
                isDeleting.value = true;
                const animalId = route.params.id;
                await singleAnimal.deleteAnimal(animalId);
            } catch (error) {
                console.error('Error deleting animal: ', error);
            } finally {
                isDeleting.value = false;
            }
        };

        const confirmDelete = () => {
            deleteAnimal();
        };

        onMounted(() => {
            const animalId = route.params.id;
            console.log('AnimalID:', animalId);
            if (animalId) {
                fetchAnimal(animalId);
            }
        });

        return {
            loading,
            animal,
            isDeleting,
            confirmDelete,
        };
    },
};
</script>
