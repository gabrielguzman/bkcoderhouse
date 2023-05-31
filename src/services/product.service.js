import { productModel } from "../models/product.model.js";

class ProductService {
    constructor(){
        this.model = productModel;
    }

    async getProducts(){
        return await this.model.find();
    }

    async getProductById(pid){
        return await this.model.findById(pid);
    }

    async addProduct(product){
        try {
            /* let product_exists = await this.model.findOne({ code: code }).exec();
            
            if(product_exists){
                throw new Error("Ya existe un producto con el mismo código.");
            }
             */
            return await this.model.create(product);
        }catch(error){
            throw new Error(error);
        }
    }

    async updateProduct(pid, product){
        try {
            let updated = await this.model.updateOne({_id: pid}, product);
            if(updated.modifiedCount==0){
                throw new Error(`No existe producto con el id indicado`);
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteProduct(pid){
        try {
            let cantidad = await this.model.deleteOne({_id:pid});
            if(cantidad.deletedCount == 0){
                throw new Error(`No existe producto con el id indicado`);
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}

const productService = new ProductService();
export default productService;