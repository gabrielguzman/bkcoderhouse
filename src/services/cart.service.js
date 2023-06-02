import { cartModel } from "../dao/models/cart.model.js";
import { productModel } from "../dao/models/product.model.js";
class CartService {
  constructor() {
    this.model = cartModel;
  }

  async createCart() {
    try {
      const newCart = new this.model({ products: [] });
      const createdCart = await newCart.save();
      return createdCart;
    } catch (error) {
      throw new Error(`No se pudo crear el carrito: ${error}`);
    }
  }

  async getCarts() {
    try {
      const carts = this.model.find();
      return carts;
    } catch (error) {
      throw new Error(`No se pudieron obtener los carritos: ${error}`);
    }
  }

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
}

const cartService = new CartService();
export default cartService;
