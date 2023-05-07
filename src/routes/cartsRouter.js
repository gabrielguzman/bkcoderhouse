import { Router } from "express";
import cartManager from "../cartManager.js";

const cartsRouter = Router();

const CartManager = new cartManager("./carrito.json");

cartsRouter.post('/', async (req,res)=>{
    try {
        const carrito = await CartManager.createCart();
        res.status(201).send({ carrito });
    } catch (error) {
        res.status(400).send( error ); 
    }
});

cartsRouter.get('/:cid', async (req, res)=>{
    try {
        const productos = await CartManager.getProductsById(req.params.cid);
        res.status(201).send(productos);
    } catch (error) {
        res.status(400).send(error); 
    }
})

cartsRouter.post('/:cid/producto/:pid', async (req, res)=>{
    try{
        const resultado = await CartManager.addProductToCart(req.params.cid,req.params.pid);
        res.status(201).send(resultado);
    }catch(error){
        res.status(400).send(error);
    }
})

export {cartsRouter};