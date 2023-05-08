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
      console.log(`No se puede leer el archivo de productos ${err}`);
    }
  }

  async addProduct({ title, description, price, status = true, thumbnail = [], code, stock, category }) {
    try {
      if (
        title === undefined ||
        description === undefined ||
        price === undefined ||
        code === undefined ||
        stock === undefined ||
        status === undefined ||
        category === undefined
      ) {
        throw new Error('Los datos del producto son inválidos');
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
        thumbnail: thumbnail ? thumbnail : [] ,
        code: code,
        stock: stock,
        status: status,
        category: category
      };
      //Comprueba que el code no exista
      const re = await products.filter((item) => {
        return item.code == producto.code;
      });
      if (re.length == 0) {
        console.log("re igual a 0");
        this.id += 1;
        products.push(producto);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
        return producto;
      } else {
        console.log("Ya existe un producto con el mismo codigo.");
      }
    } catch (err) {
      console.log(`No se pudo almacenar el producto ${err}`);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const res = products.filter((item) => {
        return item.id == id;
      });
      if (res.length == 0) {
        throw new Error(`No existe producto con el id: ${id}`);;
      }
      return res[0];
    } catch (err) {
      console.log(`No se puede obtener el producto ${err}`);
    }
  }

  async updateProduct(id, cambios) {
    try {
      let products = await this.getProducts();
      const res = products.filter((item) => {
        return item.id == id;
      });

      if (res.length == 0) {
        console.log(`no existe el producto con el id: ${id}`);
        return;
      }
    
      let { title, description, price, thumbnail, code, stock ,status, category } = cambios;
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
      console.log(`No se puede actualizar la información del producto ${err}`);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const lista = products.filter((item) => {
        return item.id == id;
      });
      if (lista.length == 0) {
        console.log(`no existe el producto con el id: ${id}`);
        return;
      }
      const res = products.filter((item) => {
        return item.id != id;
      });
      await fs.promises.writeFile(this.path, JSON.stringify(res));
    } catch (err) {
      console.log(`No se pudo borrar el producto ${err}`);
    }
  }
}

/*
 const resultado = new ProductManager("./productos.json");
(async function () {
  console.log("Listado original de productos");
  console.log(await resultado.getProducts());

  console.log("Se agregan 3 items");
  await resultado.addProduct({
    title: "Producto 1",
    description: "descripcion 1",
    price: 200,
    thumbnail: "sinruta",
    code: "abc123",
    stock: 5000,
  });

  await resultado.addProduct({
    title: "Producto 2",
    description: "descripcion 2",
    price: 200,
    thumbnail: "sinruta",
    code: "abc124",
    stock: 366,
  });

  await resultado.addProduct({
    title: "Producto 3",
    description: "descripcion 3",
    price: 400,
    thumbnail: "sinruta",
    code: "abc125",
    stock: 401,
  });

  console.log(await resultado.getProducts());

  console.log("Obtenemos el producto por id");
  console.log(await resultado.getProductById(1));

  console.log("Actualizamos el nombre del producto de un producto");
  //mando cambios, el mismo controla que si mando otra propiedad que no sea del objeto no la tome
  await resultado.updateProduct(1, {title:'nuevo_nombre', stock:0, price:300});
  //await resultado.updateProduct(1, {title:'nuevo_nombre', stock:0, asdafe:'propiedad que no sirve'});
  console.log(await resultado.getProducts());

  console.log("Eliminamos un producto");
  await resultado.deleteProduct(1);

  console.log(await resultado.getProducts());

  console.log("Fin");
})();
*/

/*Forma manual descomentando lineas y luego comentando para no pisar la información*/
//1-Mostramos lista inicial
//resultado.getProducts().then((a)=>{console.log(a)})
//2-Ingresamos Productos y comentamos lo anterior
/* resultado
  .addProduct({
    title: "sin titulo",
    description: "descripcion",
    price: 200,
    thumbnail: "sinruta",
    code: "abc123",
    stock: 123,
  })
  .then((a) => {
    resultado.addProduct({
      title: "sin titulo2",
      description: "descripcion2",
      price: 2002,
      thumbnail: "sinruta2",
      code: "abc1232",
      stock: 1232,
    });
  });    */
//3-Mostramos los productos y comentamos el ingreso de productos
//resultado.getProducts().then((a)=>{console.log(a)})
//4-Mostramos el producto por id
//resultado.getProductById(1).then((b)=>{console.log(b)});
//5-Actualizamos el titulo de  producto con id 1
//resultado.updateProduct(1, 'nuevo nombre producto 1').then((a)=>{console.log(a)});
//Mostramos getProducts
//resultado.getProducts().then((a)=>{console.log(a)})
//6-Borramos el producto con id: 1
//resultado.deleteProduct(1)
//Mostramos los productos con el estado final
//resultado.getProducts().then((a)=>{console.log(a)})
