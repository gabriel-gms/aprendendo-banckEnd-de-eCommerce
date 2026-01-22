import { NextFunction, Request, Response } from "express";
import { getIdUserToken } from "../services/user";

export const authMid = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers['authorization']
    if(!header){
        res.json({ error: "acesso negado, sem header de token" })
        return
    }

    const token = header.split(" ")[1]
    if(!token[1]){
        res.json({ error: "token inexistente" })
        return
    }
    
    const userId = await getIdUserToken(token)
    if(!userId){
        res.json({ error: "Acesso negado, sem token" })
        return
    }

    (req as any).userId = userId
    next()
}