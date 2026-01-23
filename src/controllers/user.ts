import { RequestHandler } from "express";
import { registerUser } from "../schemas/register-user";
import * as userServices from "../services/user"
import { loginUserZod } from "../schemas/login-user-zod";
import { registerAddres } from "../schemas/register-address";

export const userLogOn: RequestHandler = async (req , res) => {
    const parseResultUser = registerUser.safeParse(req.body)
    if(!parseResultUser.success){
        res.json({ error: "Dados do body errados" })
        return
    }
    
    const userData = await userServices.postUserRegister(parseResultUser.data)

    res.json({
        error: null,
        user: userData
    })
}

export const userLogIn: RequestHandler = async (req , res) => {
    const parseResultUser = loginUserZod.safeParse(req.body)
    if(!parseResultUser.success){
        res.json({ error: "Dados do body errados" })
        return
    }
    const {email, password} = parseResultUser.data

    const userToken = await userServices.postUserLogin(email, password)
    req.headers.authorization = "Bearer "+userToken

    res.json({
        error: null,
        token: userToken
    })
}

export const postUserAddress: RequestHandler = async (req , res) => {
    const id = (req as any).userId

    const parseResultPostAddres = registerAddres.safeParse(req.body)
    if(!parseResultPostAddres.success){
        res.json({ error: "Dados do body errados" })
        return
    }

    const address = await userServices.postAddress(parseResultPostAddres.data, parseInt(id))

    res.json({
        error: null,
        address
    })
}

export const getUserAddress: RequestHandler = async (req, res) => {
    const id = (req as any).userId

    const address = await userServices.getAddress(id)

    res.json({
        error: null,
        addresses: {
            address
        }
    })
}