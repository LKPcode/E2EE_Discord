<template>
    <div @click="openInvitation()" class="my-3 mx-auto w-14 h-14  group flex justify-center align-middle items-center rounded-3xl 
                bg-hovercolor transition-all duration-200 ease-linear hover:rounded-xl cursor-pointer ">
        <div class="text-2xl text-slate-100 uppercase">
            <svg class="svg-icon font-bold" fill="1" viewBox="0 0 20 20">
							<path fill="none" d="M16.999,4.975L16.999,4.975C16.999,4.975,16.999,4.975,16.999,4.975c-0.419-0.4-0.979-0.654-1.604-0.654H4.606c-0.584,0-1.104,0.236-1.514,0.593C3.076,4.928,3.05,4.925,3.037,4.943C3.034,4.945,3.035,4.95,3.032,4.953C2.574,5.379,2.276,5.975,2.276,6.649v6.702c0,1.285,1.045,2.329,2.33,2.329h10.79c1.285,0,2.328-1.044,2.328-2.329V6.649C17.724,5.989,17.441,5.399,16.999,4.975z M15.396,5.356c0.098,0,0.183,0.035,0.273,0.055l-5.668,4.735L4.382,5.401c0.075-0.014,0.145-0.045,0.224-0.045H15.396z M16.688,13.351c0,0.712-0.581,1.294-1.293,1.294H4.606c-0.714,0-1.294-0.582-1.294-1.294V6.649c0-0.235,0.081-0.445,0.192-0.636l6.162,5.205c0.096,0.081,0.215,0.122,0.334,0.122c0.118,0,0.235-0.041,0.333-0.12l6.189-5.171c0.099,0.181,0.168,0.38,0.168,0.6V13.351z"></path>
						</svg>
         <!-- {{ props.room.room_name?.charAt(0) }} -->
        </div>
        <span class="absolute w-auto p-2 m-2 min-w-max left-20
                    rounded-md shadow-md
                    text-white bg-dark
                    text-md font-bold
                    transition-all duration-100 scale-0 origin-left
                    group-hover:scale-100 z-10">
          Open Invitation  <!-- {{ props.room.room_name }} -->
        </span>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import useInvitationInteraction from '../../composables/interactions/invitation_interaction';
import { toast } from 'vue-sonner'

// accept room as prop
const props = defineProps({
    invitation: {
        type: Object as PropType<{
            invitation:string,
            public_key: string,
            id: string,
        }>,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
   
})

const emit = defineEmits(["removeInvitation"])

const {openInvitationInteraction} = useInvitationInteraction()


// set selected room when clicked
const openInvitation = async () => {

    await openInvitationInteraction(props.invitation).then(() => {
    // Remove the invitation from the sidebar, emmiting an event to the parent
    emit("removeInvitation", props.index)

    toast.success("Invitation opened successfully")

    }).catch((err) => {
        console.log(err)
    })
    


  
    
}




</script>