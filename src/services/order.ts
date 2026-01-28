import { tr } from "zod/v4/locales"
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

export const getUserOrders = async (userId: number) => {
    return await prisma.order.findMany({
        where: { userId },
        select: {
            id: true,
            status: true,
            total: true,
            createdAt: true
        },
        orderBy: { createdAt: 'desc' }
    })
}

export const getOrderById = async (id: number, userId: number) => {
    const order = await prisma.order.findFirst({
        where: { id, userId },
        select: {
            id: true,
            status: true,
            total: true,
            shippingCity: true,
            shippingComplement: true,
            shippingCost: true,
            shippingCountry: true,
            shippingDays: true,
            shippingNumber: true,
            shippingState: true,
            shippingStreet: true,
            shippingZipCode: true,
            createdAt: true,
            orderItems: {
                select: {
                    id: true,
                    quantity: true,
                    price: true,
                    product: {
                        select: {
                            id: true,
                            label: true,
                            price: true,
                            images: {
                                take: 1,
                                orderBy: {id: 'asc'}
                            }
                        }
                    }
                }
            }
        }
    })
    if(!order){
        return null
    }

    return {
        ...order,
        orderItems: order.orderItems.map(item => ({
            ...item,
            product: {
                ...item.product,
                image: item.product.images[0] ? `media/products/${item.product.images[0].url}` : null,
                images: undefined
            }
        }))
    }
}