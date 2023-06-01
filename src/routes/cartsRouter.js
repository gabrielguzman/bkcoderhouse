import { Router } from "express";
//import cartManager from "../cartManager.js";
import cartService from "../services/cart.service.js";

const cartsRouter = Router();

cartsRouter.get('/', async(req,res)=>{
    try {
        const carts = await cartService.getCarts();
        res.status(201).send({carts});
    } catch (error) {
        res.status(400).send(`${error}`); 
    }
});


cartsRouter.post('/', async (req,res)=>{
    try {
        const cart = await cartService.createCart();
        res.status(201).send({ cart });
    } catch (error) {
        res.status(400).send(`${error}`); 
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res)=>{
    try{
        const product = await cartService.addProductToCart(req.params.cid,req.params.pid);
        res.status(201).send({"Agregado-Resultado":{product}});
    }catch(error){
        res.status(400).send(`${error}`);
    }
})

cartsRouter.delete('/:cid/product/:pid', async(req,res)=>{
    try {
        const product = await cartService.removeProductFromCart(req.params.cid,req.params.pid);
        res.status(201).send({product});
    } catch (error) {
        res.status(400).send(`${error}`);
    }
})



/* const CartManager = new cartManager("./carrito.json");

cartsRouter.get('/', async (req,res)=>{
    try {
        const carritos = await CartManager.getCartsProducts();
        res.status(201).send({ carritos });
    } catch (error) {
        res.status(400).send(`${error}`); 
    }
});

cartsRouter.post('/', async (req,res)=>{
    try {
        const carrito = await CartManager.createCart();
        res.status(201).send({ carrito });
    } catch (error) {
        res.status(400).send(`${error}`); 
    }
});

cartsRouter.get('/:cid', async (req, res)=>{
    try {
        const productos = await CartManager.getProductsById(req.params.cid);
        res.status(201).send(productos);
    } catch (error) {
        res.status(400).send(`${error}`); 
    }
})

cartsRouter.post('/:cid/product/:pid', async (req, res)=>{
    try{
        const resultado = await CartManager.addProductToCart(req.params.cid,req.params.pid);
        res.status(201).send({"Agregado-Resultado":{resultado}});
    }catch(error){
        res.status(400).send(`${error}`);
    }
})

cartsRouter.delete('/:cid/product/:pid', async (req, res)=>{
    try{
        const resultado = await CartManager.removeProductFromCart(req.params.cid,req.params.pid);
        res.status(201).send({"IDproductoBorrado": (req.params.pid),"resultado":{resultado}});
    }catch(error){
        res.status(400).send(`${error}`);
    }
})
 */
export {cartsRouter};