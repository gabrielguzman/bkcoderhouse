import { Router } from "express";
import cartService from "../services/cart.service.js";

const cartsRouterV2 = Router();

cartsRouterV2.get("/", async (req, res) => {
  try {
    const carts = await cartService.getCarts();
    res.status(201).send({ carts });
  } catch (error) {
    res.status(400).send(`${error}`);
  }
});

cartsRouterV2.post("/", async (req, res) => {
  try {
    const cart = await cartService.createCart();
    res.status(201).send({ cart });
  } catch (error) {
    res.status(400).send(`${error}`);
  }
});

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

export { cartsRouterV2 };
