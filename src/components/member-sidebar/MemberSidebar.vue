<template>
    <div class="w-72 h-screen flex flex-col ">
        <div class="p-3 pl-0 pr-1 flex justify-center align-middle items-center w-full h-12 top-0 bg-primary font-bold  border-b-2 border-dark text-slate-300">
            <input class="py-1 px-2 outline-none rounded-md bg-dark w-full font-medium" placeholder="Search" type="text">
        </div>

        <div class="p-3 flex-1 flex flex-col bg-secondary text-slate-400 overflow-auto scrollbar-custom">
            <div v-if="selected_room_id!==null" class="px-2 py-1 uppercase text-sm font-bold">Mods - {{ selected_room_members.filter(x=>x.isModerator).length }}</div>
            <Member v-for="member in selected_room_members.filter(x=>x.isModerator)" :member="member" />

            <div  v-if="selected_room_id!==null" class="px-2 py-1 uppercase text-sm font-bold">Members - {{ selected_room_members.filter(x=>!x.isModerator).length }}</div>
            <Member v-for="member in selected_room_members.filter(x=>!x.isModerator)" :member="member" />


        </div>  

       
    </div>
</template>

<script lang="ts" setup>
import Member from './Member.vue';
import { ref, onMounted } from 'vue'
import useGlobalStore from '../../composables/useGlobalStore';

const { selected_room_members, selected_room_id } = useGlobalStore()

// on Mounted
onMounted(async () => {
    // const members = await getMembersList("71a89490efb4dc2737aa313f1eabbe65")
    // console.log("Member List",members)
    // selected_room_members.value = members
})

</script>