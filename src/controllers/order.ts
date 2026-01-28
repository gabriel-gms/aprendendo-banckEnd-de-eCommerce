import { RequestHandler } from "express";
import { getOrderSessionIdSchema } from "../schemas/get-order-session-id-schema";
import { getOrderIdFromSession } from "../services/payment";
import { getOrderById, getUserOrders } from "../services/order";
import { getOrderSchema } from "../schemas/get-order-schema";
import { getAbsoluteImageUrl } from "../../utils/get-absolute-image-url";

export const getOrderBySessionId: RequestHandler = async (req , res) => {
    const result = getOrderSessionIdSchema.safeParse(req.body)
    if(!result.success){
        res.json({ error: "Validação sem sucesso" })
        return
    }
    const { session_id } = result.data

    const orderId = await getOrderIdFromSession(session_id)
    if(!orderId){
        res.json({ error: "Não foi possível trazer o orderId" })
        return
    }
    
    res.json({
        error: null,
        orderId
    })
}

export const listOrders: RequestHandler = async (req , res) => {
    const userId = (req as any).userId
    if(!userId){
        res.json({ error: 'acesso negado' })
        return
    }

    const orders = await getUserOrders(userId)

    res.json({
        error: null,
        orders
    })
}

export const getOrder: RequestHandler = async (req , res) => {
    const userId = (req as any).userId
    if(!userId){
        res.json({ error: 'acesso negado' })
        return
    }

    const result = getOrderSchema.safeParse(req.params)
    if(!result.success){
        res.json({ error: 'Validação inválida' })
        return
    }

    const { id } = result.data

    const order = await getOrderById(parseInt(id), userId)
    if(!order){
        res.json({ error: 'pedido inexistente' })
        return
    }

    const items = order.orderItems.map(item => ({
        ...item,
        product: {
            ...item.product,
            image: item.product.image ? getAbsoluteImageUrl(item.product.image) : null
        }
    }))
    
    res.json({
        error: null,
        order: {
            ...order,
            orderItems: items
        }
    })
}