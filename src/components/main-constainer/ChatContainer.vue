<template>
    <div class="bg-slate-900 h-screen flex flex-col flex-1">
        <ChannelBar />
        <Chat />
        <Input />
    </div>

</template>

<script lang="ts" setup>

import ChannelBar from './ChannelBar.vue';
import Chat from './Chat.vue'; 
import Input from './Input.vue';

</script>