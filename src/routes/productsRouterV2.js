import { Router } from "express";
import productService from "../services/product.service.js";

const productsRouterV2 = Router();

productsRouterV2.get("/", async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.send(products);
  } catch (error) {
    res.status(500).send({ error });
  }
});

productsRouterV2.post("/", async (req, res) => {
  try {
    const product = await productService.addProduct(req.body);
    res
      .status(201)
      .send({ "Se ha agregado producto correctamente": { product } });
  } catch (error) {
    res.status(500).send(`No se pudo agregar el producto ${error}`);
  }
});

productsRouterV2.get("/:pid", async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.pid);
    res.send(product);
  } catch (error) {
    res.status(500).send({ error });
  }
});

productsRouterV2.put("/:pid", async (req, res) => {
  try {
    await productService.updateProduct(req.params.pid, req.body);
    res.status(200).send("Se ha actualizado el producto correctamente");
  } catch (error) {
    res.status(500).send({ error });
  }
});

productsRouterV2.delete("/:pid", async (req, res) => {
  try {
    await productService.deleteProduct(req.params.pid);
    res.status(200).send("Se ha eliminado el producto");
  } catch (error) {
    res.status(500).send(`No se pudo eliminar el producto ${error}`);
  }
});

export { productsRouterV2 };
