import { Router } from "express";
import cartManager from "../cartManager.js";

const cartsRouter = Router();

const CartManager = new cartManager("../carrito.json");

cartsRouter.post('/', async (req,res)=>{
    try {
        const carrito = await CartManager.createCart();
        res.status(201).send({ carrito });
    } catch (error) {
        res.status(400).send({ err }); 
    }
});

cartsRouter.get('/:cid', async (req, res)=>{
    const resultado = await CartManager.getProductsById(req.params.cid);
    res.send(resultado);
})

cartsRouter.get('/palabra/palabra', async (req, res)=>{
    console.log("estoy en palaba")
    const resultado = await CartManager.addProductToCart();
    res.send(resultado);
})

export {cartsRouter};