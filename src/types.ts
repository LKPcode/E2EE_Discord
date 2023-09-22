
interface RoomStorage {
        room_id: string,
        room_name: string,
        room_shared_keys: string[],
}
 

interface Storage {
        rooms: RoomStorage[],
        personal_symmetric_key: string,
        personal_public_key: string,
        personal_private_key: string,
        username: string,
}

interface InvitationMessage {
        room_id: string|null,
        room_name: string|null,
        room_shared_keys: string[],
}

interface EncryptedInvitation {
        encryptedMessage: string,
        encryptedSymmetricKeyAndVI: string,
}


interface KeyPair {
        publicKey: string,
        privateKey: string,
}

interface DecryptedBlock{
    data: {
        type:string,
        payload:string,
        publicKey:string,
        previousHash:string
    }
    signature:string
}

interface EncryptedBlock {
    version: number,
    IV: string,
    data: string
}

interface MemberItem {
    username: string,
    publicKey: string,
    isModerator: boolean,
}

interface Dictionary { // public key to username
    [key: string]: {
        username: string,
        publicKey: string,
    }
}

interface Channel {
    _id: string,
    version: number,
    channel_id: string, 
    channel_name: string,
    channel_meta: string,
}

interface Room {
    _id: string,
    version: number,
    room_id: string,
    room_name: string,
    channels: Channel[],
}

interface EncryptedMessage {
    version: number,
    IV: string,
    data: string
}

interface DecryptedMessage {
    sender: string,
    signature: string,
    message: string,
    timestamp: number,
    type: string
}



export type {   Storage, 
                InvitationMessage,
                KeyPair,
                EncryptedInvitation,
                DecryptedBlock,
                MemberItem, 
                EncryptedBlock,
                Channel,
                Room,
                EncryptedMessage,
                DecryptedMessage,
                Dictionary,

            }