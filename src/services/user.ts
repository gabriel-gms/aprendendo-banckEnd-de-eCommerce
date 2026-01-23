import { compare, hash } from "bcryptjs";
import { prisma } from "../libs/prisma"
import { uuid } from "zod";
import { v4 } from "uuid";
import { Address } from "../types/Address";

type User = {
    name: string;
    email: string;
    password: string;
}
export const postUserRegister = async ({name, email, password}: User) => {
    const emailVerication = await prisma.user.findFirst({
        where: { email }
    })
    if(emailVerication){
        return "Usuário já existe"
    }

    const hashPass = await hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name: name,
            email: email.toLowerCase(),
            password: hashPass
        }
    })

    if(!user){
        return "Nao foi possível criar o usuário"
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email
    }
}

export const postUserLogin = async (email: string, password: string) => {
    const userVerication = await prisma.user.findFirst({
        where: { email },
        select: {
            id: true,
            password: true,
            token: true
        }
    })
    if(!userVerication){
        return "User não existe, se cadastre"
    }

    const passVerification = await compare(password, userVerication.password)
    if(!passVerification){
        return "Email ou senha inválida"
    }

    await prisma.user.update({
        where: {
            id: userVerication.id
        },
        data: {
            token: v4()
        }
    })

    return userVerication.token
}

export const getIdUserToken = async (token: string) => {
    const user = await prisma.user.findFirst({
        where: {
            token
        },
        select: {
            id: true
        }
    })
    if(!user){
        return null
    }

    return user.id
}

export const postAddress = async (dataAddress: Address, id: number) => {
    const verifyAddress = await prisma.userAddress.findFirst({
        where: {
            ...dataAddress,
            userId: id
        }
    })
    if(verifyAddress){
        return "Você ja cadastrou esse endereço"
    }

    const userAddress = await prisma.userAddress.create({
        data: {
            ...dataAddress,
            userId: id
        }
    })
    if(!userAddress){
        return null
    }

    return {
        id: userAddress.id,
        zipcode: userAddress.zipcode,
        street: userAddress.street,
        number: userAddress.number,
        city: userAddress.city,
        state: userAddress.state,
        country: userAddress.country,
        complement: userAddress.complement
    }
}

export const getAddress = async (id: number) => {
    const address = await prisma.userAddress.findMany({
        where: {
            userId: id
        },
        select: {
            id: true,
            zipcode: true,
            street: true,
            number: true,
            city: true,
            state: true,
            country: true,
            complement: true,
        }
    })
    if(!address){
        return null
    }

    return address
}

export const getAddressById = async (userId: number, addressId: number) => {
    const addressUser = await prisma.userAddress.findFirst({
        where: { userId, id: addressId },
        select: {
            id: true,
            zipcode: true,
            street: true,
            number: true,
            city: true,
            state: true,
            country: true,
            complement: true
        }
    })
    return addressUser
}