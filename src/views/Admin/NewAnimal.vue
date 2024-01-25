<template>
    <div class="container mb-2">
        <div class="row justify-content-center">
            <div class="col-md-6 text-primary font-weight-bold text-center text-uppercase">
                <h6>Add Animal to list here</h6>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card mt-2 border-primary">
                    <!-- <form @submit.prevent="add" class="p-4"> -->
                    <form @submit.prevent class="p-4">
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
                            <input type="text" v-model="animal_form.description" class="form-control" id="description">
                        </div>

                        <div class="mb-3">
                            <label for="image" class="form-label">Image</label>
                            <input type="file" @change="handleImageChange" class="form-control" id="image">

                        </div>
                        <div class="mb-3">
                            <label for="image" class="form-label">Image Preview</label>
                            <img :src="animal_form.imagePreview" alt="animal image" class="img-thumbnail"
                                style="width: 10rem; height: 8rem;">
                        </div>
                        <div class="mb-3">
                            <label for="date" class="form-label">Date</label>
                            <input type="date" v-model="animal_form.date" class="form-control" id="date">
                        </div>
                        <div class="align-items-center">
                            <button class="btn btn-primary text-center" type="submit" :disabled="isAdding" @click="add">
                                <span v-if="!isAdding && !isAdded">ADD NEW</span>
                                <span v-else-if="isAdding">Adding ...</span>
                                <div v-else>
                                    <span class="text-success">Successfully Added!</span>
                                    <i class="fas fa-check-circle"></i>
                                </div>
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
import { ref, computed } from 'vue';
import { useAnimalsStore } from '../../stores/animalsStore';

export default {
  setup() {
    const animalstore = useAnimalsStore();
    const animal_form = ref({
      type: 'cow',
      owner: '',
      status: '',
      location: '',
      description: '',
      image: null,
      date: '',
    });
    const isAdding = ref(false);
    const isAdded = ref(false);

    const add = async () => {
      try {
        isAdding.value = true;
        // Pass the animal_form data to the add action
        await animalstore.addAnimal({
          type: animal_form.value.type,
          owner: animal_form.value.owner,
          location: animal_form.value.location,
          status: animal_form.value.status,
          description: animal_form.value.description,
          date: animal_form.value.date,
          image: animal_form.value.image,
        });
        console.log('Animal added successfully');
        isAdded.value = true; // Set the success flag
      } catch (error) {
        console.error(error.message);
      } finally {
        isAdding.value = false;
      }
    };

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        animal_form.value.image = file;
        animal_form.value.imagePreview = URL.createObjectURL(file);
      }
    };

    // Computed property to format the date
    const formattedDate = computed(() => {
      const dateObject = new Date(animal_form.value.date);
      const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
      return dateObject.toLocaleDateString('en-US', options);
    });

    return {
      animal_form,
      add,
      handleImageChange,
      isAdding,
      isAdded,
      formattedDate,
    };
  },
};
</script>


<style scoped>
/* Add your styles for the tick icon and green background here */
.text-success {
  color: green;
}
</style>
