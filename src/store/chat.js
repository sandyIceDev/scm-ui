import { writable } from "svelte/store";
import { user } from "./user";
import { onDestroy } from "svelte";

export const chatType ={
    private:0,
    group:1,
    channel:2,
    me:3
};

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
        chats = [];
    const { 
        subscribe,
        set,
        update
    } = writable(chats);

    subscribe(c=>{
        chats = c;
        localStorage.setItem("chats",JSON.stringify(c));
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
            if(response.ok)
                return response.message;
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
                update(c=>{
                    return response.chats.map(chat=>{
                       chat["chatId"] = chat["_id"];
                       delete chat["_id"];
                       return chat;
                    });
                });
            }
            else{

            }
        }
    }
}

export const chats = chatsAdaptor();