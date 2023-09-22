<template>
  <div class="flex" id="app">

    <RoomsSidebar  class="hidden md:flex" />

    <ChannelsSidebar  class="hidden sm:flex" />

    <ChatContainer />

    <MemberSidebar class="hidden lg:flex" />

    <Transition>
      <InvitationPopup v-if="showInvitePopup" />
    </Transition>

    <Transition>
      <LeaveRoomPopup v-if="showLeaveRoomPopup" />
    </Transition>

    <Transition>
      <CreateRoom v-if="showCreateRoomPopup" />
    </Transition>

    <Transition>
      <CreateChannelPopup v-if="showCreateChannelPopup" />
    </Transition>

    <Transition>
      <SettingsPopup v-if="showSettingsPopup" />
    </Transition>


    <Toaster theme="dark" position="top-center" :duration="2000" closeButton />

  </div>
</template>

<script lang="ts" setup>
import RoomsSidebar from './components/rooms-sidebar/RoomsSidebar.vue'
import ChannelsSidebar from './components/channels-sidebar/ChannelsSidebar.vue'
import ChatContainer from './components/main-constainer/ChatContainer.vue'
import MemberSidebar from './components/member-sidebar/MemberSidebar.vue'
import InvitationPopup from './components/invitation-popup/InvitationPopup.vue'
import LeaveRoomPopup from './components/leave-room-popup/LeaveRoomPopup.vue'
import CreateRoom from './components/create-room-popup/CreateRoom.vue'
import CreateChannelPopup from './components/create-channel-popup/CreateChannelPopup.vue'
import SettingsPopup from './components/settings-popup/SettingsPopup.vue'
// Notifications
import { Toaster, toast } from 'vue-sonner'


import useGlobalStore from './composables/useGlobalStore'
import { onMounted } from 'vue'

const { showInvitePopup, 
        showLeaveRoomPopup, 
        showCreateRoomPopup, 
        showCreateChannelPopup, 
        showSettingsPopup } = useGlobalStore()

onMounted(() => {

  toast.success('App is mounted')

})


</script>

<style >
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
