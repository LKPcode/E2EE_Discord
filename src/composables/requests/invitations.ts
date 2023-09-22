import useTemplate from './template.js';
import { EncryptedInvitation } from '../../types.js';

export default function useInvitations() {
        const template = useTemplate();
    

        const createInvitation = async (public_key:string, invitation:EncryptedInvitation) => {
            const stringifiedInvitation = JSON.stringify(invitation)
            const res = await template.fetchPOST('/invitation/create', { public_key, invitation: stringifiedInvitation }, { about: 'createInvitation' })
            return res
        }

        const getInvitations = async (public_key:string) => {
            const res = await template.fetchGET(`/invitation/${public_key}`, { about: 'getInvitations' })
            return res
        }

        // delete invitation request
        const deleteInvitation = async (id:string) => {
            const res = await template.fetchGET(`/invitation/delete/${id}`, { about: 'deleteInvitation' })
            return res
        }




        return {
            createInvitation,
            getInvitations,
            deleteInvitation,
        }

}