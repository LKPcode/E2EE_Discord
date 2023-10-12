import useStorage from "../useStorage.js"
import { EncryptedBlock } from '../../types.js';

import { supabase } from './supabase_client.js';


export default function useBlockchain() {


        const addBlock = async (room_id:string, block: EncryptedBlock) => {
            const { data, error } = await supabase.from('blocks').insert({
                room_id,
                IV: block.IV,
                data: block.data,
                version: block.version,
            })

            if (error) throw error;
        }

        const getBlockChain = async (room_id:string|null) =>  {
            const { data, error } = await supabase.from('blocks').select('*').eq('room_id', room_id)
            if (error) throw error;
            return data
        }

       
        return {
            addBlock,
            getBlockChain
        }

}