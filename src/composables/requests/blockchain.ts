import useTemplate from './template.js';


import useStorage from "../useStorage.js"
import { EncryptedBlock } from '../../types.js';


export default function useBlockchain() {
        const template = useTemplate();
        const { storage } = useStorage();

        const createBlockchainCollection = async (room_id:string) => {
            const res = await template.fetchPOST('/blockchain/create', { room_id }, { about: 'createMembersCollection' })
            return res
        }

        const addBlock = async (room_id:string, block: EncryptedBlock) => {
            const res = await template.fetchPOST('/blockchain/add_block', { room_id, block }, { about: 'addBlock' })
            return res
        }

        const getBlockChain = async (room_id:string|null) =>  {
            const block_chain: EncryptedBlock[] = await template.fetchGET(`/blockchain/get_blockchain/${room_id}`, { about: 'getBlockChain' })
            return block_chain
        }

       
        return {
            createBlockchainCollection,
            addBlock,
            getBlockChain
        }

}