<template>

     <div class="flex m-4">
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
                    
                    <div v-if="message.type == 'text'" class="p-1 px-3 mb-2 rounded-md text-md text-gray-200 hover:bg-hovercolor "> 
                        {{ message.message}}     
                    </div>
                    
                    <img v-else class="w-3/5  rounded-md text-md text-gray-200 hover:bg-hovercolor " 
                        :src="message.message" alt="">
                </div>
                
            </div>
        </div>

</template>

<script lang="ts" setup>
import useGlobalStore from '../../composables/useGlobalStore';
import {  onMounted, ref } from 'vue';
import { DecryptedMessage } from '../../types';
import { Buffer } from 'buffer';
import forge from 'node-forge';
import {AES_decrypt_file} from "../../composables/cryptography/ciphers"

// accept props
const { message } = defineProps(['message'])

// Global Store
const { shortenString, 
        selected_room_members_obj,
        getAvatar } = useGlobalStore()

// console.log("Message:", message)

const image = ref("")

onMounted(() => {
    // console.log("Message:", message)
    if(message.type !== "text"){
        // // base64 to data
        // const data = forge.util.decode64(message.message)
        // // data to buffer
        // const buffer = forge.util.createBuffer(data)
        // console.log("buffer", buffer)

        // const decrypted_file = AES_decrypt_file(buffer, secret, secret)
        // console.log(decrypted_file.buffer)

        // var blob = new Blob([decrypted_file.buffer], { type: "image/png" });
        // var url = URL.createObjectURL(blob);
        // image.value = url
    }
})




</script>