import { createStripeCheckoutSession } from "../libs/stripe"
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