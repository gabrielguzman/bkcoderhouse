import express from "express";
import handlerbars from "express-handlebars";
import mongoose from 'mongoose';
import { Server } from "socket.io";
import { productsRouter } from "./routes/productsRouter.js";
import { cartsRouter } from "./routes/cartsRouter.js";
import { viewsRouter } from "./routes/viewsRouter.js";
import ProductManager from "./productManager.js";
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
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

mongoose.connect('mongodb+srv://gabrielguzman147gg:12345@gabrielcoder.o4pfrml.mongodb.net/');

const webServer = app.listen(8080, () => {
  console.log("estoy en puerto 8080");
});

//const products = await productManager.getProducts();
const io = new Server(webServer);
io.on("connection", async (socket) => {
  socket.on("message", (data) => {
    console.log(data);
  });

  socket.emit("products", await productManager.getProducts());

  socket.on("deleteproduct", async (data) => {
    try {
      await productManager.deleteProduct(data);
      socket.emit('products', await productManager.getProducts());
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
      socket.emit('products', await productManager.getProducts());
    } catch (error) {
      socket.emit("error", error.message);
    }
  });
  
});
