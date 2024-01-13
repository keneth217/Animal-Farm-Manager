<template>
    <section class="min-vh-100 d-flex">
        <div class="container-fluid text-center">
            <div class="row align-items-center">
                <div class="col-md-6 fs-1 font-weight-bold text-dark text-center text-uppercase">
                    <!-- <h6>new message </h6>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {{ totalMessages }}
                        <span class="visually-hidden">unread messages</span>
                    </span> -->
                    <button type="button" class="btn btn-primary mb-3 position-relative">
                        New messages
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {{ totalMessages }}
                            <span class="visually-hidden">unread messages</span>
                        </span>
                    </button>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col">
                    <div class="text-center justify-content-center" v-if="messages.length === 0">
                        <p class="align-items-center text-white">No messages</p>
                    </div>
                    <div v-for="message in messages" :key="message.id">
                        <div class="accordion mb-3" id="accordionExample">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        {{ message.name }}
                                    </button>
                                </h2>
                                <div id="collapseOne" class="accordion-collapse collapse show"
                                    data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        <div class="toast-header">
                                            <p class="me-auto">{{ message.subject }}</p>
                                            <p>{{ message.date }}</p>
                                        </div>
                                        <hr>
                                        <div class="toast-body"> {{ message.information }}</div>
                                        <div>
                                            <div class="justify-content-end">
                                                <button @click="deleteOne(message.id)" class="btn btn-danger">
                                                    Delete message
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import { useMessageStore } from '../../stores/contactsStore';

export default {
    setup() {
        const messages = ref([]);
        const position = 0;

        const messageStore = useMessageStore();
        // const total = messageStore.totalMessages
        const totalMessages = computed(() => messageStore.totalMessages);
        console.log(totalMessages)
        // Watcher for totalMessages
        watch(totalMessages, (newValue) => {
            console.log('Total Messages changed:', newValue);
        });

        const fetchAllMessages = async () => {
            await messageStore.fetchAllMessages();
            messages.value = messageStore.messages;
        };

        const deleteOne = async (messageId) => {
            try {
                await messageStore.deleteMessage(messageId);
                console.log('Message deleted successfully');
            } catch (error) {
                console.error('Error deleting message: ', error);
            }
        };

        onMounted(() => {
            fetchAllMessages();
            console.log(totalMessages.value);
        });

        // Watch messages for changes and check for messages older than 5 days
        watch(messages, (newMessages) => {
            const currentDate = new Date();
            const fiveDaysAgo = new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000);

            newMessages.forEach((message) => {
                const messageDate = new Date(message.date);
                if (messageDate < fiveDaysAgo) {
                    // Automatically delete messages older than 5 days
                    deleteOne(message.id);
                }
            });
        });

        return {
            messages,
            deleteOne,
            totalMessages
        };
    },
};
</script>
