import useGlobalStore from '../../composables/useGlobalStore';
import useRooms from '../../composables/requests/rooms';
import useStorage from '../../composables/useStorage';
import { generateSymmetricKey } from '../../composables/cryptography/ciphers';
import useBlockchainInteraction from './blockchain_interaction';
import getWebSocket from '../sockets/sockets';





export default function useRoomInteraction() {

    const { createRoom, getRoom } = useRooms();
    // const { createBlockchainCollection, addBlock, getMembersList } = useBlockchain();
    const { 
            selected_room_id,
            selected_room_data,
            selected_channel_id,
            selected_channel_content,
            selected_room_members,
            selected_room_members_obj,
                        } = useGlobalStore()
    const { joinRoom } = useStorage()

    const socket = getWebSocket()

    const { createBlockchainCollectionInteraction, 
            addMemberInteraction, 
            updateMembersList, 
            loadBlockChain,
            getVerifiedChannelsInteraction } = useBlockchainInteraction()

    const createRoomInteraction = async (roomName: string, username:string) => {

        // Generate a random room id
        let room_id = generateSymmetricKey();
        // Generate a random room key
        let room_key = generateSymmetricKey();

        try {
             // Create a room on the server
            let room = await createRoom(roomName, room_id);
            // Join the room by adding it to the local storage
            joinRoom(room_id, [room_key] ,roomName);
            // update selected room id
            selected_room_id.value = room_id;
            // Get room data from server
            selected_room_data.value = await getRoom(room_id);

            // // Create Memebrs Collection on the server
            await createBlockchainCollectionInteraction(room_id)

            // Load Blockchain from server, empty for now but we need to 
            // load it to change the symmetric keys to the new ones of the room
            await loadBlockChain(room_id);

            // // Add block to member collection on server
            await addMemberInteraction(room_id, "memberAddition")

            // // Get members list from server
            await updateMembersList()  


        } catch (error) {
            console.log("Error Creating Room", error);
        }

    }

    const loadSelectedRoomInteraction = async (room_id: string) => {
        try{

            socket.emit("leave-room", selected_room_id.value)

            console.log("Room Selected: " + room_id)
            // Update selected room id
            selected_room_id.value = room_id
            // Clear selected channel
            selected_channel_id.value = null
            selected_channel_content.value = []

            // Get room data from server and update selected room data
            selected_room_data.value = await getRoom(room_id);
            selected_room_data.value.channels = []

            // Load Blockchain from server
            await loadBlockChain(room_id);

            // // Get members list from server
            await updateMembersList()

            selected_room_data.value.channels = getVerifiedChannelsInteraction()

            // Emit event to server to join room
            socket.emit("join-room", room_id)

        }catch(error){
            console.log("Error Loading Room", error);
        }

    }


    return {
        createRoomInteraction,
        loadSelectedRoomInteraction
    }

}