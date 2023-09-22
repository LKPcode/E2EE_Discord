<template>
    <div id="chat-window" class="bg-primary  overflow-auto scrollbar-custom flex-1 text-white ">
        
        <div class="text-center text-gray-400 text-xl mt-10" 
            v-if="selected_channel_id === null && selected_room_id!==null"> Select a channel to start chatting.
        </div>
        <div class="text-center text-gray-400 text-xl mt-10" 
            v-if="selected_channel_content.length == 0 && selected_channel_id !== null"> This Channel is empty, be the first one to send a message. 
        </div>
        <Message v-for="message in selected_channel_content" :message="message" />
        <!-- {{ selected_channel_content  }} -->
         <!--<br>
        ROOM ID:{{ selected_room_id }}
        <br>
        CHANNEL ID:{{ selected_channel_id }} -->
    </div>
</template>

<script lang="ts" setup>
import Message from './Message.vue';
import { ref, onMounted, watch } from 'vue'

import useGlobalStore from '../../composables/useGlobalStore';

const { selected_channel_content, 
        selected_room_id, 
        selected_channel_id,
     } = useGlobalStore()

watch(selected_channel_content, (val) => {
    console.log("Scrolling to bottom")

    setTimeout(() => {
        const chat_window = document.getElementById("chat-window")
        console.log(chat_window)
        if (chat_window) {
            chat_window.scrollTop = chat_window.scrollHeight
        }
    }, 100)
    
}, { deep: true })


onMounted(async () => {
    
   
    
})

</script>