import { RequestHandler } from "express";
import { getCategoryBySlug, getCategoryMetadataServices } from "../services/category";

export const getCategoryMetadata: RequestHandler = async (req , res) => {
    const { slug } = req.params

    const category = await getCategoryBySlug(slug)
    if(!category){
        res.json({ error: "Categoria não encontrada ou inexistente" })
        return
    }

    const metadata = await getCategoryMetadataServices(category.id)

    res.json({ error: null , category: category, metadata: metadata })
}