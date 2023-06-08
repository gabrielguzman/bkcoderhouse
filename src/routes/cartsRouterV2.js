import { Router } from "express";
import cartService from "../services/cart.service.js";

const cartsRouterV2 = Router();

//obtener todos los carritos y sus productos.
cartsRouterV2.get("/", async (req, res) => {
  try {
    const carts = await cartService.getCarts();
    res.status(201).send({ carts });
  } catch (error) {
    res.status(400).send(`${error}`);
  }
});

//obtener los productos de un carrito en particular
cartsRouterV2.get("/:cid", async (req,res)=>{
  try {
    const cart = await cartService.getCartContents(req.params.cid);
    res.send(cart);
  } catch (error) {
    res.status(400).send(`${error}`);
  }
});

//crear un carrito
cartsRouterV2.post("/", async (req, res) => {
  try {
    const cart = await cartService.createCart();
    res.status(201).send({ cart });
  } catch (error) {
    res.status(400).send(`${error}`);
  }
});

//agregar un producto a un carrito
cartsRouterV2.post("/:cid/product/:pid", async (req, res) => {
  try {
    const product = await cartService.addProductToCart(
      req.params.cid,
      req.params.pid
    );
    res.status(201).send({ "Agregado-Resultado": { product } });
  } catch (error) {
    res.status(400).send(`${error}`);
  }
});

//actualizar la cantidad de un producto.
cartsRouterV2.put("/:cid/product/:pid", async (req,res)=>{
  try {

    const { quantity } = req.body;
    const quantityInt = parseInt(quantity);
    
    if (isNaN(quantityInt)) {
      throw new Error('La cantidad proporcionada no es válida');
    }
   
    const cartUpdated = await cartService.updateProductQuantityFromCart(req.params.cid, req.params.pid, quantityInt);
    res.status(201).send({cartUpdated})
  } catch (error) {
    res.status(400).send(`${error}`);
  }
});

//eliminar un producto del carrito
cartsRouterV2.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const product = await cartService.removeProductFromCart(
      req.params.cid,
      req.params.pid
    );
    res.status(201).send({ product });
  } catch (error) {
    res.status(400).send(`${error}`);
  }
});

//eliminar todos los productos de un carrito
cartsRouterV2.delete("/:cid", async(req,res)=>{
  try {
    const cart = await cartService.clearCart(req.params.cid);
    res.status(201).send({cart});
  } catch (error) {
    res.status(400).send(`${error}`);
  }
});

//agregar producto/s mediante un array por body
cartsRouterV2.put("/:cid", async(req,res)=>{
  try {
    const {products} = req.body;
    const updatedCart = await cartService.updateCart(req.params.cid, products);
    res.status(201).send({updatedCart});
  } catch (error) {
    res.status(400).send(`${error}`);
  }
});

export { cartsRouterV2 };
