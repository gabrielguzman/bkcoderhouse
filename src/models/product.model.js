import mongoose from "mongoose";

export const productScheme = new moongose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type:Number, required: true},
    status: {type: Boolean, default: true},
    thumbnail: {type: String, required: false},
    code: {type: String, required: true},
    stock: {type: Number, required: true},
    category: {type: String, required: true}
});

export const productModel = mongoose.model('products', productScheme);