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
        sendMessage:async (content)=>{
            if(chat){
                let result = await fetch("/api/message/send",{
                    body:JSON.stringify({chatid:chat.chatId,content}),
                    method:"POST",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                        "jwt-access-token":current_user.jwt
                    }
                });
                return await result.json();
            }else{
                throw new Error("invalid chatid");
            }
        },
        refresh:async ()=>{
            if(chat){
                let result = await fetch("/api/message/list",{
                    method:"GET",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                        "jwt-access-token":current_user.jwt
                    }
                });
                let res = await result.json();
                for(let message in res.chats){
                    let mid = message["_id"];
                    delete message["_id"];
                    message[mid] = mid;
                    messages[mid] = message;
                }
                set(messages);
            }else{
                throw new Error("invalid chatid");
            }
        },
        set
    }
}

export const messages = messageAdaptor();
