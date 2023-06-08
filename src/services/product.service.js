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
  async getProductswPag(limit, page, sort, query) {
    try {
      let options = {};
      let optionalQueries = {};

      //comienzo a verificar los parametros
      if (query) {
        const parsedQuery = JSON.parse(query);
        //filtro por categoria
        if (parsedQuery.category) {
          optionalQueries.category = parsedQuery.category;
        }
        //filtro por disponibilidad
        if (parsedQuery.availability === true) {
            //optionalQueries.stock = { $gt: 0 }; //Por Precio
            optionalQueries.status = true // Por status del producto
        } else if (parsedQuery.availability === false) {
            //optionalQueries.stock = { $eq: 0 };
            optionalQueries.status = false
        }
      }
      //orden
      if (sort === "asc") {
        options.sort = { price: 1 };
      } else if (sort === "desc") {
        options.sort = { price: -1 };
      }

      console.log(optionalQueries);
      //teniendo en cuenta que paginate({}, options) puedo hacer lo siguiente:
      const products = await this.model.paginate(optionalQueries, {
        page: parseInt(page),
        limit: parseInt(limit),
        ...options,
      }); //paginate({query}, options)
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
