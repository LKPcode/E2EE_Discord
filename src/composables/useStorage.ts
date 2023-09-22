import { ref } from 'vue'
import type { Ref } from 'vue'
import { generateKeyPairHex, generateSymmetricKey } from './cryptography/ciphers.js'
import {Storage} from '../types'
  

const storage = ref<Storage>(
        {
            "rooms": [],
            "personal_symmetric_key": "",
            "personal_public_key": "",
            "personal_private_key": "",
            "username": "",
        }
    )


export default function useStorage() {

    

    const joinRoom = async (room_id:string, room_shared_keys:string[], room_name:string) => {
        storage.value.rooms.push(
            {
                "room_id": room_id,
                "room_name": room_name,
                "room_shared_keys": room_shared_keys,
            }
        )

        localStorage.setItem('storage', JSON.stringify(storage.value))
    }

    const leaveRoom = async (room_id:string|null) => {
        
        storage.value.rooms = storage.value.rooms.filter(room => room.room_id !== room_id)

        localStorage.setItem('storage', JSON.stringify(storage.value))
    }

    const setUsername = async (username:string) => {
        storage.value.username = username

        localStorage.setItem('storage', JSON.stringify(storage.value))
    }

    const createKeyPair =  () => {
        const keyPair = generateKeyPairHex()

        storage.value.personal_public_key = keyPair.publicKey
        storage.value.personal_private_key = keyPair.privateKey

        localStorage.setItem('storage', JSON.stringify(storage.value))
        return keyPair
    }

    const getKeyPair  =  () => {
        return {
            "publicKey": storage.value.personal_public_key,
            "privateKey": storage.value.personal_private_key,
        }
    }

    const createSymmetricKey =  () => {
        const symmetricKey = generateSymmetricKey()
        return symmetricKey
    }


    const getRoomKeys = (room_id:string) => {
        const room = storage.value.rooms.find(room => room.room_id === room_id)
        if (room) {
            return room.room_shared_keys
        }else{
            // throw new Error("Room not found when trying to get room keys")
        }
        
    }

    const getUsername = () => {
        return storage.value.username
    }







    return {
        storage,
        joinRoom,
        leaveRoom,
        setUsername,
        createKeyPair,
        getKeyPair,
        createSymmetricKey,
        getRoomKeys,
        getUsername,
    }

    

}