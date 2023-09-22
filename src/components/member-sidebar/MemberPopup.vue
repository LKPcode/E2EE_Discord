<template>
        <div
            ref="MemberPopup"
            tabindex="0" 

            class="fixed outline-none right-[310px]  w-[300px] bg-dark rounded-md"
            :style="`top:${calculatePopupPosition()}px`">
            <div class="relative p-2 h-full w-full flex flex-col">
                <div class="absolute -m-2 w-full h-14 bg-hovercolor rounded-t-md"></div>

                <div class="z-10 mt-4 flex justify-start items-center align-middle">
                <img class="rounded-full ml-6  h-16 w-16  bg-white"
                        :src="getAvatar(member.publicKey)" alt="avatar">

                    <div class="ml-4">
                        <div class="mb-1 font-bold text-lg text-gray-100"> {{ member.username }}   </div>
                        <div class="text-sm text-gray-400 cursor-pointer hover:underline">
                            {{ shortenString(member.publicKey, 8) }}
                        </div> 
                    </div>  
                </div>
                
                <!-- <div class="flex-1 mt-2 bg-primary rounded-md">
                    <div class="m-3 text-lg text-gray-100"> {{ member.username }}   
                        <span class="text-sm text-gray-400 cursor-pointer hover:underline">
                            {{ shortenString(member.publicKey, 3) }}
                        </span> 
                    </div>
                    <div class="h-[2px] m-auto bg-slate-700 rounded-full w-[90%]"></div>
   
                </div> -->

               
                <div class="flex text-sm gap-2 justify-between  mt-4  font-bold  text-gray-300 ">
                    <div class="cursor-pointer px-2 py-1 border-2 border-red-500 hover:bg-red-500 rounded-md">Remove</div>
                    <div class="cursor-pointer text-center flex-1 px-2 py-1 border-2 border-blue-500 hover:bg-blue-500 rounded-md">Message</div>
                    <div class="cursor-pointer px-2 py-1 border-2 border-green-500 hover:bg-green-500 rounded-md">Add Friend</div>
                </div>

            </div>
        </div>

</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import useGlobalStore from '../../composables/useGlobalStore';
import { defineProps } from 'vue'

const { shortenString, getAvatar } = useGlobalStore()

const MemberPopup = ref<HTMLElement>()

const props = defineProps(['show', 'top', 'member'])

// Maybe change to on created
onMounted(() => {
    MemberPopup.value?.focus()
})

const calculatePopupPosition = () => {
    console.log(window.screen.height)

    if(props.top < window.screen.height - 340){
        return props.top
    } else {
        return window.screen.height - 340
    }
}



// const focusOut = () => {
//     if(showMemberPopup.value == true){
//        showMemeberSemaphor.value = true
//     }
//     showMemberPopup.value = false
//     setTimeout(() => {
//         showMemeberSemaphor.value = false
//     }, 100);
// }


</script>