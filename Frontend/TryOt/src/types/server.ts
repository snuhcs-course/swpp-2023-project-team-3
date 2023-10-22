

export interface RequestTypes {
    post :{
        login : {
            username : string,
            password : string
        },
        register : {
            username : string,
            email : string,
            nickname : string,
            gender : 'male' | 'female',
            age : number,
            password : string
        },
        autoLogin :{
            token : string
        }
    },
    delete : {

    },
    get : {
        
    }
}

export interface ResponseTypes {
    post : {
        login : {
            token : string,
        },
        register: {
        },
        autoLogin : {
            username : string,
            email : string,
            nickname : string,
            gender : 'male' | 'female',
            age : number
        },
    },
    delete : {

    },
    get : {
        
    }
}

export type Methods = "post" | "get" | "delete"