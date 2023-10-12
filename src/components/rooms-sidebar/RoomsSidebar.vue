<template><!-- Rooms Sidebar -->
    <div class="w-20 h-screen bg-dark flex flex-col">
        <!-- Direct Messages -->

         <!-- Add Room Button -->
         <div class="w-20 h-20 flex justify-center items-center ">
            <div class="w-14 h-14 bg-primary flex justify-center items-center cursor-pointer rounded-3xl 
                transition-all duration-200 ease-linear hover:rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </div>
        </div>

        <div class="w-3/5 mb-3 m-auto rounded-full border border-slate-600"></div>
            <!-- Rooms List -->
        <div class=" flex-1 w-20 overflow-y-auto overflow-x-clip ">
            <!-- Room Item -->
            <RoomButton v-for="room in storage.rooms" :selected="room.room_id==selected_room_id" :key="room.room_id" :room="room" />
           
            <InvitationButton v-for="(invitation, index) in invitations_list" 
                            :key="index" 
                            :index="index" 
                            :invitation="invitation" 
                            @removeInvitation="removeInvitation"
                            />
            
        </div>
        <div class="w-3/5 mt-3 m-auto rounded-full border border-slate-600"></div>
        
        <!-- Add Room Button -->
        <div @click="showCreateRoomPopup = true" class="w-full h-20 flex flex-col justify-center items-center ">
            <div class="w-14 h-14 bg-green-500 flex justify-center items-center cursor-pointer rounded-3xl 
                transition-all duration-200 ease-linear hover:rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </div>
        </div>


    </div>
</template>

<script lang="ts" setup>
import RoomButton from './RoomButton.vue'
import InvitationButton from './InvitationButton.vue';

import useGlobalStore from '../../composables/useGlobalStore';
import useStorage from '../../composables/useStorage';
import useInvitations from '../../composables/requests/invitations';

import { ref, onMounted } from 'vue'

const { showCreateRoomPopup, invitations_list, selected_room_id } = useGlobalStore()
const { storage } = useStorage()
const { getInvitations } = useInvitations()



onMounted(() => {
    getInvitationsFunc()
})

const removeInvitation = (index:number) => {
    invitations_list.value.splice(index, 1)
}

const getInvitationsFunc = () => {
    console.log("Asking for invitations")
    getInvitations(storage.value.personal_public_key)
        .then((res) => {
            console.log("Success Getting Invitations for pk:" + storage.value.personal_public_key , res);
            invitations_list.value = res
        }).catch((err) => {
            console.log("Error Getting Invitations", err);
        })
}


</script>