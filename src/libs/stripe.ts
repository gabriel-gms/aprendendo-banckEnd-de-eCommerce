import Stripe from "stripe"
import { getOneProduct } from "../services/products"
import { CartItem } from "../types/CartItem"
import { getStripeSecretKey } from "../../utils/get-stripe-secret-key"
import { getFrontEndUrl } from "../../utils/get-front-end-url"

export const stripe = new Stripe(getStripeSecretKey())

type StripeCheckoutSessionParams = {
    cart: CartItem[],
    shippingCost: number,
    orderId: number
}
export const createStripeCheckoutSession = async ({cart, shippingCost, orderId}: StripeCheckoutSessionParams) => {
    let stripeLineItems = []
    for(let item of cart){
        const product = await getOneProduct(item.productId)
        if(product){
            stripeLineItems.push({
                price_data: {
                    product_data: {
                        name: product.label
                    },
                    currency: "BRL",
                    unit_amount: Math.round(product.price * 100)
                },
                quantity: item.quantity
            })
        }
    }

    if(shippingCost > 0){
        stripeLineItems.push({
            price_data: {
                product_data: {
                    name: "Frete"
                },
                currency: "BRL",
                unit_amount: Math.round(shippingCost * 100)
            },
            quantity: 1
        })
    }

    const session = await stripe.checkout.sessions.create({
        line_items: stripeLineItems,
        mode: "payment",
        metadata: { orderId: orderId.toString() },
        success_url: `${getFrontEndUrl()}/cart/success?session_id={CHECKOUT_SESSION-ID}`,
        cancel_url: `${getFrontEndUrl()}/my-orders`
    })

    return session
}