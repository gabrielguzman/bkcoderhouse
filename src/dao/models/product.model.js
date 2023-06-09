import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const productScheme = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type:Number, required: true},
    status: {type: Boolean, default: true},
    thumbnail: {type: [], required: false},
    code: {type: String, required: true, unique:true},
    stock: {type: Number, required: true},
    category: {type: String, required: true}
});

productScheme.plugin(mongoosePaginate);

export const productModel = mongoose.model('products', productScheme);