import { io } from "socket.io-client";
import useGlobalStore from "../useGlobalStore";
import useChannelInteraction from "../interactions/channel_interaction";
import { EncryptedBlock, EncryptedMessage } from "../../types";
import useBlockchainInteraction from "../interactions/blockchain_interaction";


let socket:any;

const { selected_channel_id,
        selected_room_id,
        selected_channel_content } = useGlobalStore();

const { decryptMessageInteraction } = useChannelInteraction();
const { addBlockInteraction } = useBlockchainInteraction()


export default function getWebSocket(){
  if (!socket) {
    socket = io("http://localhost:3000");


    socket.on("message", (data: EncryptedMessage) => {
        console.log("New Message: ", data);
        let decrypted = decryptMessageInteraction(data, selected_room_id.value!);
        selected_channel_content.value.push(decrypted);

        console.log(`Message Recieved through WebSocket: id:(${socket.id}) `, decrypted);

        // // scroll to bottom of chat window
        // const element = document.getElementById("chat-window");
        // element!.scrollTop = element!.scrollHeight;
    });


    socket.on("block", (block: EncryptedBlock) => {
        console.log("New Block Received: ", block);
        addBlockInteraction(block);
    });

  }

  return socket;
};