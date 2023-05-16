import { Router } from "express";
import ProductManager from "../productManager.js";

const viewsRouter = Router();
const productManager = new ProductManager("./productos.json");

//ruta con handlebars
viewsRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    /* si quiero conseguir los productos por postman o por navegador puedo comprobar:
        En postman->Header->Key: X-Requested-With Value:  XMLHttpRequest
        if(req.xhr){
            res.status(200).json(products);
        }else{
            res.render('home', {products, title:'ProductList'});
        } */
    res.render("home", { products, title: "ProductList" });
  } catch (error) {
    res.status(400).send(`No se pudo traer la lista de productos ${error}`);
  }
});

//ruta para mostrar info en tiempo real.
viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { title: "RealTimeProducts" });
    //res.status(200).send(products);
  } catch (error) {
    alert(error.message);
  }
});

export { viewsRouter };
