import { cartModel } from "../dao/models/cart.model.js";
import { productModel } from "../dao/models/product.model.js";
class CartService {
  constructor() {
    this.model = cartModel;
  }
  
  //crear carrito
  async createCart() {
    try {
      const newCart = new this.model({ products: [] });
      const createdCart = await newCart.save();
      return createdCart;
    } catch (error) {
      throw new Error(`No se pudo crear el carrito: ${error}`);
    }
  }

  //traer todos los carritos y su información
  async getCarts() {
    try {
      const carts = this.model.find();
      return carts;
    } catch (error) {
      throw new Error(`No se pudieron obtener los carritos: ${error}`);
    }
  }

  //traer los productos de un solo carrito y mostrar el detalle del producto.
  async getCartContents(cid){
    try {
      const cart = await this.model.findById(cid).populate('products.product').lean();

      if (!cart) {
        throw new Error("No existe el carrito buscado");
      }
      
      return cart;
    } catch (error) {
      throw new Error(`No se pudo obtener el contenido del carrito: ${error}`);
    }
  }

  //agregar producto al carrito
  async addProductToCart(cid, pid) {
    try {
      const cart = await this.model.findById(cid);

      if (!cart) {
        throw new Error("No existe el carrito buscado");
      }

      const product = await productModel.findById(pid);
      console.log(product);

      if (!product) {
        throw new Error("No existe el producto buscado");
      }

      const index = cart.products.findIndex((producto) => {
        return producto.product.toString() === pid;
      });

      if (index === -1) {
        cart.products.push({ product: pid, quantity: 1 });
      } else {
        cart.products[index].quantity += 1;
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`No se pudo agregar producto al carrito: ${error}`);
    }
  }

  //eliminar producto especifico del carrito
  async removeProductFromCart(cid, pid) {
    try {
      const cart = await this.model.findById(cid);
      //Primer producto del carrito-> console.log(cart.products[0]);
      if (!cart) {
        throw new Error("No existe el carrito buscado");
      }

      const index = cart.products.findIndex((producto) => {
        return producto.product.toString() === pid;
      });

      if (index === -1) {
        throw new Error(`No existe producto en el carrito`);
      }

      cart.products.splice(index, 1);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`No se pudo eliminar el producto del carrito: ${error}`);
    }
  }

  //actualizar carrito y enviar un array de productos. Estos productos deben corresponder a un id existente
  //ya que esta relacionado al modelo y asi poder visualizar el carrito correspondiente
  /* {
    "products": [
      {
        "product": "64776e070389ea452b52a593",
        "quantity": 2
      },
      {
        "product": "647778b56deb786eaa8a232a",
        "quantity": 1
      }
    ]
  } */
  async updateCart(cid, products){
    try {
      const cart = await this.model.findById(cid);
      
      if (!cart) {
        throw new Error("No existe el carrito buscado");
      }

      if (!products || !Array.isArray(products)) {
        throw new Error('El formato de los productos no es válido');
      }

      cart.products = products;

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`No se pudo actualizar los productos del carrito: ${error}`);
    }
  }

  //actualizar cantidad de ejemplares del producto desde req.body
  async updateProductQuantityFromCart(cid, pid, quantity){
    try {
      const cart = await this.model.findById(cid);

      if (!cart) {
        throw new Error("No existe el carrito buscado");
      }
      
      const index = cart.products.findIndex((producto) => {
        return producto.product.toString() === pid;
      });

      if (index === -1) {
        throw new Error(`No existe producto en el carrito`);
      }

      cart.products[index].quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`No se actualizar la cantidad del producto indicado: ${error}`);
    }
  }

  //eliminar todos los productos del carrito
  async clearCart(cid){
    try {
      const cart = await this.model.findById(cid);

      if (!cart) {
        throw new Error("No existe el carrito buscado");
      }

      cart.products = [];
      await cart.save();
    } catch (error) {
      throw new Error(`No se actualizar la cantidad del producto indicado: ${error}`);
    }
  }
}


const cartService = new CartService();
export default cartService;
