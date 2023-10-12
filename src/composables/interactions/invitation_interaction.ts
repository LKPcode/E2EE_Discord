import { InvitationMessage, KeyPair, EncryptedInvitation } from '../../types';
import useInvitations from '../../composables/requests/invitations';
import { encryptPGP,decryptPGP } from '../../composables/cryptography/ciphers';
import useGlobalStore from '../../composables/useGlobalStore';
import useStorage from '../../composables/useStorage';
import useRooms from '../../composables/requests/rooms';
import useBlockchainInteraction from './blockchain_interaction';

import { useRouter } from 'vue-router';

import { supabase } from '../requests/supabase_client'

export default function useInvitationInteraction() {

    const { addMemberInteraction, updateMembersList, loadBlockChain } = useBlockchainInteraction()
    const router = useRouter()

    const { createInvitation } = useInvitations()
    const { selected_room_id, 
            selected_room_data,
            selected_channel_id, 
            selected_channel_content,
            selected_room_members,
            selected_room_members_obj
         } = useGlobalStore()

    const { getRoom } = useRooms();
    const { deleteInvitation } = useInvitations();
    // const { addBlock, getMembersList  } = useBlockchain();
    const { storage , joinRoom } = useStorage()

    // const socket = getWebSocket()



    const createInvitationInteraction = async (user_to_invite: string) => {

        try{

            // Prepare Message to be encrypted
            let invitation_message: InvitationMessage = {
                room_id: selected_room_id.value,
                room_name: selected_room_data.value.room_name,
                room_shared_keys: storage.value.rooms
                                        .filter(room => room.room_id == selected_room_id.value)[0]
                                        .room_shared_keys, // List of shared encryption keys of room
            }

            // Get personal key pair from local storage
            const personal_key_pair: KeyPair = {
                publicKey: storage.value.personal_public_key,
                privateKey: storage.value.personal_private_key
            }
            // Encrypt the message
            let invitation: EncryptedInvitation = encryptPGP(JSON.stringify(invitation_message), user_to_invite , personal_key_pair )


            let created_invitation =  await createInvitation(user_to_invite, invitation)
            console.log("Success Creating Invitation", created_invitation)

            let temp_invitation_socket = supabase.channel(`invitation:${user_to_invite}`);
            console.log("Send Invitation Broadcast to ", user_to_invite)
            temp_invitation_socket.send({
                type: 'broadcast',
                event: 'new_invitation',
                payload: {
                    ...created_invitation
                },
            })
            console.log("Invitation Broadcasted")
            supabase.removeChannel(temp_invitation_socket)

        } catch (error) {
            console.log("Error Creating Invitation", error)
        }   

    }

    const openInvitationInteraction = async (document_invitation: { invitation:string, public_key:string  ,id:string }) => {
            //`Decrypts invitation and adds room to local storage`
            // Decrypt the invitation

        try{
            let invitation = document_invitation.invitation;

            console.log("Invitation Clicked")

            console.log("Invitation: ", invitation)

            let { encryptedMessage, encryptedSymmetricKeyAndVI}: EncryptedInvitation = JSON.parse(invitation)

            const personalPrivateKey = storage.value.personal_private_key
            console.log("Personal Private Key: ", personalPrivateKey)

            let {decryptedMessage, verified} = decryptPGP(encryptedMessage, encryptedSymmetricKeyAndVI, personalPrivateKey)
            // Should verify message by checking the "verified" variable here (boolean)


            console.log("Decrypted Message: ", decryptedMessage)

            let decrypted_invitation = JSON.parse(decryptedMessage.message)


            console.log("Room Selected: ", decrypted_invitation.room_id)
            // Set selected room
            selected_room_id.value = decrypted_invitation.room_id
            // Clear selected channel
            selected_channel_id.value = null
            selected_channel_content.value = []

            await joinRoom(decrypted_invitation.room_id, decrypted_invitation.room_shared_keys, decrypted_invitation.room_name)

            // Get information about the room
            // selected_room_data.value = await getRoom(selected_room_id.value)
            // console.log("Selected Room Data: ", selected_room_data.value)

            // Load the blockchain
            await loadBlockChain(selected_room_id.value!)

            // // Add a block to signiffy that the invitation has been opened 
            // // and the user has joined the room with the given username
            await addMemberInteraction(selected_room_id.value!)

            // // Update the members list
            await updateMembersList()

            router.push({name: 'Room', params: {room_id: selected_room_id.value}})

            // Delete the invitation from the database
            deleteInvitation(document_invitation.id)
        } catch (error) {
            console.log("Error Opening Invitation", error)
            throw new Error("Error Opening Invitation")
        }
        

    }


    return {
        createInvitationInteraction,
        openInvitationInteraction,
    }
}