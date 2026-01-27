import { prisma } from "../libs/prisma"
import { Address } from "../types/Address"
import { CartItem } from "../types/CartItem"
import { getOneProduct } from "./products"

type CreateOrderParams = {
    userId: number,
    address: Address,
    shippingCost: number,
    shippingDays: number,
    cart: CartItem[]
}
export const createOrder = async({userId, address, shippingCost, shippingDays, cart}: CreateOrderParams) => {
    let subTotal = 0
    let orderItems = []

    for(let cartItem of cart){
        const product =  await getOneProduct(cartItem.productId)
        if(product){
            subTotal += product.price * cartItem.quantity
            orderItems.push({
                productId: product.id,
                quantity: cartItem.quantity,
                price: product.price
            })
        }
    }

    let total = subTotal + shippingCost

    const order = await prisma.order.create({
        data: {
            userId,
            total,
            shippingCost,
            shippingDays,
            shippingZipCode: address.zipcode,
            shippingStreet: address.street,
            shippingNumber: address.number,
            shippingCity: address.city,
            shippingState: address.state,
            shippingCountry: address.country,
            shippingComplement: address.complement,
            orderItems: { create: orderItems }
        }
    })
    if(!order){
        return null
    }

    return order.id
}

export const updateOrderStatus = async (orderId: number, status: 'paid' | 'cancelled') => {
    await prisma.order.update({
        where: { id: orderId },
        data: { status }
    })
}