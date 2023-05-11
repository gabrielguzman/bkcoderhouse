import express from "express";
import handlerbars from 'express-handlebars';
import { productsRouter } from "./routes/productsRouter.js";
import { cartsRouter } from "./routes/cartsRouter.js";
import { viewsRouter } from "./routes/viewsRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//set handlebars
app.engine('handlebars', handlerbars.engine());
app.set('views', 'views/');
app.set('view engine', 'handlebars');
//set public
app.use(express.static('public'));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter); 


app.listen(8080,()=>{console.log("estoy en puerto 8080")});