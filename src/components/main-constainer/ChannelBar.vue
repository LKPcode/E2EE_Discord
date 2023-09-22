<template>
     <div class="p-3 px-6 w-full h-12 top-0 bg-primary font-bold  border-b-2 border-dark text-slate-300">
       {{ selected_channel_name  }}
    </div>
</template>

<script lang="ts" setup>
import useGlobalStore from '../../composables/useGlobalStore';

const { selected_channel_name } = useGlobalStore()

</script>