<template>
    <div @click="selectRoom()" class="my-3 mx-auto w-14 h-14  group flex justify-center align-middle items-center rounded-3xl 
                bg-primary transition-all duration-200 ease-linear hover:rounded-xl cursor-pointer overflow-hidden "
                :class="{'border-2 border-gray-300': props.selected}">


        <!-- <div class="text-2xl text-slate-100 uppercase">
            {{ props.room.room_name?.charAt(0) }}
        </div> -->

        <img class="w-full h-full" :src="getRoomAvatar(props.room.room_name)" alt="">
        <!-- <div class="absolute left-2 overflow-hidden rounded-full  w-3 h-3 bg-red-300 "></div> -->
        <span class="absolute w-auto p-2 m-2 min-w-max left-20
                    rounded-md shadow-md
                    text-white bg-dark
                    text-md font-bold
                    transition-all duration-100 scale-0 origin-left
                    group-hover:scale-100 z-10">
            {{ props.room.room_name }}
        </span>
    </div>
</template>

<script lang="ts" setup>
import useGlobalStore from '../../composables/useGlobalStore';
import { useRouter } from 'vue-router';
// accept room as prop
const props = defineProps(["room", "selected"])

const { getRoomAvatar } = useGlobalStore()

// set selected room when clicked
const router = useRouter()
const selectRoom = async () => {

    // set selected room
    await router.push(`/${props.room.room_id}`)
    // await loadSelectedRoomInteraction(props.room.room_id)
    // await loadBlockChain(props.room.room_id);
    // await updateMembersList();
}




</script>