import fs from "fs";
import ProductManager from "./productManager.js";

const productManager = new ProductManager("./productos.json");

export default class cartManager {
  constructor(path) {
    this.id = 0;
    this.path = path;
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
  }

  async createCart() {
    try {
      const obtenerCarritos = JSON.parse(await fs.promises.readFile(this.path));
      let carrito = await obtenerCarritos;
      let contenido = {};

      if (carrito.length == 0) {
        console.log("estoy aqui");
        this.id = 1;
        contenido = { id: this.id, products: [] };
      } else {
        const max = await carrito.reduce(function (prev, current) {
          return prev.id > current.id ? prev.id : current.id;
        });

        this.id = (max.id ?? max) + 1;
        contenido = { id: this.id, products: [] };
      }
      carrito.push(contenido);
      await fs.promises.writeFile(this.path, JSON.stringify(carrito));
      return carrito;
    } catch (error) {
      console.log(`${error}`);
    }
  }

  async getProductsById(id) {
    try {
      const obtenerCarritos = JSON.parse(await fs.promises.readFile(this.path));
      const res = obtenerCarritos.filter((item) => {
        return item.id == id;
      });
      if (res.length == 0) {
        return `no existe el carrito con el id: ${id}`;
      }
      return res[0];
    } catch (error) {
      console.log(`${error}`);
    }
  }

  async addProductToCart(cid, pid) {
    const obtenerCarritos = JSON.parse(await fs.promises.readFile(this.path));
    const producto_buscado = await productManager.getProductById(pid);
    if (!producto_buscado) {
      return 404;
    }

    let carrito_buscado = obtenerCarritos.filter((carrito) => {
      return carrito.id == cid;
    })[0];
    if (carrito_buscado === undefined) {
      return 404;
    }

    let indice = carrito_buscado.products.findIndex((producto) => {
      return producto.id == pid;
    });

    if (indice === -1) {
      let producto = { id: pid, quantity: 1 };
      carrito_buscado.products.push(producto);
    } else {
      let cantidad = carrito_buscado.products[indice].quantity + 1;
      let producto = { id: pid, quantity: cantidad };
      carrito_buscado.products[indice] = producto;
    }
    await fs.promises.writeFile(this.path, JSON.stringify(obtenerCarritos));
  }
}

//carrito.createCart();
