<template>

    <div class="text-center text-gray-400 h-full flex justify-center items-center  bg-primary text-md " 
        v-if="selected_channel_id === null && selected_room_id !== null">
       <span>Select a channel to start chatting.</span> 
    </div>

    <div v-if="selected_channel_content==null"
    class="text-center text-gray-400 h-full flex justify-center items-center  bg-primary text-md">
        <span> Loading... </span>
    </div>
    <div class="text-center text-gray-400 h-full flex justify-center items-center  bg-primary text-md"
        v-else-if="selected_channel_content.length == 0 && selected_channel_id !== null"> 
        <span>  This Channel is empty, be the first one
        to send a message.</span>
      
    </div>

    <div class="flex-1 bg-primary overflow-auto scrollbar-custom flex flex-col-reverse">
        <div id="chat-window" class="bg-primary     text-white ">
            <Message v-for="message in selected_channel_content" :message="message" />
        </div>
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

</script>