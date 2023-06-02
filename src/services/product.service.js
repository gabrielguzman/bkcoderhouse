import { productModel } from "../dao/models/product.model.js";

class ProductService {
  constructor() {
    this.model = productModel;
  }

  async getProducts() {
    try {
      return await this.model.find().lean();
    } catch (error) {
      throw new Error(`Error al obtener los productos: ${error}`);
    }
  }

  async getProductById(pid) {
    try {
      return await this.model.findById(pid);
    } catch (error) {
      throw new Error(`Error al obtener el producto por ID: ${error}`);
    }
  }

  async addProduct(product) {
    try {
      return await this.model.create(product);
    } catch (error) {
      throw new Error(`Error al agregar el producto: ${error}`);
    }
  }

  async updateProduct(pid, product) {
    try {
      let updated = await this.model.updateOne({ _id: pid }, product);
      if (updated.modifiedCount === 0) {
        throw new Error(`No existe un producto con el ID indicado`);
      }
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error}`);
    }
  }

  async deleteProduct(pid) {
    try {
      let cantidad = await this.model.deleteOne({ _id: pid });
      if (cantidad.deletedCount === 0) {
        throw new Error(`No existe un producto con el ID indicado`);
      }
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error}`);
    }
  }
}

const productService = new ProductService();
export default productService;
