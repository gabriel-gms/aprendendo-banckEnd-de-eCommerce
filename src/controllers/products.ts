import { RequestHandler } from "express";
import * as productsServices from "../services/products"
import { getProductSchema } from "../schemas/get-product-schema";
import { getAbsoluteImageUrl } from "../../utils/get-absolute-image-url";
import { safeParse } from "zod";
import { getOneProductSchema } from "../schemas/get-one-product-schema";
import { getCategory } from "../services/category";

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

export const getProduct: RequestHandler = async (req , res) => {
    const parseResult = getOneProductSchema.safeParse(req.params)
    if(!parseResult.success){
        res.status(404).json({error: "Parâmetros errados"})
        return
    }
    const {id} = parseResult.data

    const product = await productsServices.getOneProduct(parseInt(id))

    if(!product){
        res.json({ error: "produto não encontrado" })
        return
    }

    const productWithAbsoluteImages = {
        ...product,
        images: product.images.map(img => getAbsoluteImageUrl(img))
    }

    const category = await getCategory(product.categoryId)

    await productsServices.incrementProductView(product.id)

    res.status(200).json({
        error: null,
        product: productWithAbsoluteImages,
        category
    })
}