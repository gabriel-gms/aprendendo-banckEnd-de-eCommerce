import { RequestHandler } from "express";
import * as productsServices from "../services/products"
import { getProductSchema } from "../schemas/get-product-schema";
import { getAbsoluteImageUrl } from "../../utils/get-absolute-image-url";

export const getProducts: RequestHandler = async (req , res) => {
    const parseResult = getProductSchema.safeParse(req.query)
    if(!parseResult.success){
        res.status(400).json({error: 'parâmetros inválidos'})
        return
    }
    const {metadata, orderBy, limit} = parseResult.data
    
    const parsedLimit = limit ? parseInt(limit) : undefined
    const parsedMetadata = metadata ? JSON.parse(metadata) : undefined

    const products = await productsServices.getAllProducts({
        medata: parsedMetadata,
        order: orderBy,
        limit: parsedLimit
    })

    const productsWithAbsoluteUrl = products.map(product => ({
        ...product,
        image: product.image? getAbsoluteImageUrl(product.image) : null,
        liked: false
    }))

    res.json({
        error: null,
        products: productsWithAbsoluteUrl
    })
}