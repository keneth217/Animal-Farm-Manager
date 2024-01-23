<template>
    <div class="container">
        <div class="row  justify-content-center p-3">
            <div class="col-md-6   font-weight-bold text-center text-white">
                <h3> AVAILABLE animalS</h3>
            </div>

        </div>
        <div class="row justify-content-center">
            <div class="col">
                <div class="row mt-2 mb-2 justify-content-center">
                    <div class="col-md-6 font-weight-bold  type text-uppercase">
                        <ul class="nav nav-tabs text-danger">
                            <li class="nav-item">
                                <a class="nav-link" @click="changeAnimalType('ALL')">ALL</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" @click="changeAnimalType('cows')">cows</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" @click="changeAnimalType('goats')">goats</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" @click="changeAnimalType('sheep')">sheep</a>
                            </li>
                        </ul>
                    </div>
                    <div class="text-white"> found animals:({{ totalAnimals }})</div>
                </div>

            </div>
        </div>
        <hr>
        <div class="col text-center text-white" v-if="animal_data.length === 0">
            <div class="d-flex justify-content-center">
                <div class="spinner-border mx-auto text-warning" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <h4>
                No records of animals found.Will be added sooon keep checking...

            </h4>
        </div>
        <div v-else class="row justify-content-center">
            <div class="col-md-4 col-lg-3 col-sm-12 mb-3 mx-auto" v-for="(animal, index) in paginatedanimalData"
                :key="index">
                <div class="card border-primary" style="width: 18rem; height: 18rem;">
                    <img :src="animal.image" class="card-img-top" style="width: 18rem;height: 10rem;" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">{{ animal.type }}</h5>
                        <h5 class="card-title">{{ animal.owner }}</h5>
                        <router-link type="button" class="btn btn-info" :to="`/dashboard/single/${animal.id}`">view
                            more</router-link>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
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
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { useAnimalsStore } from '../../stores/animalsStore';

export default {
    setup() {
        const animal_data = ref([]);
        const animalStore = useAnimalsStore();
        const itemsPerPage = 4;
        // const total = animalStore.totalanimals
        const currentPage = ref(1);
        const currentAnimalType = ref('ALL');
        const totalAnimals = computed(() => animalStore.totalAnimals);
        console.log(totalAnimals)
        // Watcher for totalMessages
        watch(totalAnimals, (newValue) => {
            console.log('Total animals changed:', newValue);
        });

        const fetchAnimals = async () => {
            await animalStore.fetchAllAnimals();
            animal_data.value = animalStore.animals;
        };

        const getFilteredanimalData = () => {
            return currentAnimalType.value === 'ALL'
                ? animal_data.value
                : animal_data.value.filter(animal => {
                    return currentAnimalType.value === 'ALL' || animal.type === currentAnimalType.value;
                });
        };

        const paginatedAnimalData = computed(() => {
            const filteredData = getFilteredAnimalData();
            const startIndex = (currentPage.value - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return filteredData.slice(startIndex, endIndex);
        });

        const totalPages = computed(() => Math.ceil(getFilteredAnimalData().length / itemsPerPage));

        const changePage = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
            }
        };

        const changeAnimalType = (type) => {
            console.log('Changing animal type to:', type);
            currentAnimalType.value = type;
            currentPage.value = 1;
            fetchanimals();
        };

        onMounted(() => {
            fetchAnimals();
        });

        return {
            animal_data,
            paginatedAnimalData,
            currentPage,
            totalPages,
            changePage,
            changeAnimalType,
            totalAnimals
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