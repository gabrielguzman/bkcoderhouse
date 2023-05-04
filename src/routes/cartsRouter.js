import { Router } from "express";

const cartsRouter = Router();


cartsRouter.get('/', (req,res)=>{
    res.send("estoy en carrito");
});

export {cartsRouter};