
import {supabase} from './supabase_client.js'

import { DecryptedMessage, EncryptedMessage, KeyPair } from '../../types.js';

export default function useRooms() {

    
        const createRoom = async (room_name:string, room_id:string) => {
            const {data, error} = await supabase.from('rooms').insert({
                room_name,
                room_id
            })
            console.log("createRoomRequest", data)
    
            if (error) throw error;
    
            return data
        }
    
        const getRoom = async (room_id:string|null) => {
            const {data, error} = await supabase.from('rooms').select('*').eq('room_id', room_id).single()
            console.log("getRoomRequest", data)
            if (error) throw error;
            return data
        }

        const createChannel = async (room_id:string|null, channel_id:string, channel_name:string) => {
            const {data, error} = await supabase.from('channels').insert({
                room_id,
                channel_id,
                channel_name
            }).select('*').single()
            console.log("createChannelRequest", data)
    
            if (error) throw error;
    
            return data
        }

        const getChannels = async (room_id:string|null) => {
            const {data, error} = await supabase.from('channels').select('*').eq('room_id', room_id)
            console.log("getChannelsRequest", data)
            if (error) throw error;
            return data
        }

        const addChannelContent = async ( channel_id:string|null, content:EncryptedMessage) => {
            const {data, error} = await supabase.from('messages').insert({
                channel_id,
                IV: content.IV,
                data: content.data,
                version: content.version,
            })
            console.log("addChannelContentRequest", data)
    
            if (error) throw error;
    
            return data
        }

        const getChannelContent = async ( channel_id:string) => {
            const {data, error} = await supabase.from('messages').select('*').eq('channel_id', channel_id)
            console.log("getChannelContentRequest", data)
            if (error) throw error;
            return data
        }
    
        return {
            createRoom,
            getRoom,
            createChannel,
            addChannelContent,
            getChannelContent,
            getChannels
        }
    }