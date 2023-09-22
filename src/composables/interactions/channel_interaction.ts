import useGlobalStore from "../useGlobalStore"
import useStorage from "../useStorage"
import useRooms from "../requests/rooms"
import { generateSymmetricKey, 
        convertKeyPairHexToObject,
        AES_encrypt,
        AES_decrypt } from "../cryptography/ciphers"
import forge from 'node-forge'
import useBlockchainInteraction from "./blockchain_interaction"
import { EncryptedMessage, DecryptedMessage, Channel } from "../../types"
import getWebSocket from "../sockets/sockets"
import { Buffer } from "buffer"

export default function useChannelInteraction() {

    const socket = getWebSocket()

    const { storage } = useStorage()

    const {addChannelInteraction, getVerifiedChannelsInteraction} = useBlockchainInteraction()

    const { selected_channel_id, 
            selected_channel_content,
            selected_channel_name,
            selected_room_data,
            selected_room_id,
        } = useGlobalStore()
    const { getChannelContent, createChannel, addChannelContent } = useRooms()

    const createChannelInteraction = async (channel_name: string) => {
        try{
            console.log("Creating Channel: " + channel_name)

            // Generate a random channel id
            let channel_id = generateSymmetricKey();

            // Create channel on server
            let res = await createChannel(selected_room_id.value, channel_id ,channel_name)

            // // Add channel to room
            // selected_room_data.value.channels.push(res.channel)

            // Add block to blockchain
            const channel_data = JSON.stringify(res.channel)
            await addChannelInteraction(selected_room_id.value!, channel_data)

            // Update channels from blockchain
            let channels = getVerifiedChannelsInteraction()
            selected_room_data.value.channels = channels

        }catch(error){
            console.log("Error Creating Channel", error)
        }

    }

    const loadSelectedChannelInteraction = async (channel: Channel) => {
        try{
            let channel_id = channel.channel_id

            console.log("PREVIOUS Channel: " + selected_channel_id.value)
            console.log("Loading Channel: " + channel_id)
            // Unsubscribe from previous channel
            socket.emit("leave-channel", selected_channel_id.value!)

            console.log("Channel Selected: " + channel_id)
            // Update selected channel id
            selected_channel_id.value = channel_id
            // Update selected channel name
            selected_channel_name.value = channel.channel_name
            // Clear selected channel content
            selected_channel_content.value = []
            // Get channel content from server
            selected_channel_content.value = await getChannelContentInteraction( selected_room_id.value! ,channel_id)

            console.log("Channel Content: ", selected_channel_content.value)

            // Subscribe to channel
            socket.emit("join-channel", channel_id)

            // // scroll to bottom of chat window
            // const element = document.getElementById("chat-window");
            // element!.scrollTop = element!.scrollHeight;

        }catch(error){
            console.log("Error Loading Channel", error)
        }

    }

    const sendMessageInteraction = async (room_id:string, channel_id:string ,message:ArrayBuffer|string, type:string) => {
        // Message Format:
            // {
            //     "version": 0,
            //     "IV": "IV",
            //     data:{
            //         "sender": "public_key",
            //         "signature": "signature",
            //         "message": "message",
            //         "timestamp": "123456789",
            //         "type": "text"
            //     }
            // }

            let the_message = message 

            let personal_key_pair = convertKeyPairHexToObject({
                publicKey:storage.value.personal_private_key,
                privateKey:storage.value.personal_private_key
            });

            if(type !== "text"){
               // Convert message to ByteStringBuffer
                let kk=forge.util.createBuffer(message)
                the_message = forge.util.encode64(kk.data) 
                console.log("The Image encoded:",the_message)
            }
            
        

            console.log(personal_key_pair)
            // Hash the message
            let md = forge.md.sha1.create();
            md.update(the_message as string , 'utf8');
            // Sign the message with personal private key
            let signature = personal_key_pair.privateKey.sign(md);

            // generate an IV
            let VI = generateSymmetricKey(); // Generate a random IV

            let _content = {
                sender: storage.value.personal_public_key,
                signature: signature,
                message:  unescape(encodeURIComponent(the_message as string)),
                timestamp: Date.now(),
                type: type
            }

            console.log("_Content",_content, unescape(encodeURIComponent(message as string)))

            let room_keys = storage.value.rooms.find(room => room.room_id === room_id).room_shared_keys;
            let encryption_key = room_keys[room_keys.length - 1];

            console.log("Encryption Key",encryption_key)

            let encryptedContent = AES_encrypt(JSON.stringify(_content), encryption_key, VI);

            let content = {
                version: room_keys.length - 1,
                IV: VI,
                data: encryptedContent,
            }

            console.log("Sending Message",content)

            // Send message to server
            let res = await addChannelContent(room_id, channel_id, content)


            // Send message to other users
            console.log("Sending Message to other users from id:", socket.id)
            socket.emit("new_message", channel_id , content)

            // // scroll to bottom of chat window
            // const element = document.getElementById("chat-window");
            // element!.scrollTop = element!.scrollHeight;

        }

        const getChannelContentInteraction = async (room_id:string, channel_id:string) => {
            // Message Format:
                // {
                //     "version": 0,
                //     "IV": "IV",
                //     data:{
                //         "sender": "public_key",
                //         "signature": "signature",
                //         "message": "message",
                //         "timestamp": "123456789",
                //         "type": "text"
                //     }
                // }

            let res = await getChannelContent(room_id, channel_id)

            let room_keys = storage.value.rooms.find(room => room.room_id === room_id).room_shared_keys;

            let unencrypted_messages: DecryptedMessage[]  = [];

            // Decrypt the messages
            // Should verify the signature here aswell
            res.content.forEach( (message:EncryptedMessage) => {
                let decrypted_message = decryptMessageInteraction(message, room_id)
                unencrypted_messages.push(decrypted_message)
            })

            return unencrypted_messages;

        }


        const decryptMessageInteraction= (message:EncryptedMessage, room_id:string) => {
            let room_keys = storage.value.rooms.find(room => room.room_id === room_id).room_shared_keys;
            // console.log(message, AES_decrypt(message.data, room_keys[message.version], message.IV))
            let data = JSON.parse(AES_decrypt(message.data, room_keys[message.version], message.IV))
             console.log("decrypted message: ", data)

            if(data.type !== "text"){
                // Convert message to ByteStringBuffer
                let kk = forge.util.decode64(data.message)
                let ok = Buffer.from(kk, 'binary');
                let blob = new Blob([ok], { type: data.type })
                data.message = URL.createObjectURL(blob);
            }


            return {
                ...data,
                message: decodeURIComponent(escape(data.message))
            }
        }

    return {
        loadSelectedChannelInteraction,
        createChannelInteraction,
        sendMessageInteraction,
        getChannelContentInteraction,
        decryptMessageInteraction
    }
}
