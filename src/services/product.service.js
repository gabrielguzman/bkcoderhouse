import { productModel } from "../dao/models/product.model.js";

class ProductService {
  constructor() {
    this.model = productModel;
  }

  //http://localhost:8080/api/v2/products/?limit=1&page=1&sort=asc&query={"price":100}
  async getPaginatedProducts(query, page, limit, sort, category, availability) {
    try {
      const options = {};
  
      if (sort === "asc") {
        options.sort = { price: 1 };
      } else if (sort === "desc") {
        options.sort = { price: -1 };
      }
  
      const queryOptions = {};
  
      if (query) {
        const parsedQuery = JSON.parse(query);
        Object.assign(queryOptions, parsedQuery);
      }
  
      if (category) {
        queryOptions.category = category;
      }
  
      if (availability) {
        queryOptions.stock = { $gt: 0 };
      }
  
      const products = await this.model.paginate(queryOptions, {
        page: parseInt(page),
        limit: parseInt(limit),
        ...options,
      });
  
      return products;
    } catch (error) {
      throw new Error(`Error al obtener los productos: ${error}`);
    }
  }
  
  async getProducts(limit = 10, page = 1, options = {}, query = {}) {
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
