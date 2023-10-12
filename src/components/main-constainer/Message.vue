<template>

     <div class="flex p-4 ">
            <img class="w-12 h-12 rounded-full bg-gray-100" 
            :src="getAvatar(message.sender)"
            alt="avatar"
            >
            <div class="ml-3">
                <div class="font-bold text-md text-gray-300">
                    {{ selected_room_members_obj[message.sender]?.username }}
                    <span class="text-xs text-gray-500"> {{ shortenString(message.sender, 3) }} </span>
                </div>

                <div>
                    
                    <div v-if="message.type == 'text'" class="p-1 px-3 mb-2 rounded-md text-md text-gray-200  "> 
                        {{ message.message}}     
                    </div>
                    
                    <img v-else class="w-3/5  rounded-md text-md text-gray-200 " 
                        :src="message.message" alt="">
                </div>
                
            </div>
        </div>

</template>

<script lang="ts" setup>
import useGlobalStore from '../../composables/useGlobalStore';

// accept props
const { message } = defineProps(['message'])

// Global Store
const { shortenString, 
        selected_room_members_obj,
        getAvatar } = useGlobalStore()




</script>