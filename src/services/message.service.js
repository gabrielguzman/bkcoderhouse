import { messageModel } from "../models/message.model.js";

class MessageService{
    constructor(){
        this.model = messageModel;
    }

    async getMessages(){
        try {
            const messages = this.model.find().lean();
            return messages;
        } catch (error) {
            throw new Error(`No se pudo obtener los mensajes: ${error}`);
        }
    }

    async addMessage(message){
        try {
            console.log(message);
            await this.model.create(message);
        } catch (error) {
            throw new Error(`No se pudo guardar el mensaje ${error}`);
        }
    }
}
const messageService = new MessageService();
export default messageService;