import { writable } from "svelte/store";
import { user } from "./user";
import { chats } from "./chat";

function peerAdaptor(){
    let peer = null;
    let chatId;
    let current_user;
    user.subscribe(x=>{
        current_user = x;
    });
    
    peer = localStorage.getItem("Peer");
    if(peer != null) 
        peer = JSON.parse(peer);
    const { 
        subscribe,
        set,
        update
    } = writable(peer);

    chats.subscribe(x=>{
        if(chatId != null){
            console.log("---->");
            peer = x[chatId];
            update(p=>{
                return {
                    ...peer
                }
            })
        }
    });
    subscribe(p=>{
        peer = p;
        if(p != null && p != undefined && Object.is(p,{}) ){
            chatId = p["chatId"];
            localStorage.setItem("Peer",JSON.stringify(p));
        }
    });

    return {
        subscribe,
        update,
        sendMessage:async (content)=>{
            if(chatId){
                let result = await fetch("/api/message/send",{
                    body:JSON.stringify({chatid:chatId,content}),
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
        setChatId:(cid)=>{
            let chlist = chats.getChats();
            if(chlist && chlist.hasOwnProperty(cid)){
                set(chlist[cid]);
            }
        },
        set
    }
}

export const peer = peerAdaptor();
