import { createStripeCheckoutSession, getStripeCheckoutSession } from "../libs/stripe"
import { CartItem } from "../types/CartItem"

type CreatePaymentLinkParams = {
    cart: CartItem[],
    shippingCost: number,
    orderId: number
}
export const createPaymentLink = async ({cart, shippingCost, orderId}: CreatePaymentLinkParams) => {
    try {
        const session = await createStripeCheckoutSession({ cart, shippingCost, orderId })
        if(!session.url){
            return null
        }
        return session.url
    } catch {
        return null
    }
}

export const getOrderIdFromSession = async (session_id: string) => {
    try {
        const session = await getStripeCheckoutSession(session_id)
        const orderId = session.metadata?.orderId
        if(!orderId){
            return null
        }
    
        return parseInt(orderId)
    } catch {
        return null
    }
}