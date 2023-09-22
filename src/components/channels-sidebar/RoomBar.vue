<template>
    <div class="relative">
        <!-- Room Settings and Name -->
        <div @click="toggle()" class=" p-3  px-6  h-12 top-0 bg-secondary  font-bold  
                    border-b-2 border-dark text-slate-300 hover:bg-hovercolor cursor-pointer">
            {{selected_room_data?.room_name}}
        </div>
        <Transition name="bounce">
        <div @focusout="focusOut" ref="roomPopup" tabindex="0" v-if="show == true"
            class="ml-2 absolute outline-none p-2  bottom-[-100px] h-24 w-full bg-dark rounded-md drop-shadow-xl">
            <div @click="openInvitePopup()" class="text-md p-2 font-medium text-gray-300 cursor-pointer hover:bg-hovercolor rounded-md">
                Invite People
            </div>
            <div @click="openLeaveRoomPopup()" class="text-md p-2 font-medium text-gray-300 cursor-pointer hover:bg-red-500 rounded-md">
                Leave Room
            </div>
        </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import useGlobalStore from '../../composables/useGlobalStore';

const { showInvitePopup, showLeaveRoomPopup, selected_room_data } = useGlobalStore()

const openInvitePopup = () => {
    showInvitePopup.value = true;
    focusOut()
}


const openLeaveRoomPopup = () => {
    showLeaveRoomPopup.value = true;
    focusOut()
}

// Open and close the room popup
const show = ref(false)
const roomPopup = ref<HTMLElement>()
const semaphore = ref(false)

const toggle = () => {

    if (semaphore.value == true) {
        semaphore.value = false
        return
    }
    if (show.value == false && semaphore.value == false) {
        show.value = true
        semaphore.value = true
        setTimeout(() => {
            roomPopup.value?.focus()
        }, 50);
    }
}


const focusOut = () => {
    if (show.value == true) {
        semaphore.value = true
    }
    show.value = false
    setTimeout(() => {
        semaphore.value = false
    }, 100);
}



</script>

<style scoped>

</style>