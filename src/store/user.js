import { writable } from "svelte/store";


function createUser() {
    let u = null;
    u = localStorage.getItem("User");
    if(u != null) 
        u = JSON.parse(u);
	const { subscribe, set, update } = writable(u);
    subscribe(user =>{
        if(user != null){
            u = user;
            localStorage.setItem("User",JSON.stringify(user));
        }
    });
	return {
		subscribe,
		register: async (name,username,password,email) => {
            if(u == null){
                let result = await fetch("/api/auth/signup",{
                    body:JSON.stringify({name,username,password,email}),
                    method:"POST",
                    mode: "cors", // no-cors, *cors, same-origin
                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                let response = await result.json();
                if(response.ok)
                {
                    set({
                        name,
                        username,
                        email,
                        uuid:response.uuid,
                        verify:false
                    });
                    return response.message;
                }else
                    throw new Error(response.error);
            }else
                throw new Error("please logout first");
        },
        verify: async (code)=> {
            if(u != null && u.hasOwnProperty("uuid")){
                let result = await fetch("/api/auth/verify",{
                    body:JSON.stringify({code,uuid:u.uuid}),
                    method:"POST",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                let response = await result.json();
                if(response.ok){
                    set({...u,verify:true});
                }else{
                    if(response.error === "your email address already verified")
                        set({...u,verify:true});
                    throw new Error(response.error);
                }
            }else
                throw new Error("please register first");
        },
        resendCode: async ()=>{
            if(u != null)
            {
                let result = await fetch("/api/auth/resend/code",{
                    body:JSON.stringify({uuid:u.uuid}),
                    method:"POST",
                    mode: "cors", // no-cors, *cors, same-origin
                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                let response = await result.json();
                if(response.ok){
                    return response.message;
                }else{
                    throw new Error(response.error);
                }
            }else{
                throw new Error("your registration data not available!");
            }
        },
		login: async (password,username) => {
            if(u != null)
            {
                let result = await fetch("/api/auth/login",{
                    body:JSON.stringify({username:u.username,password}),
                    method:"POST",
                    mode: "cors", // no-cors, *cors, same-origin
                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                let response = await result.json();
                if(response.ok)
                {
                    update(user=>user.jwt = response.token);
                    localStorage.setItem("User",JSON.stringify(u));
                }else
                    throw new Error(response.error);
            }else{
                let result = await fetch("/api/auth/login",{
                    body:JSON.stringify({username,password}),
                    method:"POST",
                    mode: "cors", // no-cors, *cors, same-origin
                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                let response = await result.json();
                if(response.ok)
                {
                    update(user=> user = {jwt:response.token});
                    result = await fetch("/api/user/me",{
                        method:"GET",
                        mode: "cors", // no-cors, *cors, same-origin
                        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                        headers: {
                            "Content-Type": "application/json",
                            "jwt-access-token":u.jwt
                        }
                    });
                    response = await result.json();
                    if(response.ok){
                        update(user=> user = {...u,...response.data});
                        localStorage.setItem("User",JSON.stringify(u));
                    }else{
                        throw new Error(response.error);
                    }
                }else
                    throw new Error(response.error);
            }
        },
        logout: () => {
            if(u != null)
                u = null;
            localStorage.clear();
        },
        check: async () => {
            if(u == null)
                return "register";
            if(!u.hasOwnProperty("jwt"))
                return "login";
            let result = await fetch("/api/user/me",{
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                    "Content-Type": "application/json",
                    "jwt-access-token":u.jwt
                }
            });
            let response = await result.json();
            return response.ok;
        }
	};
}

export const user = createUser();