import useTemplate from './template.js';
import { EncryptedInvitation } from '../../types.js';

import { supabase } from './supabase_client.js';

export default function useInvitations() {
        const template = useTemplate();
    

        const createInvitation = async (public_key:string, invitation:EncryptedInvitation) => {
            const stringifiedInvitation = JSON.stringify(invitation)
            const {data, error} = await supabase.from('invitations').insert({
                public_key,
                invitation: stringifiedInvitation,
            }).select('*').single()
            console.log("createInvitationRequest", data)

            if (error) throw error;

            return data
        }

        const getInvitations = async (public_key:string) => {
            const {data, error} = await supabase.from('invitations').select('*').eq('public_key', public_key)
            console.log("getInvitations", data)
            if (error) throw error;
            return data
        }

        // delete invitation request
        const deleteInvitation = async (id:string) => {
            const {data, error} = await supabase.from('invitations').delete().eq('id', id)
            console.log("deleteInvitation", data)
            if (error) throw error;

            return data
        }




        return {
            createInvitation,
            getInvitations,
            deleteInvitation,
        }

}