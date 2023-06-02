import express from "express";
import handlerbars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { productsRouter } from "./routes/productsRouter.js";
import { cartsRouter } from "./routes/cartsRouter.js";
import { viewsRouter } from "./routes/viewsRouter.js";
import { cartsRouterV2 } from "./routes/cartsRouterV2.js";
import { productsRouterV2 } from "./routes/productsRouterV2.js";
import messageService from "./services/message.service.js";
import ProductManager from "./dao/productManager.js";

const app = express();

const productManager = new ProductManager("./productos.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//set handlebars
app.engine("handlebars", handlerbars.engine());
app.set("views", "views/");
app.set("view engine", "handlebars");
//set public
app.use(express.static("public"));

app.use("/", viewsRouter);

//***IMPORTANTE:AGRUPO Y SEPARO RUTAS POR VERSION
//Version con managers: api/v1/products ->ejemplo: http://localhost:8080/api/v1/products/
const apiV1Router = express.Router();
apiV1Router.use("/products", productsRouter);
apiV1Router.use("/carts", cartsRouter);
app.use("/api/v1", apiV1Router);
//Version con services: api/v2/products/ ->ejemplo: http://localhost:8080/api/v2/products/
const apiV2Router = express.Router();
apiV2Router.use("/products", productsRouterV2);
apiV2Router.use("/carts", cartsRouterV2);
app.use("/api/v2", apiV2Router);

//Esto luego separarlo en un .env para que no quede público.
mongoose.connect(
  "mongodb+srv://gabrielguzman147gg:12345@gabrielcoder.o4pfrml.mongodb.net/ecommerce"
);

const webServer = app.listen(8080, () => {
  console.log("estoy en puerto 8080");
});

const io = new Server(webServer);
io.on("connection", async (socket) => {
  socket.on("welcome", (data) => {
    console.log(data);
  });

  try {
    socket.emit("products", await productManager.getProducts());
  } catch (error) {
    console.log(error);
  }

  socket.on("message", async (data) => {
    await messageService.addMessage(data);
    let mensajes = await messageService.getMessages();
    io.emit("messages", mensajes);
  });

  socket.on("deleteproduct", async (data) => {
    try {
      await productManager.deleteProduct(data);
      io.emit("products", await productManager.getProducts());
    } catch (error) {
      socket.emit("error", error.message);
    }
  });
  socket.on("addproduct", async (product) => {
    try {
      let {
        title,
        description,
        price,
        status = true,
        thumbnail,
        code,
        stock,
        category,
      } = product;
      await productManager.addProduct({
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock,
        status: status,
        category: category,
      });
      io.emit("products", await productManager.getProducts());
    } catch (error) {
      socket.emit("error", error.message);
    }
  });
});
