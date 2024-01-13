<template>
    <div class="container mb-2">
        <div class="row justify-content-center">
            <div class="col-md-6 text-primary font-weight-bold text-center text-uppercase">
                <h6>Add new blog</h6>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card mt-2 border-primary">
                    <!-- <form @submit.prevent="add" class="p-4"> -->
                    <form @submit.prevent class="p-4">

                        <div class="mb-3">
                            <label for="title" class="form-label">title</label>
                            <input type="text" v-model="blog.title" class="form-control" id="title">
                        </div>
                        <div class="mb-3">
                            <label for="subject" class="form-label">subject</label>
                            <input type="text" v-model="blog.subject" class="form-control" id="subject">
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <input type="text" v-model="blog.description" class="form-control" id="description">
                        </div>



                        <div class="align-items-center">
                            <button class="btn btn-primary text-center" type="submit" :disabled="isPosting" @click="add">
                                <span v-if="!isPosting">ADD NEW BLOG</span>
                                <span v-else>Posting ...</span>
                                <div v-if="isPosting" class="spinner-border text-warning" role="status">
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
import { ref } from 'vue';
import { useBlogStore } from '../../stores/blogStore';

export default {
    setup() {
        const blogStore = useBlogStore()
        const blog = ref({

            title: '',
            subject: '',
            description: '',

        });
        const isPosting = ref(false);
        const add = async () => {
            try {
                isPosting.value = true;

                await blogStore.addBlog({

                    title: blog.value.title,
                    subject: blog.value.subject,
                    description: blog.value.description,
                })
                console.log('blog added succesfully')
            } catch (error) {
                console.log(error.message)
            } finally {
                isPosting.value = false;
            }
        }
        return {
            blog,
            add,
            isPosting
        };
    },
};
</script>