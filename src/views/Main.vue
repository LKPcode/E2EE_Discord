<template>
  <div class="flex">

    <RoomsSidebar class="hidden md:flex" />

    <ChannelsSidebar class="hidden sm:flex" />

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

import RoomsSidebar from '../components/rooms-sidebar/RoomsSidebar.vue'
import ChannelsSidebar from '../components/channels-sidebar/ChannelsSidebar.vue'
import ChatContainer from '../components/main-constainer/ChatContainer.vue'
import MemberSidebar from '../components/member-sidebar/MemberSidebar.vue'
import InvitationPopup from '../components/invitation-popup/InvitationPopup.vue'
import LeaveRoomPopup from '../components/leave-room-popup/LeaveRoomPopup.vue'
import CreateRoom from '../components/create-room-popup/CreateRoom.vue'
import CreateChannelPopup from '../components/create-channel-popup/CreateChannelPopup.vue'
import SettingsPopup from '../components/settings-popup/SettingsPopup.vue'
// Notifications
import { Toaster, toast } from 'vue-sonner'
import { useRoute } from 'vue-router'

import useGlobalStore from '../composables/useGlobalStore'
import useRoomInteraction from '../composables/interactions/room_interaction'
import useChannelInteraction from '../composables/interactions/channel_interaction'
import useStorage from '../composables/useStorage'
import useBlockcahinInteraction from '../composables/interactions/blockchain_interaction'

import { onMounted, watch } from 'vue'

const { showInvitePopup,
  showLeaveRoomPopup,
  showCreateRoomPopup,
  showCreateChannelPopup,
  showSettingsPopup,
  setSelectedStateToNull,
  selected_room_id,
  selected_channel_content,
  invitations_list
} = useGlobalStore()

const { getKeyPair } = useStorage()

const { loadSelectedRoomInteraction } = useRoomInteraction()
const { loadSelectedChannelInteraction, decryptMessageInteraction } = useChannelInteraction()
const { addBlockInteraction } = useBlockcahinInteraction()

import { supabase } from '../composables/requests/supabase_client'

let route = useRoute()

let channel: any = null;
let invitation: any = null;
let block: any = null;

onMounted(() => {
  toast.success('App is mounted')

   // Subscribe to the invitation
   const { publicKey } = getKeyPair();
   console.log("Public Key to subscribe to: ", publicKey);
    invitation = supabase.channel(`invitation:${publicKey}`);
    console.log("Subscribing to the invitation", route.params.invitation_id)
    // Subscribe to the invitation
    invitation
      .on(
        'broadcast',
        { event: 'new_invitation' },
        (payload: any) => {
          console.log("New Invitation Broadcasted")
          console.log(payload.payload);
          invitations_list.value.push(payload.payload);
        }
      )
      .subscribe()



  // load selected room
  if (route.params.room_id) {
    loadSelectedRoomInteraction(route.params.room_id as string);

    // Subscribe to the room and listen for block aditions
    block = supabase.channel(`room:${route.params.room_id}`);
    console.log("Subscribing to the blockchain of the room", route.params.room_id)
    // Subscribe to the Channel
    block
      .on(
        'broadcast',
        { event: 'new_block' },
        (payload: any) => {
          console.log("New Block Broadcasted")
          console.log(payload.payload);
          addBlockInteraction(payload.payload);
        }
      )
      .subscribe()

  
  }
  if (route.params.channel_id) {
    loadSelectedChannelInteraction(route.params.channel_id as string);

    channel = supabase.channel(route.params.channel_id as string);
    console.log("Subscribing to the channel", route.params.channel_id)
    // Subscribe to the Channel
    channel
      .on(
        'broadcast',
        { event: 'new_message' },
        (payload: any) => {
          console.log(payload.payload);
          let decrypted_message = decryptMessageInteraction(payload.payload, selected_room_id.value!);
          console.log(decrypted_message);
          selected_channel_content.value?.push(decrypted_message);
        }
      )
      .subscribe()

  }

})

// Watch Changes on the route params
watch(() => route.params.room_id, (newVal, oldVal) => {
  setSelectedStateToNull();
  loadSelectedRoomInteraction(newVal as string);

   // Subscribe to the room and listen for block aditions
   block = supabase.channel(`room:${route.params.room_id}`);
    console.log("Subscribing to the blockchain of the room", route.params.room_id)
    // Subscribe to the Channel
    block
      .on(
        'broadcast',
        { event: 'new_block' },
        (payload: any) => {
          console.log("New Block Broadcasted")
          console.log(payload.payload);
          addBlockInteraction(payload.payload);
        }
      )
      .subscribe()

})

watch(() => route.params.channel_id, (newVal, oldVal) => {
  loadSelectedChannelInteraction(newVal as string);

  if (channel) {
    channel.unsubscribe();
  }

  channel = supabase.channel(newVal as string);
  console.log("Subscribing to the channel", newVal)
  // Subscribe to the Channel
  channel
    .on(
      'broadcast',
      { event: 'new_message' },
      (payload:any) => {
        console.log(payload.payload);
        let decrypted_message = decryptMessageInteraction(payload.payload, selected_room_id.value!);
        console.log(decrypted_message);
        selected_channel_content.value?.push(decrypted_message);
      }
    )
    .subscribe()

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
  