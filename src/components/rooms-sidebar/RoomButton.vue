<template>
    <div @click="selectRoom()" class="my-3 mx-auto w-14 h-14  group flex justify-center align-middle items-center rounded-3xl 
                bg-primary transition-all duration-200 ease-linear hover:rounded-xl cursor-pointer overflow-hidden">
        <!-- <div class="text-2xl text-slate-100 uppercase">
            {{ props.room.room_name?.charAt(0) }}
        </div> -->
        <img class="w-full h-full" :src="getRoomAvatar(props.room.room_name)" alt="">
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
import useRoomInteraction from '../../composables/interactions/room_interaction';
import useBlockchainInteraction from '../../composables/interactions/blockchain_interaction';
import useGlobalStore from '../../composables/useGlobalStore';
// accept room as prop
const props = defineProps(["room"])

const { loadSelectedRoomInteraction } = useRoomInteraction()
const { loadBlockChain, updateMembersList } = useBlockchainInteraction()

const { getRoomAvatar } = useGlobalStore()

// set selected room when clicked
const selectRoom = async () => {
    await loadSelectedRoomInteraction(props.room.room_id)
    await loadBlockChain(props.room.room_id);
    await updateMembersList();
}




</script>