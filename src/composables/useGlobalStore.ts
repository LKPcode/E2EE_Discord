// Simple global store for Vue 3
import { MemberItem, Channel, Room, DecryptedMessage, Dictionary } from '../types'

import { ref } from 'vue'

const showInvitePopup = ref<boolean>(false)
const showLeaveRoomPopup = ref<boolean>(false)
const showCreateRoomPopup = ref<boolean>(false)
const showCreateChannelPopup = ref<boolean>(false)
const showSettingsPopup = ref<boolean>(false)


const invitations_list = ref<any>([])

const selected_room_id = ref<string|null>(null)
const selected_channel_id = ref<string|null>(null)

// stores members data of selected channel
const selected_room_members = ref<MemberItem[]>([])
// stores members data of selected channel Dictionary (Public Key: Username)
const selected_room_members_obj = ref<Dictionary>({})
// stores main content data of selected channel like messages and images
const selected_channel_name = ref<string|null>(null)
const selected_channel_content = ref<DecryptedMessage[]|null>([])
// stores room data of selected room
const selected_room_data = ref<Room>({
    _id: '',
    version: 0,
    room_id: '',
    room_name: ''
})
// stores a list of the channels of the selected room
const selected_room_channels = ref<Channel[]>([])




export default function useGlobalStore() {



    const shortenString = (str:string, n:number) => {
        if (str.length <= 2 * n) {
          return str; // No need to shorten the string
        }
        // Make upercase aswell
        const firstChars = str.substring(0, n).toUpperCase();
        const lastChars = str.substring(str.length - n).toUpperCase();

        
        return `${firstChars}...${lastChars}`;
    }


    const getAvatar = (publicKey:string) => {
        return `https://api.dicebear.com/6.x/identicon/svg?seed=${publicKey}`
    }

    const getRoomAvatar = (room_name:string) => {
        return `https://api.dicebear.com/6.x/initials/svg?seed=${room_name}&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33,f4511e,fb8c00,fdd835,ffb300`
    }

    const setSelectedStateToNull = () => {
        selected_room_id.value = null
        selected_channel_id.value = null
        selected_room_members.value = []
        selected_room_members_obj.value = {}
        selected_channel_name.value = null
        selected_channel_content.value = []
        selected_room_data.value = {} as Room
        selected_room_channels.value = []
    }

    
   

    return {
        showInvitePopup,
        showLeaveRoomPopup,
        showCreateRoomPopup,
        showSettingsPopup,
        selected_room_id,
        selected_channel_id,
        selected_room_data,
        selected_channel_content,
        selected_room_members,
        selected_room_members_obj,
        selected_channel_name,
        selected_room_channels,
        showCreateChannelPopup,
        shortenString,
        getAvatar,
        getRoomAvatar,
        setSelectedStateToNull,
        invitations_list
    }
}
