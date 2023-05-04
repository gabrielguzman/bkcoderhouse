import fs from "fs";

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
        contenido = { id: this.id, products: [{}] };
      } else {
        const max = await carrito.reduce(function (prev, current) {
          return prev.id > current.id ? prev.id : current.id;
        });

        this.id = (max.id ?? max) + 1;
        contenido = { id: this.id, products: [{}] };
      }
      carrito.push(contenido);
      await fs.promises.writeFile(this.path, JSON.stringify(carrito));
      return carrito;
    } catch (error) {
      console.log(`${error}`);
    }
  }
}

const carrito = new cartManager("./carrito.json");
//carrito.createCart();
