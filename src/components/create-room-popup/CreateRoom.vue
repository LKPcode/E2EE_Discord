<template>
    <div class="absolute w-full h-full ">
        <div @click="closeCreateRoomPopup()" class="bg-dark/30 absolute w-full h-full  backdrop-blur-sm" ></div>
   

    <div class="absolute flex flex-col p-3  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px]
                     bg-dark rounded-md">
        <div class=" p-2 flex  align-middle items-center text-gray-300 text-lg">
            <span class="font-bold ml-2"> Create Room </span>
            <span class="flex-1"></span>
            <span @click="closeCreateRoomPopup()" class="p-2 cursor-pointer"> X </span>
        </div>

        <input v-model="room_name" class="py-2 px-3 rounded-md outline-none bg-primary text-gray-300" placeholder="Enter Room Name" type="text">

        <button @click.once="createRoomFunc(room_name)" class="py-2 px-3 mt-3 rounded-md bg-hovercolor hover:bg-green-700 text-gray-300 font-bold">Create Room</button>

        

        <div class="text-sm pt-2 text-gray-400 text-center">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur alias quam eligendi, a fugit quibusdam natus
            enim eos iure. Labore veniam accusantium, dolor sint minus culpa velit consequuntur quibusdam optio?
        </div>
    </div>

</div>
</template>

<script lang="ts" setup>
import useGlobalStore from '../../composables/useGlobalStore';
import useRoomInteraction from '../../composables/interactions/room_interaction';
import useBlockchainInteraction from '../../composables/interactions/blockchain_interaction';

import useStorage from '../../composables/useStorage';
import { toast } from 'vue-sonner'
import {ref} from 'vue'

// local state
const room_name = ref('')


const { showCreateRoomPopup } = useGlobalStore()
const { createRoomInteraction } = useRoomInteraction()
const { addMemberInteraction, createBlockchainCollectionInteraction,  updateMembersList } = useBlockchainInteraction()
const { storage } = useStorage()

const closeCreateRoomPopup = () => {
    showCreateRoomPopup.value = false;
}


const createRoomFunc = async (room_name:string) => {
   createRoomInteraction(room_name, storage.value.username)
        .then(() => {
            closeCreateRoomPopup()
            toast.success(`Room "${room_name}" has been created`)
        })
        .catch((err) => {
            toast.error(err)
        })
}

</script>