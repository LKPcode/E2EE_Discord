import useTemplate from './template.js';
import { AES_encrypt, AES_decrypt, convertKeyPairHexToObject, generateSymmetricKey } from "../cryptography/ciphers.js"
import useStorage from "../useStorage.js"
import useGlobalStore from "../useGlobalStore.js"
import forge from 'node-forge'

import { DecryptedMessage, EncryptedMessage, KeyPair } from '../../types.js';

export default function useRooms() {
        const template = useTemplate();
        const { storage } = useStorage();
        const { selected_room_id } = useGlobalStore();
    
        const createRoom = async (room_name:string, room_id:string) => {
            const res = await template.fetchPOST('/room/create', {room_name, room_id}, { about: 'createRoom' })
            return res
        }
    
        const getRoom = async (room_id:string|null) => {
            const res = await template.fetchGET(`/room/${room_id}`, { about: 'getRoom' });
            return res;
        }

        const createChannel = async (room_id:string|null, channel_id:string, channel_name:string) => {
            const res = await template.fetchPOST(`/channel/create`, { room_id, channel_id, channel_name }, { about: 'createChannel' })
            return res
        }

        const addChannelContent = async (room_id:string|null, channel_id:string|null, content:EncryptedMessage) => {
           
            const res = await template.fetchPOST(`/channel/content/create`, { room_id, channel_id, content }, { about: 'createChannelContent' })
            return res
        }

        const getChannelContent = async (room_id:string|null, channel_id:string) => {

            const res = await template.fetchGET(`/channel/content/${room_id}/${channel_id}`, { about: 'getChannelContent' });
            return res;
        }
    
        return {
            createRoom,
            getRoom,
            createChannel,
            addChannelContent,
            getChannelContent
        }
    }