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
                            <h5 class="card-title text-primary text-uppercase text-underline">population</h5>
                            <p class="card-text">total:{{ totalAnimals }}</p>
                            <p class="card-text">cows:{{totalCows  }}</p>
                            <p class="card-text">goats:{{ totalGoats }}</p>
                            <p class="card-text">sheep:{{ totalSheep }}</p>
                           
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-12">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title text-primary text-uppercase text-underline">status</h5>
                            <p class="card-text">available:{{totalAvailable }}</p>
                            <p class="card-text">sold:{{totalSold  }}</p>
                            <p class="card-text">died:{{ totalDied }}</p>
                            
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-12">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title text-primary text-uppercase text-underline">location</h5>
                            <p class="card-text">chelemi:{{ totalChelemei }}</p>
                            <p class="card-text">kipsingei:{{  totalKipsingei }}</p>
                            <p class="card-text">kamongil:{{  totalKamongil}}</p>
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
import { useAnimalsStore } from '../../stores/animalsStore';


export default {
    name: 'DashBoardDetails',
    components: { BarChart },

    setup() {
        const animalStore = useAnimalsStore ();
        
       

        // Fetch data on component mount
        onMounted(async () => {
            await animalStore.fetchAllAnimals();
            
        
        });

        watch(() =>  animalStore.totalAnimals, (newValue) => {
            console.log('Total animals changed:', newValue);
        });
//type
        const totalAnimals = computed(() => animalStore.totalAnimals);
        const totalGoats = computed(() => animalStore.totalGoats);
        const totalCows = computed(() => animalStore.totalCows);
        const totalSheep = computed(() => animalStore.totalSheep);
        //location
        const totalChelemei=computed(()=>animalStore.totalChelemei)
        const totalKipsingei=computed(()=>animalStore.totalKipsingei)
        const totalKamongil=computed(()=>animalStore.totalKamongil)
        //status
        const totalAvailable=computed(()=>animalStore.totalAvailable)
        const totalDied=computed(()=>animalStore.totalDied)
        const totalSold=computed(()=>animalStore.totalSold)
        return {
            totalAnimals,totalGoats,totalSheep,totalCows,
            totalChelemei,totalKamongil,totalKipsingei,
            totalSold,totalDied,totalAvailable
        };
    },
};
</script>



