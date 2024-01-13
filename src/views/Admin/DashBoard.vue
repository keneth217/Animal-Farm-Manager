<template>
    <transition name="bounce">
        <div class="container-fluid justify-content-center">
            <div class="d-sm-flex align-items-center justify-content-center  mb-4">
                <h1 class="h3 mb-0 text-danger">ANIMALS FARM MANAGEMENT SYSTEM</h1>
            </div>

            <div class="row justify-content-center">
                <div class="col-xl-4 col-md-6 mb-4">
                    <div class="card border-success shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class=" font-weight-bold text-success text-uppercase mb-1">
                                        <h1>STATUS</h1>
                                    </div>
                                    <div class="h6 mb-0 font-weight-bold text-gray-800"> TOTAL:{{ totalAnimals }}</div>
                                    <div class="h6 mb-0 font-weight-bold text-gray-800"> AVAILABLE:{{ availableCount }}
                                    </div>
                                    <div class="h6 mb-0 font-weight-bold text-gray-800">DIED: {{ diedCount }}</div>
                                    <div class="h6 mb-0 font-weight-bold text-gray-800">SOLD: {{ soldCount }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="col-xl-4 col-md-6 mb-4">
                    <div class="card border-primary shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class=" font-weight-bold text-primary text-uppercase mb-1">
                                        <h1>LOCATION</h1>
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">CHELEMEI: {{ chelemeiCount }}</div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">KIPSINGEI: {{ kipsingeiCount }}
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">KAMONGIL: {{ kamongilCount }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-md-6 mb-4">
                    <div class="card border-warning shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                        <h1>TYPE:</h1>
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">COWS:{{ cowsCount }}</div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">GOATS:{{ goatsCount }}</div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">SHEEP:{{ sheepsCount }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <!-- <div class="row justify-content-center">
            <div class="col-lg-6">
                <router-link to="/dashboard/add" class="btn btn-success">
                    ADD ANIMAL
                </router-link>
                <router-link to="/dashboard/animals" class="btn btn-success">
                    ANIMALS
                </router-link>
            </div>
        </div> -->
            <div class="row justify-content-center">
                <div class="col-md-6">

                    <div class="card mb-4">
                        <div class="card-header text-uppercase">
                            STATISTICS per status
                        </div>
                        <div class="card-body">
                            <BarChart />
                        </div>
                    </div>
                </div>
                <div class="col-md-6">

                    <div class="card mb-4">
                        <div class="card-header text-uppercase">
                            STATISTICS per location
                        </div>
                        <div class="card-body">
                            <PieChart />
                        </div>
                    </div>
                </div>
            </div>
            <router-view></router-view>
        </div>
    </transition>
</template>
<script>
import BarChart from '../views/BarChart.vue'
import PieChart from '../views/PieChart.vue'
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
    components: {
        BarChart,
        PieChart
    },
    setup() {
        const store = useStore();

        // Trigger the action to fetch all animals and sort them by status
        onMounted(async () => {
            try {
                await store.dispatch('fetchAllAnimals');
                console.log('Fetched animals:', store.state.animals);
            } catch (error) {
                console.error('Error fetching animals:', error);
            }
        });

        const totalAnimals = computed(() => {
            return (store.state.animals || []).length;
        });

        const availableCount = computed(() => {
            const animals = store.state.animals || [];
            return animals.filter(animal => animal.status === 'available').length;
        });

        const diedCount = computed(() => {
            return (store.state.animals || []).filter(animal => animal.status === 'died').length;
        });

        const soldCount = computed(() => {
            return (store.state.animals || []).filter(animal => animal.status === 'sold').length;
        });
        // typecount
        const cowsCount = computed(() => {
            return (store.state.animals || []).filter(animal => animal.type === 'cow').length;
        });
        const goatsCount = computed(() => {
            return (store.state.animals || []).filter(animal => animal.type === 'goat').length;
        });
        const sheepsCount = computed(() => {
            return (store.state.animals || []).filter(animal => animal.type === 'sheep').length;
        });
        //location count
        const chelemeiCount = computed(() => {
            return (store.state.animals || []).filter(animal => animal.location === 'chelemei').length;
        });
        const kamongilCount = computed(() => {
            return (store.state.animals || []).filter(animal => animal.location === 'kamongil').length;
        });
        const kipsingeiCount = computed(() => {
            return (store.state.animals || []).filter(animal => animal.location === 'kipsingei').length;
        });

        return {
            totalAnimals,
            availableCount,
            diedCount,
            soldCount,
            cowsCount,
            sheepsCount,
            goatsCount,
            chelemeiCount,
            kamongilCount,
            kipsingeiCount
        };
    },
};
</script>
<style>
.bounce-enter-active {
    animation: bounce-in 0.5s;
}

.bounce-leave-active {
    animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
    0% {
        transform: scale(0);
    }

    50% {
        transform: scale(1.25);
    }

    100% {
        transform: scale(1);
    }
}
</style>