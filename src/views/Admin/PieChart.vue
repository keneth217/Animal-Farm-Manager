<template>
    <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script>
import { ref, computed, onMounted } from 'vue';

import { useStore } from 'vuex';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: 'BarChart',
    components: { Bar },
    setup() {
        const store = useStore();

        // Define reactive data
        const chartOptions = ref({
            responsive: true,
            // Add other chart options as needed
        });

        // Fetch and sort animals on component mount
        onMounted(() => {
            store.dispatch('fetchAllAnimals');
        });

        // Define computed property for chart data
        const chartData = computed(() => {
            const locationOrder = { chelemei: 1, kipsingei: 2, kamongil: 3 };

            // Access data from Vuex store and filter based on location
            const animals = store.state.animals || [];

            const labels = Object.keys(locationOrder);

            const datasets = [
                {
                    label: 'Animal Count',
                    data: labels.map(location => {



                        return animals.filter(animal => animal.location === location).length;
                    }),
                    // Customize colors for each location
                    backgroundColor: [
                        'rgba(101, 0, 115, 1)', // Total
                        ' rgba(0, 0, 115, 1)', // Available
                        'rgba(255, 0, 115, 1)', // Sold

                    ],
                },
            ];

            return {
                labels,
                datasets,
            };
        });

        // Return the reactive properties and computed values
        return {
            chartOptions,
            chartData,
        };
    },
};
</script>
