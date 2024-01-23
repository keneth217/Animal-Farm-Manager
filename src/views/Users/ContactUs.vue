<template>
    <section class="min-vh-100 d-flex align-items-center text-center background">
        <div class="container-fluid mb-3" style="background-color: rgba(0, 0, 0, 0.6);">
            <div class="row mt-5 ">
                <div class="col">
                    <p class="fs-1 text-primary text-center">
                        Contact Us
                    </p>
                </div>
            </div>
            <div class="row justify-content-center" >
                <div class="col-lg-8 col-md-6 col-sm-12 " >
                    <p class="fs-1 text-center text-dark">
                        Contacts
                    </p>
                    <div class="text-center">
                        <p class="text-uppercase">
                            <i class="bi bi-geo-alt me-3 text-warning"></i>
                            <span class="text-primary">Address :</span>
                        </p>
                        <p class="text-white">P.O Box - 2500 ,Nakuru</p>
                    </div>
                    <div class="text-center">
                        <p class="text-uppercase"> <i class="bi bi-telephone me-3 text-warning"></i>
                            <span class="text-primary">Phone:</span>
                        </p>
                        <p class="text-white">+254711766223</p>
                    </div>
                    <div class="text-center">
                        <p class="text-uppercase"> <i class="bi bi-envelope-at me-3 text-warning"></i>
                            <span class="text-primary">Email:</span>
                        </p>


                        <p class="text-white">kenwavessolutions@gmail.com</p>
                    </div>
                    <div class="text-center">
                        <p class="text-uppercase"> <i class="bi bi-globe me-3 text-warning"></i>
                            <span class="text-primary"> WEBSITE</span>
                        </p>

                        <p class="text-white">kipyegonkeneth.vercel.app</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12 col-sm-12 ">
                    <div class="card border-primary ">
                        <div class="text-center">
                            <p class="fs-3 mt-2 text-primary">Get In Touch</p>
                            <form @submit.prevent class="p-4">
                                <div class="mb-3">
                                    <label class="form-label">Name</label>
                                    <input type="text" v-model="contact.name" class="form-control" id="name"
                                        placeholder="Enter Your Name">
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email</label>
                                    <input type="email" v-model="contact.email" class="form-control" id="email"
                                    placeholder="Enter Your Email">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Subject</label>
                                    <input type="text" v-model="contact.subject" class="form-control" id="subject"
                                        placeholder="Enter Your Subject">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">message</label>
                                    <textarea v-model="contact.information" class="form-control" id="message"
                                    placeholder="Enter Your Message"  rows="3"></textarea>
                                </div>
                                <div class="align-items-center">
                                    <button class="btn btn-primary text-center" type="submit" :disabled="isSubmitting"
                                        @click="sent">
                                        <span v-if="!isSubmitting">SENT MESSAGE</span>
                                        <span v-else>Sending ...</span>
                                        <div v-if="isSubmitting" class="spinner-border text-warning" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { ref } from 'vue';
import { useMessageStore } from '../../stores/contactsStore';

export default {
    setup() {
        const messageStore = useMessageStore()
        const contact = ref({
            name: '',
            email: '',
            subject: '',
            information: ''
            // date: Date.Now()
        });
        const isSubmitting = ref(false);
        const sent = async () => {
            try {
                isSubmitting.value = true;
                // Pass the contact data to the sent action
                await messageStore.addMessage({
                    name: contact.value.name,
                    email: contact.value.email,
                    subject: contact.value.subject,
                    information: contact.value.information,
                    // date: contact.value.date,
                })
                console.log('message sent succesfully')
            } catch (error) {
                console.log(error.message)
            } finally {
                isSubmitting.value = false;
            }
        }
        return {
            contact,
            sent,
            isSubmitting
        };
    },
};
</script>
<style scoped>
.background {

    background: url(../../assets/animals/IMG_20211211_084403_7.jpg);
    width: 100%;
    height: 100%;
    min-height: 100vh;
    text-align: center;
    display: flex;
    background-attachment: fixed;

    background-position: center center;
    background-size: cover;
    opacity: 1;


}
</style>