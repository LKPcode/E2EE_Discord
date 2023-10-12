<template>
    <div class="w-72 h-screen flex flex-col bg-primary ">

        <!-- Room Bar -->
        <RoomBar />

        <!-- Channels List -->
        <div class="flex-1 bg-secondary text-slate-400 overflow-auto overflow-x-clip scrollbar-custom">

            <div  v-if="selected_room_id != null">

           
            <div class="p-3 font-bold text-sm uppercase">
                <span>Text Channels </span>
                <span @click="showCreateChannelPopup = true"
                    class="float-right py-1 px-2 text-xs text-hovercolor cursor-pointer rounded-md hover:bg-dark"> ADD
                </span>
            </div>
            <div class="mx-4">
                <div    
                        @click="selectChannel(channel)" 
                        v-for="channel in selected_room_channels"
                        :key="channel.channel_id"
                        class="p-2 font-bold text-md text-gray-100 hover:bg-dark rounded-md cursor-pointer"
                        :class="{'bg-dark': channel.channel_id == selected_channel_id}">
                        <span class="text-gray-500 text-xl mr-1">#</span>
                         {{ channel.channel_name }} 
                </div>
            </div>

            <!-- <div v-if="selected_room_id != null" class="p-3 font-bold text-sm uppercase">
                <span>Voice Channels </span>
                <span @click="showCreateChannelPopup = true"
                    class="float-right py-1 px-2 text-xs text-hovercolor cursor-pointer rounded-md hover:bg-dark"> ADD
                </span>
            </div> -->
            <div class="mx-4">
                <!-- <div class="p-2 font-bold text-md text-gray-100 hover:bg-hovercolor rounded-md cursor-pointer">   Channel </div>
            <div class="p-2 font-bold text-md text-gray-100 hover:bg-hovercolor rounded-md cursor-pointer">   Channel </div> -->
            </div>
        </div>
        </div>

        <AccountBar />

    </div>
</template>

<script lang="ts" setup>
import RoomBar from './RoomBar.vue';
import AccountBar from './AccountBar.vue';

import { Channel } from '../../types';

import useGlobalStore from '../../composables/useGlobalStore';
import useChannelInteraction from '../../composables/interactions/channel_interaction';

const { loadSelectedChannelInteraction } = useChannelInteraction()

import { useRouter } from 'vue-router';

const { selected_room_data, 
        selected_room_channels,
        selected_room_id, 
        selected_channel_id,
        showCreateChannelPopup
            } = useGlobalStore()



const router = useRouter()
const selectChannel = (channel:Channel) => {
    console.log("select channel", channel.channel_id)
    router.push({ name: 'Room', params: { 
        room_id:  selected_room_id.value,
        channel_id: channel.channel_id } 
    })
}


</script>