import { productModel } from "../dao/models/product.model.js";

class ProductService {
  constructor() {
    this.model = productModel;
  }

  async getProducts() {
    try {
      //return await this.model.paginate({},{limit:4});
      return await this.model.find().lean();
    } catch (error) {
      throw new Error(`Error al obtener los productos: ${error}`);
    }
  }

  //Listado de productos con paginación
  //Ejemplo http://localhost:8080/api/v2/products/?limit=10&query={"category":"alguna"}&sort="desc"
  //Ejemlplo con dos filtros http://localhost:8080/api/v2/products/?sort=asc&query={"category":"alguna","availability":false}
  async getProductswPag(limit, page, sort, category, availability) {
    try {
      let options = {};
      let optionalQueries = {};
  
      // Verificar si se proporcionó el parámetro de categoría
      if (category) {
        optionalQueries.category = category;
      }
  
      // Verificar si se proporcionó el parámetro de disponibilidad
      if (availability !== undefined) {
        optionalQueries.status = availability;
      }
  
      // Verificar el parámetro de orden
      if (sort === "asc") {
        options.sort = { price: 1 };
      } else if (sort === "desc") {
        options.sort = { price: -1 };
      }
  
      // Realizar la consulta a la base de datos utilizando los parámetros proporcionados
      const products = await this.model.paginate(optionalQueries, {
        page: parseInt(page),
        limit: parseInt(limit),
        ...options,
      });
  
      return products;
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
