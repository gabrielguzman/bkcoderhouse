import mongoose from "mongoose";

const messageScheme = new mongoose.Schema({
    user: {type:String, required: true},
    message: {type:String, required:true}
})

export const messageModel = mongoose.model('messages', messageScheme);