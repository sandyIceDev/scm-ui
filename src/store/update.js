import { toast } from "@zerodevx/svelte-toast";
import { PvChatStatus, chats } from "./chat";
import { user } from "./user";
import { messages } from "./message";

const UpdateType = {
    newChat:0,
    chatAccepted:1,
    chatRejected:2,
    newMessage:3
}
function updateHandler(e){
    let update = JSON.parse(e.data);
    let {type,data,_id} = update;
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
            messages.refresh();
            break;
        case UpdateType.chatAccepted:
            let chatItemPeer;
            chats.update(x=>{
                    x[data.chatId].private.status = PvChatStatus.accepted;
                    chatItemPeer = x[data.chatId].peers.find(x=>x.username != user.getUser().username);
                    return {
                        ...x
                    }
            });
            if(chatItemPeer && chatItemPeer.hasOwnProperty("username")){
                toast.push("your request approved by "+chatItemPeer.username,{theme:{
                    '--toastBackground': '#4bb543',
                    '--toastColor': 'black',
                }});
            }
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