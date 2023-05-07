import { Router } from "express";
import ProductManager from "../productManager.js";

const productsRouter = Router();

const productManager = new ProductManager('./productos.json'); 

productsRouter.get('/', async (req,res)=>{
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
        res.status(400).send(`No se pudieron obtener los productos ${error}`)
    }
})

productsRouter.get('/:pid',async(req, res)=>{
    try {
        const producto = await productManager.getProductById(req.params.pid);
        res.send(producto)
    } catch (error) {
        res.send(`No se pudo obtener el producto ${error}`);
    }
})

productsRouter.post('/', async (req,res)=>{
    let {title, description, price, status = true, thumbnail, code, stock, category} = req.body;
    try{
        await productManager.addProduct({
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock,
        status: status,
        category: category
    });
        res.status(201).send(`Se agrego producto correctamente`);
    }catch(error){
        res.send(`No se pudo agregar el producto ${error}`);
    }
});

productsRouter.put('/:pid', async(req,res)=>{
    let anterior = await productManager.getProductById(req.params.pid);
    let cambios = req.body;
    try {
        productManager.updateProduct(req.params.pid,cambios);
        res.send(cambios);
    } catch (error) {
        res.status(400).send(`No se pudo actualizar el producto ${error}`);
    } 
})

productsRouter.delete('/:pid',async(req,res)=>{
    try {
        await productManager.deleteProduct(req.params.pid);
        res.send();
    } catch (error) {
        res.status(400).send(`No se pudo eliminar el producto ${error}`);
    }
})

export {productsRouter};