import mongoose from "mongoose";
import { productScheme } from "./product.model.js";

const cartScheme = new moongose.Schema({
    products:{
        type: [productScheme],
        require: false,
        default: [],
    },
});

export const cartModel = mongoose.model('carts', cartScheme);