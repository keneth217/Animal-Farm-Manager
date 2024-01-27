<template>
    <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useAnimalsStore} from '../../stores/animalsStore';


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
    name: 'BarChart',
    components: { Bar },
    setup() {
        const animalStore= useAnimalsStore();
       
        
     

        // Fetch data on component mount
        onMounted(async () => {
            await animalStore.fetchAllAnimals();
           
           
           
        });

        const totalAnimals= computed(() => animalStore.totalAnimals);
       const totalGoats=computed(()=> animalStore.totalGoats)
       const totalCows=computed(()=> animalStore.totalCows)
       const totalSheep=computed(()=> animalStore.totalSheep)
        
   

        const chartData = ref({
            labels: ['Total', 'Goats','Cows', 'sheep',],
            datasets: [
                {
                    label: 'Total Count',
                    backgroundColor: ['#f87979', '#5b9bd5', '#70ad47', '#5b9bd5'], // Different colors for each bar
                    data: [totalAnimals.value,totalGoats.value,totalCows.value,totalSheep.value],
                },
            ],
        });

        // Watchers for store changes
        watch(
            [totalAnimals,totalGoats,totalSheep,totalCows],
            ([newTotalAnimals]) => {
                console.log('Total animalschanged:', newTotalAnimals);
                

                // Update the chart data when any of the totals change
                chartData.value.datasets[0].data = [
                    newTotalAnimals,totalGoats,totalCows,totalSheep,
                    
                  
                ];
            }
        );

        return {
            totalAnimals,
            totalGoats,
            totalCows,
            totalSheep,
            chartData,
           
        };
    },
};
</script>
