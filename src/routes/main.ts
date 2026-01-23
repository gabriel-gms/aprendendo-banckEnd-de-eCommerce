import { Router } from "express";
import * as bannerController from "../controllers/banner"
import * as productsController from "../controllers/products"
import * as categoryController from "../controllers/category"
import * as cartController from "../controllers/cart"
import * as userController from "../controllers/user"
import { authMid } from "../middleware/auth";

export const routes = Router()

routes.get('/ping', (req, res)=> {
    res.json({ pong: true })
})

routes.get('/banners', bannerController.getBanners)
routes.get('/products', productsController.getProducts)
routes.get('/products/:id', productsController.getProduct)
routes.get('/products/:id/related', productsController.getProductsRelated)
routes.get('/category/:slug/metadata', categoryController.getCategoryMetadata)
routes.post('/cart/mount', cartController.postCartMount)
routes.get('/cart/shipping', cartController.getShipping)
routes.post('/cart/finish', authMid, cartController.finishCart)
routes.post('/user/register', userController.userLogOn)
routes.post('/user/login', userController.userLogIn)
routes.post('/user/address', authMid, userController.postUserAddress)
routes.get('/user/address', authMid, userController.getUserAddress)
routes.post('/cart/finish', authMid, cartController.finishCart)