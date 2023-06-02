import mongoose from "mongoose";

const messageScheme = new mongoose.Schema({
    user: {type:String, required: true},
    message: {type:String, required:true}
})

messageScheme.index({ user: 1 });
messageScheme.index({ message: 'text' });

export const messageModel = mongoose.model('messages', messageScheme);