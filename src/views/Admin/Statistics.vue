<template>
    <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useAnimalStore } from '../../stores/coursesStore';


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
    name: 'BarChart',
    components: { Bar },
    setup() {
        const courseStore = useAnimalStore();
        const messageStore = useMessageStore();
        
     

        // Fetch data on component mount
        onMounted(async () => {
            await courseStore.fetchAllCourses();
           v
           
           
        });

        const totalCourses = computed(() => courseStore.totalCourses);
       
        
   

        const chartData = ref({
            labels: ['Total', 'Cows', 'sheep'],
            datasets: [
                {
                    label: 'Total Count',
                    backgroundColor: ['#f87979', '#5b9bd5', '#70ad47', '#5b9bd5'], // Different colors for each bar
                    data: [totalCourses.value, totalBlogs.value, totalMessages.value],
                },
            ],
        });

        // Watchers for store changes
        watch(
            [totalCourses, totalMessages, totalBlogs],
            ([newTotalCourses, newTotalMessages, newTotalBlogs]) => {
                console.log('Total courses changed:', newTotalCourses);
                console.log('Total messages changed:', newTotalMessages);
                console.log('Total blogs changed:', newTotalBlogs);
             

                // Update the chart data when any of the totals change
                chartData.value.datasets[0].data = [
                    newTotalCourses,
                    newTotalBlogs,
                    newTotalMessages,
                  
                ];
            }
        );

        return {
            totalCourses,
            totalMessages,
            totalBlogs,
            chartData,
           
        };
    },
};
</script>
