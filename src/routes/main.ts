import { Router } from "express";
import * as bannerController from "../controllers/banner"
import * as productsController from "../controllers/products"
import * as categoryController from "../controllers/category"

export const routes = Router()

routes.get('/ping', (req, res)=> {
    res.json({ pong: true })
})

routes.get('/banners', bannerController.getBanners)
routes.get('/products', productsController.getProducts)
routes.get('/products/:id', productsController.getProduct)
routes.get('/products/:id/related', productsController.getProductsRelated)
routes.get('/category/:slug/metadata', categoryController.getCategoryMetadata)