import { Router } from "express";
import messageService from "../services/message.service.js";
import productService from "../services/product.service.js";
import ProductManager from "../dao/productManager.js";

const viewsRouter = Router();
const productManager = new ProductManager("./productos.json");

//ruta con handlebars
viewsRouter.get("/", async (req, res) => {
  try {
    const products = await productService.getProducts();
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

viewsRouter.get("/chat", async (req, res) => {
  try {
    const mensajes = await messageService.getMessages();
    res.render("chat", { title: "Chat", mensajes });
  } catch (error) {
    console.error("Error al obtener los mensajes:", error);
    res.status(500).send("Error al obtener los mensajes");
  }
});

viewsRouter.get("/products", async (req, res) => {
  const {query,
    page,
    limit,
    sort,
    category,
    availability
  } = req.query
  try {
    const products = await productService.getPaginatedProducts(
      query,
      page,
      limit,
      sort,
      category,
      availability
    );
    console.log(products);
    res.render("products", { title: "Chat", products });
  } catch (error) {
    res.status(400).send(`No se pudo traer la lista de productos ${error}`);
  }
});

//Para borrar todos los mensajes..
/* viewsRouter.delete("/chat/delete/", async(req,res)=>{
  await messageService.deleteAllMessages();
})
*/
export { viewsRouter } 
