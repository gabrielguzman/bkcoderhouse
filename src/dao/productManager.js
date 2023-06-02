import fs from "fs";
export default class ProductManager {
  constructor(path) {
    this.path = path;
    this.id = 0;
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
  }

  async getProducts() {
    try {
      const products = JSON.parse(
        await fs.promises.readFile(this.path, "utf-8")
      );
      return products;
    } catch (err) {
      throw new Error(`No se puede leer el archivo de productos ${err}`);
    }
  }

  async addProduct({
    title,
    description,
    price,
    status = true,
    thumbnail,
    code,
    stock,
    category,
  }) {
    try {
      if (
        title === undefined ||
        title === "" ||
        description === undefined ||
        description === "" ||
        price === undefined ||
        price === "" ||
        code === undefined ||
        price === "" ||
        stock === undefined ||
        stock === "" ||
        status === undefined ||
        category === undefined ||
        category === ""
      ) {
        throw new Error("Los datos del producto son inválidos");
      }

      if (!Array.isArray(thumbnail) && thumbnail != undefined) {
        throw new Error("thumbnail debe ser un array");
      }

      //mejora con el manejo del id
      let products = await this.getProducts();
      if (products.length == 0) {
        this.id = 1;
      } else {
        const max = await products.reduce(function (prev, current) {
          return prev.id > current.id ? prev.id : current.id;
        });
        this.id = (max.id ?? max) + 1;
      }
      products = products.length ? await this.getProducts() : [];
      const producto = {
        id: this.id,
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail ? thumbnail : [],
        code: code,
        stock: stock,
        status: status,
        category: category,
      };
      //Comprueba que el code no exista
      const re = await products.filter((item) => {
        return item.code == producto.code;
      });
      if (re.length == 0) {
        this.id += 1;
        products.push(producto);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
        return producto;
      } else {
        throw new Error("Ya existe un producto con el mismo codigo.");
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const res = products.filter((item) => {
        return item.id == id;
      });
      if (res.length == 0) {
        throw new Error(`No existe producto con el id: ${id}`);
      }
      return res[0];
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateProduct(id, cambios) {
    try {
      let products = await this.getProducts();
      const res = products.filter((item) => {
        return item.id == id;
      });

      if (res.length == 0) {
        throw new Error(`No existe el producto con el id ${id}`);
      }

      let {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      } = cambios;
      products = products.map((item) => {
        if (item.id == id) {
          title != undefined ? (item.title = title) : "";
          description != undefined ? (item.description = description) : "";
          price != undefined ? (item.price = price) : "";
          thumbnail != undefined ? (item.thumbnail = thumbnail) : "";
          code != undefined ? (item.code = code) : "";
          stock != undefined ? (item.stock = stock) : "";
          status != undefined ? (item.status = status) : "";
          category != undefined ? (item.category = category) : "";
        }
        return item;
      });
      await fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const lista = products.filter((item) => {
        return item.id == id;
      });
      if (lista.length == 0) {
        throw new Error(`no existe el producto con el id: ${id}`);
      }
      let product = null;
      const res = products.filter((item) => {
        if (item.id != id) {
          return true;
        }
        product = item;
        return false;
      });
      await fs.promises.writeFile(this.path, JSON.stringify(res));
      return product;
    } catch (err) {
      throw new Error(`No se pudo borrar el producto ${err}`);
    }
  }
}
