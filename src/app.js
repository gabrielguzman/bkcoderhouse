import express from "express";
import handlerbars from "express-handlebars";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import { Server } from "socket.io";
import { productsRouter } from "./routes/productsRouter.js";
import { cartsRouter } from "./routes/cartsRouter.js";
import { viewsRouter } from "./routes/viewsRouter.js";
import { cartsRouterV2 } from "./routes/cartsRouterV2.js";
import { productsRouterV2 } from "./routes/productsRouterV2.js";
import messageService from "./services/message.service.js";
import productService from "./services/product.service.js";
import { userModel } from "./dao/models/user.model.js";
import { usersRouter } from "./routes/usersRouter.js";
import incializePassport from "./config/passport.config.js";
import sessionsRouter from "./routes/sessions.router.js";

const app = express();

// Middleware cookies parser
app.use(cookieParser('B2zdY3B$pHmxW%'));

// Middleware de sesión
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: 'mongodb+srv://gabrielguzman147gg:12345@gabrielcoder.o4pfrml.mongodb.net/ecommerce',
			mongoOptions: {
				useNewUrlParser: true,
			},
			ttl: 6000,
		}),
		secret: 'B2zdY3B$pHmxW%',
		resave: false,
		saveUninitialized: false,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlerbars.engine());
app.set("views", "views/");
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.use("/", viewsRouter);

const apiV1Router = express.Router();
apiV1Router.use("/products", productsRouter);
apiV1Router.use("/carts", cartsRouter);
app.use("/api/v1", apiV1Router);

const apiV2Router = express.Router();
apiV2Router.use("/products", productsRouterV2);
apiV2Router.use("/carts", cartsRouterV2);
app.use("/api/v2", apiV2Router);

app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);

mongoose.connect(
	'mongodb+srv://gabrielguzman147gg:12345@gabrielcoder.o4pfrml.mongodb.net/ecommerce'
);

incializePassport();

const webServer = app.listen(8080, () => {
	console.log("Estoy en puerto 8080");
});

const io = new Server(webServer);
io.on("connection", async (socket) => {
	socket.on("welcome", (data) => {
		console.log(data);
	});

	try {
		socket.emit("products", await productService.getProducts());
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
			await productService.deleteProduct(data);
			io.emit("products", await productService.getProducts());
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
			await productService.addProduct({
				title: title,
				description: description,
				price: price,
				thumbnail: thumbnail,
				code: code,
				stock: stock,
				status: status,
				category: category,
			});
			io.emit("products", await productService.getProducts());
		} catch (error) {
			socket.emit("error", error.message);
		}
	});
});