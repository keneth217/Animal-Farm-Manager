<template>
    <section class="min-vh-100 d-flex bg-dark text-white">
        <div class="container-fluid mt-5">
            <div class="row align-items-center">
                <div class="row justify-content-center p-2">
                    <div class="col-md-6 text-primary font-weight-bold text-center text-uppercase">
                        <h6>animal details</h6>
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
                    <div class="row mt-3  p-3">
                        <div class="col-lg-12 col-md-12">
                            <div class="col mt-3  font-weight-bold  ">
                                <p>Updated on {{ animal.date }} </p>
                            </div>
                            <div class="col mt-3  font-weight-bold  ">
                                <h3>{{ animal.owner }} </h3>
                            </div>
                            <div class="col mt-3 mx-auto ">
                                <img :src="animal.image" class="card-img-top " alt="...">
                            </div>

                            <div class="col mt-3  font-weight-bold text-primary text-decoration-underline ">
                                <p>{{ animal.location }} </p>
                            </div>
                            <div class="col mt-3  font-weight-bold text-primary text-decoration-underline ">
                                <p>{{ animal.status}} </p>
                            </div>
                            <div class="col mt-3 ">
                                <p>{{ animal.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
            </div>
        </div>
        <hr>
    </section>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useAnimalsStore } from '../../stores/animalsStore';

export default {
    setup() {
        const route = useRoute();
        const loading = ref(true);
        const animal = ref({});
        const singleAnimal = useAnimalsStore();
        const isDeleting = ref(false);

        const fetchAnimal = async (animalId) => {
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
        const deleteAnimal = async () => {
            try {
                isDeleting.value = true;
                // const result = await Swal.fire({
                //     title: 'Are you sure?',
                //     text: 'You will not be able to recover this animal!',
                //     icon: 'warning',
                //     showCancelButton: true,
                //     confirmButtonColor: '#d33',
                //     cancelButtonColor: '#3085d6',
                //     confirmButtonText: 'Yes, delete it!',
                // });

                // if (result.isConfirmed) {
                //     const animalId = route.params.id;
                //     await singleanimal.deleteanimal(animalId);
                //     Swal.fire({
                //         icon: 'success',
                //         title: 'animal deleted successfully!',
                //         showConfirmButton: false,
                //         timer: 1500,
                //     });
                // }
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
            const animalOwner = route.params.owner;
            console.log('animal ID:', animalId);
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
<style scoped>
.card-img-top {
    width: 20% !important;
    height: 20% !important;
    text-align: center;
    display: flex;
    background-position: center;

}
</style>