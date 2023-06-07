import { Router } from "express";
import productService from "../services/product.service.js";

const productsRouterV2 = Router();

productsRouterV2.get("/", async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sort,
    query,
    category,
    availability,
  } = req.query;

  try {
    const result = await productService.getPaginatedProducts(
      query,
      page,
      limit,
      sort,
      category,
      availability
    );

    const totalPages = result.totalPages;
    const currentPage = result.page;
    const hasNextPage = result.hasNextPage;
    const hasPrevPage = result.hasPrevPage;

    let prevPage = null;
    if (hasPrevPage) {
      prevPage = currentPage - 1;
    }

    let nextPage = null;
    if (hasNextPage) {
      nextPage = currentPage + 1;
    }

    let prevLink = null;
    if (hasPrevPage) {
      prevLink = `${req.baseUrl}?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}&category=${category}&availability=${availability}`;
    }

    let nextLink = null;
    if (hasNextPage) {
      nextLink = `${req.baseUrl}?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}&category=${category}&availability=${availability}`;
    }

    res.json({
      status: "success",
      payload: result.docs,
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      payload: [],
      totalPages: 0,
      prevPage: null,
      nextPage: null,
      page: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevLink: null,
      nextLink: null,
    });
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
