import useGlobalStore from '../../composables/useGlobalStore';
import useRooms from '../../composables/requests/rooms';
import useStorage from '../../composables/useStorage';
import { generateSymmetricKey } from '../../composables/cryptography/ciphers';
import useBlockchainInteraction from './blockchain_interaction';
// import getWebSocket from '../sockets/sockets';
import { useRouter } from 'vue-router';





export default function useRoomInteraction() {

    const router = useRouter()

    const { createRoom, getRoom, getChannels } = useRooms();
    // const { createBlockchainCollection, addBlock, getMembersList } = useBlockchain();
    const { 
            selected_room_id,
            selected_room_data,
            selected_room_channels,
                        } = useGlobalStore()
    const { joinRoom } = useStorage()

    // const socket = getWebSocket()

    const { 
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


            // // update selected room id
            // selected_room_id.value = room_id;

            // // Get room data from server
            // selected_room_data.value = await getRoom(room_id);

            // Load Blockchain from server, empty for now but we need to 
            // load it to change the symmetric keys to the new ones of the room
            await loadBlockChain(room_id);

            // // Add block to member collection on server
            await addMemberInteraction(room_id)

            // // Get members list from server
            await updateMembersList()  

            // Go to the room
            router.push('/' + room_id)


        } catch (error) {
            console.log("Error Creating Room", error);
        }

    }

    const loadSelectedRoomInteraction = async (room_id: string) => {
        try{

            console.log("Room Selected: " + room_id)
            // router.push('/' + room_id)
            // // Update selected room id
            selected_room_id.value = room_id

            // // Get room data from server and update selected room data
            let room = await getRoom(room_id)
            console.log("Room Data", room)

            selected_room_data.value = {
                ...room
            }


            // Load Blockchain from server
            await loadBlockChain(room_id);

            // // Get members list from server
            await updateMembersList()

            selected_room_channels.value = getVerifiedChannelsInteraction()


        }catch(error){
            console.log("Error Loading Room", error);
            selected_room_data.value = {
                version: 0,
                room_id: 'Error Loading Room',
                room_name: 'Error Loading Room'
            }
        }

    }


    return {
        createRoomInteraction,
        loadSelectedRoomInteraction
    }

}