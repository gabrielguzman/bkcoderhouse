import { Router } from "express";
import ProductManager from "../productManager.js";

const viewsRouter = Router();
const productManager = new ProductManager('./productos.json');


viewsRouter.get('/', async (req,res)=>{
    const products = await productManager.getProducts();
    res.render('home', {products});
})

export {viewsRouter};