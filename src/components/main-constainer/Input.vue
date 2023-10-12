<template>
    <!-- Only show Input if a channel is selected -->
    <div v-if="selected_channel_id != null" class="flex bg-primary">
        
        <textarea v-model="message" @keyup.enter="sendMessage"
        oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'
        class="m-3 mt-0 p-2 outline-none text-white flex-1 rounded-md bg-secondary"></textarea>
        
        <img v-if="source!==null" class="h-10 rounded-md" :src="source" alt="">
            
        <div class="">

            <button @click="sendMessage" class="flex justify-center items-center cursor-pointer px-2 m-2 font-bold h-8 bg-green-500 rounded-md ">
                Send
            </button>
            <label for="file-upload" class="flex justify-center items-center cursor-pointer px-2 m-2 font-bold h-8 bg-green-500 rounded-md ">
                File
                <input id="file-upload" class="hidden" type="file" @change="readFile" />
            </label>
        </div>
    </div>
</template>

<script lang="ts" setup>
import useGlobalStore from '../../composables/useGlobalStore';
import useStorage from '../../composables/useStorage';
import { ref } from 'vue';
import { DecryptedMessage } from '../../types';
import useChannelInteraction from '../../composables/interactions/channel_interaction';
import { Buffer } from 'buffer';
import forge from 'node-forge';

import {
    AES_encrypt_file,
    generateSymmetricKey,
    AES_decrypt_file
} from "../../composables/cryptography/ciphers"

const { selected_channel_id,
    selected_room_id, selected_channel_content } = useGlobalStore()


const { storage } = useStorage()
const { sendMessageInteraction } = useChannelInteraction()

const message = ref("")
const file_data = ref<ArrayBuffer|null>(null)
const type = ref("text")

const sendMessage = () => {
    console.log("Send Message")

    let tempMessage:ArrayBuffer|string|null = ""
    if(source.value!==""){
        tempMessage = file_data.value
    }else{
        tempMessage = message.value
        // if message empty return
    }

    message.value = ""
    sendMessageInteraction(
        selected_room_id.value!,
        selected_channel_id.value!,
        tempMessage!,
        type.value
    )
        .then((res) => {
        }).catch((err) => {
            console.log(err)
        })

    source.value = ''
    file_data.value = null
    type.value = 'text'

}



const source = ref<string|null>('')
const readFile = (e: any) => {
    console.log("Read File")
    const file = e.target.files[0]
    type.value = file.type
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = () => { 


        console.log(reader.result)
        file_data.value = reader.result as ArrayBuffer
        
        let blob = new Blob([reader.result as ArrayBuffer], { type: file.type })
        var url = URL.createObjectURL(blob);
        source.value = url
    }
}

</script>

