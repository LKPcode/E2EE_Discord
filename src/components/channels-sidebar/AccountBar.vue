<template>
    <!-- Account Settings -->
    <div  class="p-2 w-full relative top-0 bg-dark font-bold  text-slate-400 cursor-pointer">
        <div @click="toggle()"  class="p-2 flex justify-center align-middle rounded-md hover:bg-hovercolor ">
            <img class="rounded-full h-12 w-12 bg-white" 
                :src="getAvatar(storage.personal_public_key)"
                alt="Avatar">
            <div class="ml-3  flex-1">
                <div v-if="selected_room_members_obj[storage.personal_public_key]!=null" class="text-gray-300" >{{ selected_room_members_obj[storage.personal_public_key]?.username }}</div>
                <div v-else class="text-gray-300" >{{ storage.username }}</div>
                <span @click="copyAddress()" class=" text-sm text-gray-400 cursor-pointer hover:underline"> {{ shortenString(storage.personal_public_key, 3 ) }} </span>


            </div>
        </div>
        <Transition name="bounce">
        <div
            @focusout="focusOut"
            ref="accountPopup"
            tabindex="0" 
            v-if="show==true"
            class="absolute outline-none  top-[-150px]  w-[300px] bg-dark rounded-md">
            <div class="relative p-2 h-full w-full flex flex-col">
                <div class="absolute -m-2 w-full h-14 bg-hovercolor rounded-t-md"></div>
                <div class="z-10 mt-4 flex justify-start items-center align-middle">
                <img class="rounded-full ml-6  h-16 w-16  bg-white"
                        :src="getAvatar(storage.personal_public_key)" alt="avatar">

                    <div class="ml-4">
                        <div v-if="selected_room_members_obj[storage.personal_public_key]" class="mb-1 font-bold text-lg text-gray-100"> {{ selected_room_members_obj[storage.personal_public_key]?.username }}   </div>
                        <div v-else class="mb-1 font-bold text-lg text-gray-100"> {{ storage.username }}   </div>

                        <div class="text-sm text-gray-400 cursor-pointer hover:underline">
                            {{ shortenString(storage.personal_public_key, 8) }}
                        </div> 
                    </div>  
                </div>

               
                <div @click="openSettings()" class="text-md p-2 mt-2  font-bold  text-gray-300 cursor-pointer hover:bg-blue-500 rounded-md">
                    Settings
                </div>

            </div>
        </div>
        </Transition>

    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import useStorage from '../../composables/useStorage';
import useGlobalStore from '../../composables/useGlobalStore';

const show = ref(false)
const accountPopup = ref<HTMLElement>()
const semaphore = ref(false)

// Toggle Account Popup
const toggle = () => {
    
    if (semaphore.value == true){
        semaphore.value = false
       return
    }
    if(show.value == false && semaphore.value == false){
        show.value = true
        semaphore.value = true
        setTimeout(() => {
                accountPopup.value?.focus()
            }, 50);
    }
}
const focusOut = () => {
    if(show.value == true){
       semaphore.value = true
    }
    show.value = false
    setTimeout(() => {
        semaphore.value = false
            }, 100);
}   

// managing state
const { storage } = useStorage()
const { shortenString, 
        selected_room_members_obj, 
        showSettingsPopup,
        getAvatar } = useGlobalStore()


const copyAddress = () => {
    navigator.clipboard.writeText(storage.value.personal_public_key)
    console.log("copied address")
}

const openSettings = () => {
    console.log("open settings")
    showSettingsPopup.value = true

}



</script>