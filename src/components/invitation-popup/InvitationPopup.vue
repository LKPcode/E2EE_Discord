<template>
    <div class="absolute w-full h-full ">
        <div @click="closeInvitePopup()" class="bg-dark/30 absolute w-full h-full  backdrop-blur-sm" ></div>
   

    <div class="absolute flex flex-col p-3  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[600px]
                     bg-dark rounded-md">
        <div class=" p-2 flex  align-middle items-center text-gray-300 text-lg">
            <span>Invite Friends to </span>
            <span class="font-bold ml-2"> Anon Group </span>
            <span class="flex-1"></span>
            <span @click="closeInvitePopup()" class="p-2 cursor-pointer"> X </span>
        </div>

        <input v-model="publicKeyOfUser" class="py-2 px-3 rounded-md outline-none bg-primary text-gray-300" placeholder="Enter Public Address" type="text">
        <button @click="inviteUser" class="py-2 px-3 mt-3 rounded-md bg-hovercolor hover:bg-green-700 text-gray-300 font-bold">Invite User</button>

        <div class="flex-1 mt-3 overflow-auto scrollbar-custom">
            <!-- Friend -->
            <div v-for="member in [1,2,3,4,5,6,7,8]" class="p-2 group  flex justify-center align-middle items-center hover:bg-primary rounded-md cursor-pointer">
                <div class="relative">
                    <img class="rounded-full bg-gray-300" src="../../assets/vue.svg" alt="">
                    <div class="absolute right-0 bottom-0  w-3 h-3 rounded-full  bg-green-500"></div>
                </div>
                <div class="ml-3  flex-1">
                    <div> <span class="text-lg font-bold text-gray-300">Deleted</span> <span
                            class="text-sm text-gray-400">8fe...9a3</span> </div>

                </div>
                <div class="py-1 px-3 border border-1 border-green-600 text-gray-300 group-hover:bg-hovercolor rounded-md">
                    Invite
                </div>

            </div>

        </div>

        <div class="text-sm pt-2 text-gray-400 text-center">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur alias quam eligendi, a fugit quibusdam natus
            enim eos iure. Labore veniam accusantium, dolor sint minus culpa velit consequuntur quibusdam optio?
        </div>
    </div>

</div>
</template>

<script lang="ts" setup>
import useGlobalStore from '../../composables/useGlobalStore';
import useInvitationInteraction from '../../composables/interactions/invitation_interaction';

import {ref} from 'vue'


const { showInvitePopup } = useGlobalStore()
const { createInvitationInteraction } = useInvitationInteraction()

const closeInvitePopup = () => {
    showInvitePopup.value = false;
}

const publicKeyOfUser = ref('')

const inviteUser = () => {
    createInvitationInteraction(publicKeyOfUser.value)
        .then((res) => {
            closeInvitePopup()
        })

}

</script>


