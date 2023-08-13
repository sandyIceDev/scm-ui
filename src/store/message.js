import { writable } from "svelte/store";
import { user } from "./user";
import { peer } from "./peer";

function messageAdaptor(){
    let messages = {};
    let chat;
    let current_user;
    const { 
        subscribe,
        set,
        update
    } = writable(messages);

    peer.subscribe(x=>{
        chat = x;
    });
    
    user.subscribe(u=>{
        current_user = u;
    });

    return {
        subscribe,
        update,
        add:(msg)=>{
            let mid = msg["_id"];
            delete msg["_id"];
            messages[mid] = msg;
            set(messages);
        },
        refresh:async ()=>{
            if(chat){
                let result = await fetch("/api/message/list",{
                    method:"POST",
                    cache: "no-cache",
                    body:JSON.stringify({chatid:chat.chatId}),
                    headers: {
                        "Content-Type": "application/json",
                        "jwt-access-token":current_user.jwt
                    }
                });
                let res = await result.json();
                res.forEach(message=>{
                    let mid = message["_id"];
                    delete message["_id"];
                    messages[mid] = message;
                });
                set(messages);
            }else{
                throw new Error("invalid chatid");
            }
        },getMessage:(mid)=>{
            if(messages.hasOwnProperty(mid))
                return messages[mid];
            return null;
        },
        set
    }
}

export const messages = messageAdaptor();
