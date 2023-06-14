import { Router } from "express";
import messageService from "../services/message.service.js";
import productService from "../services/product.service.js";
import ProductManager from "../dao/productManager.js";
import cartService from "../services/cart.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const viewsRouter = Router();
const productManager = new ProductManager("./productos.json");

//ruta con handlebars
viewsRouter.get("/", authMiddleware ,async (req, res) => {
  // try {
  //   const products = await productService.getProducts();
  //   /* si quiero conseguir los productos por postman o por navegador puedo comprobar:
  //       En postman->Header->Key: X-Requested-With Value:  XMLHttpRequest
  //       if(req.xhr){
  //           res.status(200).json(products);
  //       }else{
  //           res.render('home', {products, title:'ProductList'});
  //       } */
  //   res.render("home", { products, title: "ProductList" });
  // } catch (error) {
  //   res.status(400).send(`No se pudo traer la lista de productos ${error}`);
  // }
  const errorMessage = req.query.error || '';
  delete req.session.error;
  res.render('login', {title: 'Iniciar Sesion', errorMessage  });
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

//productos con paginacion , estableci 5 por defecto para visualizar link Next
viewsRouter.get("/products", async(req,res)=>{
  const {limit = 5, page = 1, sort, category, availability } = req.query;
  const user = req.session.user;
  try {
    const result = await productService.getProductswPag(limit, page, sort, category,availability);
    const pag = result.page;
    const prevPage = result.prevPage;
    const nextPage = result.nextPage;
    const totalPages = result.totalPages;

    const prevLink =
    prevPage &&
    `${req.baseUrl}/products/?page=${prevPage}&limit=${limit}&sort=${
      sort || ""
    }&category=${encodeURIComponent(category || "")}${
      availability ? `&availability=${availability}` : ""
    }`;
  
  const nextLink =
    nextPage &&
    `${req.baseUrl}/products/?page=${nextPage}&limit=${limit}&sort=${
      sort || ""
    }&category=${encodeURIComponent(category || "")}${
      availability ? `&availability=${availability}` : ""
    }`;

    //mapeo para evitar el Object.object
    const products = result.docs.map((product) => product.toObject());
    res.render("products",{title:"Products", products,prevLink,pag,totalPages,nextLink, user});
  } catch (error) {
    res.status(500).send(`No se pudieron obtener los productos`);
  }
})

//vista para ver el contenido de un carrito con detalle, uso del populate
//http://localhost:8080/carts/6477d4dcbe7a7e0baf623182
viewsRouter.get("/carts/:cid", async (req,res)=>{
  try {
    const cart = await cartService.getCartContents(req.params.cid);
    res.render("carts", { title: "cart", cart });
  } catch (error) {
    res.status(400).send(`${error}`);
  }
});

viewsRouter.get('/register', (req,res)=>{
  res.render('register', {title:'Registrar Usuario'});
});

/* viewsRouter.get('/login', async (req,res)=>{
  const errorMessage = req.query.error;
  res.render('login', {title: 'Iniciar Sesion', errorMessage  });
}); */


//Para borrar todos los mensajes..
/* viewsRouter.delete("/chat/delete/", async(req,res)=>{
  await messageService.deleteAllMessages();
})
*/
export { viewsRouter } 
