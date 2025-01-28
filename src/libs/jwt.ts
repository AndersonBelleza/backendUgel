import * as jwt from 'jsonwebtoken'
import {TOKEN_SECRET} from '../config'

export function crearLlaveAcceso(payload: any){
    return new Promise( (resolve, reject) =>{
        jwt.sign(
            payload,
            TOKEN_SECRET,
            {
                expiresIn: "1d",
            },
            (err, token)=>{
                if(err) reject(err);
                resolve(token)
            }
        )
    }) 
}


export function decryptKey(token:string):any{
    try{
        const t = jwt.verify(token,TOKEN_SECRET);
        return t;
    }catch(err){
        console.error("Ocurrion un error: ", err );
    }
}   