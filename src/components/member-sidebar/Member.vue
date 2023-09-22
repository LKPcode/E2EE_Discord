<template>
    <div ref="member_item" @click="selected()" class="p-2 flex relative justify-center align-middle items-center hover:bg-dark rounded-md cursor-pointer">
        <div class="relative">
            <img class="rounded-full w-8 h-8 bg-white" 
            :src="getAvatar(member.publicKey)"
                alt="avatar"
            >
            <!-- <div class="absolute right-0 bottom-0  w-3 h-3 rounded-full  bg-green-500"></div> -->
        </div>
        <div class="ml-3  flex-1">
            <div> 
                <span v-if="isSelf()" class="text-lg font-bold text-green-500">{{ member.username}}</span>     
                <span v-else class="text-lg font-bold text-gray-100">{{ member.username}}</span>     
                <span class="text-sm ml-1">{{ shortenString(member.publicKey, 3) }}</span> 
            </div>
        </div>  
    </div>

    <Transition name="bounce">
        <MemberPopup ref="memberPopup" tabindex="0" @focusout="focusOut()" v-if="showMemberPopup==true" :top="top" :member="member"  />
    </Transition>

</template>

<script lang="ts" setup>
import useGlobalStore from '../../composables/useGlobalStore';
import MemberPopup from './MemberPopup.vue';
import useStorage from '../../composables/useStorage';
import { onMounted, ref } from 'vue'

// Accept props
const { member } = defineProps(['member'])

// Global Store
const { shortenString, getAvatar } = useGlobalStore()

// Local Storage
const { storage } = useStorage()



let showMemberPopup = ref(false)
let top = ref<number|undefined>(0)
const member_item = ref<HTMLElement>()
let semaphore = ref(false)





const selected = () => {
    top.value = member_item.value?.getBoundingClientRect().top
    
    if (semaphore.value == true) {
        semaphore.value = false
        return
    }
    if (showMemberPopup.value == false && semaphore.value == false) {
        showMemberPopup.value = true
        semaphore.value = true
        
    } 
}


const focusOut = () => {
    if (showMemberPopup.value == true) {
        semaphore.value = true
    }
    showMemberPopup.value = false
    setTimeout(() => {
        semaphore.value = false
    }, 100);
}


const isSelf = () => {
    if (member.publicKey == storage.value.personal_public_key) {
        return true
    }
    return false
}

</script>