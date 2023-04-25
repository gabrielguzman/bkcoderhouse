import express from "express";
import ProductManager from './productManager.js';

const app = express();
const productManager = new ProductManager('./productos.json'); 
/* let products = productManager.getProducts()
console.log(await products); */

app.use(express.urlencoded({extended:true}));

app.get('/products',async (req,res)=>{
    let limit = req.query.limit
    try {
        let products = await productManager.getProducts();
        //compruebo que esté el limite y que el limite sea numerico, caso contrario devuelvo todos los productos al no cumplir condicion.. En caso de ser mayor tambien devuelvo todo el listado.
        if(limit >0 && !isNaN(limit)){
           products = products.slice(0,limit);
           res.send(products);
        }else{
            res.send(products);
        }
    } catch (error) {
        res.send(`No se pudieron obtener los productos ${error}`)
    }
});

app.get('/products/:id', async(req,res)=>{
    try {
        const producto = await productManager.getProductById(req.params.id);
        res.send(producto)
    } catch (error) {
        res.send(`No se pudieron obtener el producto ${error}`)
    }
});

app.listen(8080,()=>{console.log("estoy en puerto 8080")});