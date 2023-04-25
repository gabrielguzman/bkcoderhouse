import express from "express";
import ProductManager from './productManager.js';

const app = express();
const productManager = new ProductManager('./productos.json'); 
let products = productManager.getProducts()
console.log(await products);

app.use(express.urlencoded({extended:true}));

app.get('/products',(req,res)=>{
    console.log('todos los productos');
});

app.get('/products/:id',(req,res)=>{
    console.log('un producto particular');
});

app.listen(8080,()=>{console.log("estoy en puerto 8080")});