import useBlockchain from "../requests/blockchain";
import BlockChain from "../cryptography/actions_blockchain";
import useGlobalStore from "../useGlobalStore";
import useStorage from "../useStorage";
import { EncryptedBlock, MemberItem } from "../../types";
import { ref } from "vue";
import { supabase } from "../requests/supabase_client";

const Blockchain = ref(new BlockChain([],[]));

export default function useBlockchainInteraction() {

    const { storage, getRoomKeys, getKeyPair, getUsername } = useStorage();
    const { selected_room_members, 
            selected_room_members_obj,
            selected_room_channels } = useGlobalStore();
    const { addBlock, getBlockChain} = useBlockchain();

    // const socket = getwebSocket();

    const loadBlockChain = async (room_id: string) => {

        const block_chain = await getBlockChain(room_id);
        const room_keys = await getRoomKeys(room_id);
        console.log("Room Keys", room_keys);
        if(block_chain && room_keys){
            console.log("Loading Blockchain");
            Blockchain.value.loadBlockChain(block_chain, room_keys);
        }else{
            console.log("Error Loading Blockchain");
            throw new Error("Error Loading Blockchain");
        }
    }

    // Takes an Encrypted Block and adds it to the Blockchain
    const addBlockInteraction = (block: EncryptedBlock) => {
        Blockchain.value.addBlock(block);
        // Update Member List
        updateMembersList();
        // Update Channels List
        selected_room_channels.value = getVerifiedChannelsInteraction();
    }



    const addMemberInteraction = async (room_id: string) => {

        let type = "memberAddition";
        let version = 0;
        let keyPair = getKeyPair()
        let username = getUsername()

        const block = Blockchain.value.createBlock(type, version, keyPair, username );

        if(!block){
            console.log("Error Creating Block");
            throw new Error("Error Creating Block (Maybe the type provided is not valid)");
        }

        const res = await addBlock(room_id, block);

        // emit new block to all members
        const socket_room = supabase.channel(`room:${room_id}`)
        console.log("Socket Room", socket_room)
            // Send a message once the client is subscribed
        if (socket_room){
            socket_room.send({
                type: 'broadcast',
                event: 'new_block',
                payload: {
                    room_id: room_id,
                    ...block
                },
            })
        }

        supabase.removeChannel(socket_room)
        
        return res;
    }


    const addChannelInteraction = async (room_id: string, channel_data: string) => {

        let type = "channelAddition";
        let version = 0;
        let keyPair = getKeyPair()

        const block = Blockchain.value.createBlock(type, version, keyPair, channel_data );

        if(!block){
            console.log("Error Creating Block");
            throw new Error("Error Creating Block (Maybe the type provided is not valid)");
        }

        const res = await addBlock(room_id, block);

        // emit new block to all members
        const socket_room = supabase.getChannels().find(channel => channel.subTopic === `room:${room_id}`)
        console.log("Socket Channel", socket_room)
            // Send a message once the client is subscribed
        if (socket_room){
            socket_room.send({
                type: 'broadcast',
                event: 'new_block',
                payload: {
                    room_id: room_id,
                    ...block
                },
            })
        }

        return res;
    }

    const updateMembersList= () => {
        const getMemberListObject = (members:MemberItem[]) => {
            let memberDict:any= {};
            memberDict = {};
            for (let i = 0; i < members.length; i++) {
                const member = members[i];
                memberDict[member.publicKey] = {
                    username: member.username,
                    isModerator: member.isModerator
                };
            }
            return memberDict;
        }

        const getUniqueMembers = (members:MemberItem[]) => {
            let resArr: MemberItem[] = [];
            members.filter(function(item){
            var i = resArr.findIndex(x => (x.publicKey == item.publicKey));
            if(i <= -1){
                    resArr.push(item);
            }
            return null;
            });
            return resArr;
        }


        // Get the moderator public key
        let modPubKey = Blockchain.value.getModeratorPublicKey();


        let members:MemberItem[] = [];
        for (let i = 0; i < Blockchain.value.decryptedChain.length; i++) {
            const block = Blockchain.value.decryptedChain[i];
            if(block.data.type === "memberAddition"){
                if(block.data.publicKey === modPubKey){
                    members.push({
                        username: block.data.payload,
                        publicKey: block.data.publicKey,
                        isModerator: true
                    });
                }else{
                    members.push({
                        username: block.data.payload,
                        publicKey: block.data.publicKey,
                        isModerator: false
                    });
                }
                
            }
        }

        members = getUniqueMembers(members);

        selected_room_members_obj.value = getMemberListObject(members);
        selected_room_members.value = members;
    }

    const getModeratorPublicKey = () => {
        return Blockchain.value.getModeratorPublicKey();
    }

    const getVerifiedChannelsInteraction = () => {
        // get blocks with type channelAddition
        // return channels

        let channel_blocks = Blockchain.value.decryptedChain
                                .filter((block) => (block.data.type === "channelAddition"));

        let channels = channel_blocks.map((block) => (JSON.parse(block.data.payload)));
        console.log("Channels", channels);
        return channels;

    }

    return {
        loadBlockChain,
        addMemberInteraction,
        updateMembersList,
        getModeratorPublicKey,
        addChannelInteraction,
        getVerifiedChannelsInteraction,
        addBlockInteraction
    }




}