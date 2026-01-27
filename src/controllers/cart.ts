import { RequestHandler } from "express";
import { getIdProductForCart } from "../schemas/get-id-products-for-cart";
import { getOneProduct } from "../services/products";
import { getAbsoluteImageUrl } from "../../utils/get-absolute-image-url";
import { getZipcodeUser } from "../schemas/get-zipcode-user";
import { cartFinish } from "../schemas/cart-finish";
import { getAddressById } from "../services/user";
import { createOrder } from "../services/order";
import { Address } from "../types/Address";
import { createPaymentLink } from "../services/payment";

export const postCartMount: RequestHandler = async (req , res) => {
    const parseResultId = getIdProductForCart.safeParse(req.body)
    if(!parseResultId.success){
        res.json({ error: "Corpo da requisição inválido" })
        return
    }
    const { ids } = parseResultId.data

    const productsCart = []
    for(let id of ids){
        const product = await getOneProduct(id)
        if(product){
            productsCart.push({
                id: product.id,
                label: product.label,
                price: product.price,
                image: product.images[0] ? getAbsoluteImageUrl(product.images[0]) : null
            })
        }
    }

    res.json({
        error: null,
        products: productsCart
    })
}

export const getShipping: RequestHandler = async (req , res) => {
    const parseResult = getZipcodeUser.safeParse(req.query)
    if(!parseResult.success){
        res.json({ error: "Query errada" })
        return
    }
    const { zipcode } = parseResult.data
    
    res.json({
        error: null,
        zipcode: zipcode,
        cost: 0,
        days: 0
    })
}

export const finishCart: RequestHandler = async (req , res) => {
    const userId = (req as any).userId

    const parseResult = cartFinish.safeParse(req.body)
    if(!parseResult.success){
        res.json({ error: "Body errado" })
        return
    }
    const { cart, addressId } = parseResult.data

    const address = await getAddressById(userId, addressId)
    if(!address){
        res.json({ error: "Não existe address" })
        return
    }

    const shippingCost = 7
    const shippingDays = 3

    const orderId = await createOrder({
        userId,
        address,
        shippingCost,
        shippingDays,
        cart
    })

    if(!orderId){
        res.json({ error: 'ocorreu um erro' })
        return
    }

    let url = await createPaymentLink({ cart, shippingCost, orderId })
    if(!url){
        res.json({ error: 'ocorreu um erro' })
    }

    res.json({
        error: null,
        url
    })
}