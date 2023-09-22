<template>
    <div class="absolute w-full h-full ">
        <div @click="closeLeaveRoomPopup()" class="bg-dark/30 absolute w-full h-full  backdrop-blur-sm"></div>


        <div class="absolute flex flex-col p-3  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px]
                         bg-dark rounded-md">
            <div class=" p-2 flex justify-center align-middle items-center text-gray-300 text-lg">
                <span class="text-center"> Are you sure you want to leave this Room? </span>
            </div>

            <div class="text-center text-gray-400 text-sm"> You will be removed from all channels in this room.
                This action is non reversible.You will need to be re-invited to have access to this rooms again.
            </div>

            <div class="flex text-sm gap-2 justify-between  mt-4  font-bold  text-gray-300 ">
                    <div @click="leaveRoomFunc()" class="flex-1 text-center cursor-pointer px-2 py-1 border-2 border-red-500 hover:bg-red-500 rounded-md">Leave</div>
                    <div @click="closeLeaveRoomPopup()" class=" flex-1 text-center cursor-pointer px-2 py-1 border-2 border-green-500 hover:bg-green-500 rounded-md">Stay</div>
            </div>





        </div>

    </div>
</template>

<script lang="ts" setup>
import useGlobalStore from '../../composables/useGlobalStore';
import useStorage from '../../composables/useStorage';

const { showLeaveRoomPopup, 
        selected_room_id,
        setSelectedStateToNull} = useGlobalStore()
const { leaveRoom } = useStorage()


const closeLeaveRoomPopup = () => {
    showLeaveRoomPopup.value = false;
}

const leaveRoomFunc = () => {
    console.log('leave room with id:', selected_room_id.value);
    leaveRoom(selected_room_id.value)
    setSelectedStateToNull()
    closeLeaveRoomPopup()
}

</script>