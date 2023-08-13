import { writable } from "svelte/store";
import { user } from "./user";
import { chats } from "./chat";
import { aesDecrypt,signMessage,aesEncrypt,generateEllipticShareKey,sha256, verifyMessage } from "../lib/cr";

function peerAdaptor(){
    let peer = null;
    let chatId;
    let audience;
    let current_user;
    let psk;
    user.subscribe(x=>{
        current_user = x;
        if(current_user){
            if(current_user.masterKey){
                let pub = audience.publicKey;
                let prv = aesDecrypt(current_user.masterKey,current_user.private);
                psk = generateEllipticShareKey(prv,pub);
            }
        }else
            return;
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
        if(p != null && p != undefined && !Object.is(p,{}) ){
            chatId = p["chatId"];
            audience = p.peers.find(x=>x.username !== current_user.username);
            localStorage.setItem("Peer",JSON.stringify(p));
        }
    });

    return {
        subscribe,
        update,
        sendMessage:async (content)=>{
            if(chatId){
                if(audience){
                    let prvElip = aesDecrypt(current_user.masterKey,current_user.private);
                    let psk = generateEllipticShareKey(prvElip,audience.publicKey);
                    console.log("psk: "+psk);
                    let msg = {
                        content
                    }
                    signMessage(msg,psk);
                    msg.content = aesEncrypt(psk,content);
                    let result = await fetch("/api/message/send",{
                        body:JSON.stringify({chatid:chatId,...msg}),
                        method:"POST",
                        cache: "no-cache",
                        headers: {
                            "Content-Type": "application/json",
                            "jwt-access-token":current_user.jwt
                        }
                    });
                    return await result.json();
                }else{
                    throw new Error("empty audience");
                }
            }else{
                throw new Error("invalid chatid");
            }
        },
        decryptMessage:(msg)=>{
            if(psk){
                msg.content = aesDecrypt(psk,msg.content);
                if(!verifyMessage(msg,psk))
                    msg.content = "invalid message signiture";
            }else{
                console.log("invalid psk");
            }
        },
        setChatId:(cid)=>{
            let chlist = chats.getChats();
            if(chlist && chlist.hasOwnProperty(cid)){
                set(chlist[cid]);
            }
        },
        getChatId:()=>{
            return chatId;
        },
        set
    }
}

export const peer = peerAdaptor();
