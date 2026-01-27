import { RequestHandler } from "express";
import { getStripeSecretKey } from "../../utils/get-stripe-secret-key";
import { log } from "node:console";
import { getConstructEvent } from "../libs/stripe";
import { updateOrderStatus } from "../services/order";

export const stripe: RequestHandler = async (req , res) => {
    const sig = req.headers['stripe-signature'] as string
    const webhookKey = getStripeSecretKey()
    const rawBody = req.body

    const event = await getConstructEvent(rawBody, sig, webhookKey)
    if(event){
        const session = event.data.object as any
        const orderId = parseInt(session.metadata?.orderId)

        switch(event.type){
            case 'checkout.session.completed':
            case 'checkout.session.async_payment_succeeded':
                await updateOrderStatus(orderId, 'paid')
                break
            case 'checkout.session.expired':
            case 'checkout.session.async_payment_failed':
                await updateOrderStatus(orderId, 'cancelled')
                break
        }
    }
    
    res.json({
        error: null
    })
}