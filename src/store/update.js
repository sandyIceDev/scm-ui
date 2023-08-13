import { toast } from "@zerodevx/svelte-toast";
import { PvChatStatus, chats } from "./chat";
import { user } from "./user";
import { aesDecrypt,generateEllipticShareKey,verifyMessage } from "../lib/cr";
import { messages } from "./message";
import { peer } from "./peer";
import { subscribe } from "svelte/internal";

const UpdateType = {
    newChat:0,
    chatAccepted:1,
    chatRejected:2,
    newMessage:3
}
function updateHandler(e){

    let update = JSON.parse(e.data);
    let {type,data,_id} = update;
    console.log(update);
    switch(type){
        case UpdateType.newChat:
            chats.update(x=>{
                data.chat["chatId"] = data.chat["_id"]
                delete data.chat["_id"];
                x[data.chat["chatId"]] = data.chat;
                return {
                    ...x,
                }
            })
            toast.push("new chat request recived",{theme:{
                '--toastBackground': '#4bb543',
                '--toastColor': 'black',
            }});
            break;
        case UpdateType.newMessage:
            let u = user.getUser();
            let msg = data;
            if(peer.getChatId() === msg.chat){
                
                peer.decryptMessage(msg);
                messages.add(msg);
            }
            else{
                let ch = chats.getChat(msg.chat);
                console.log(ch);
                toast.push("new message from ",{theme:{
                    '--toastBackground': '#3c3c3b',
                    '--toastColor': 'black'
                }});
            }
                
            
            break;
        case UpdateType.chatAccepted:
            chats.update(x=>{
                x[data.chatId].private.status = PvChatStatus.accepted;
                let peer_user = x[data.chatId].peers.find(a=>a.username !== user.getUser().username);
                toast.push("your request approved by "+peer_user.username,{theme:{
                    '--toastBackground': '#4bb543',
                    '--toastColor': 'black',
                }});
                return {
                    ...x
                }
            });
            break;
        case UpdateType.chatRejected:
            chats.refresh().then(()=>{
                toast.push("new chat request recived",{theme:{
                    '--toastBackground': '#4bb543',
                    '--toastColor': 'black',
                }});
            });
            break;
    }
}
export default updateHandler;