import { writable } from "svelte/store";
import { user } from "./user";
import { onDestroy } from "svelte";

export const chatType ={
    private:0,
    group:1,
    channel:2,
    me:3
};

export const PvChatStatus = {
    pending:0,
    accepted:1,
    rejected:2
}
function chatsAdaptor(){
    let chats = null;
    let current_user;
    user.subscribe(x=>{
        current_user = x;
    })
    chats = localStorage.getItem("Chats");
    if(chats != null) 
        chats = JSON.parse(chats);
    else
        chats = {};
    const { 
        subscribe,
        set,
        update
    } = writable(chats);

    subscribe(c=>{
        if(c != null && c != undefined){
            chats = c;
            localStorage.setItem("chats",JSON.stringify(c));
        }
    });
    return {
        subscribe,
        request:async (identifer)=>{
            let result = await fetch("/api/chat/request",{
                body:JSON.stringify({identifer}),
                method:"POST",
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                    "Content-Type": "application/json",
                    "jwt-access-token":current_user.jwt
                }
            });
            let response = await result.json();
            if(response.ok){
                response.chat["chatId"] = response.chat["_id"];
                delete response.chat["_id"];
                update(x=>{
                    x[response.chat["chatId"]] = response.chat;
                    return {
                        ...x
                    };
                })
                return response.message;
            }
            else
                throw new Error(response.error);
        },
        feedback:async (accept,chatId)=>{
            let result = await fetch("/api/chat/feedback",{
                method:"POST",
                body:JSON.stringify({accept,chatId}),
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                    "Content-Type": "application/json",
                    "jwt-access-token":current_user.jwt
                }
            });
            let response = await result.json();
            if(response.ok){
                chats[chatId].private.status = accept ? PvChatStatus.accepted : PvChatStatus.rejected;
                update(c=>{
                    return {
                        ...c,
                        ...chats
                    }
                });
            }
            else
                throw new Error(response.error);
            
        },
        refresh:async ()=>{
            let result = await fetch("/api/chat/list",{
                method:"GET",
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                    "Content-Type": "application/json",
                    "jwt-access-token":current_user.jwt
                }
            });
            let response = await result.json();
            if(response.ok)
            {
                chats  = {};
                response.chats.forEach(chat=>{
                    let cid = chat["_id"];
                    delete chat["_id"];
                    chats[cid] = {
                        ...chat,
                        chatId:cid
                    };
                });
                set(chats);
            }
        },
        getChats:()=>{
            return chats;
        },
        getChat:(chatid)=>{
            return chats[chatid];
        },
        update,
    }
}

export const chats = chatsAdaptor();