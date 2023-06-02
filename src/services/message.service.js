import { messageModel } from "../dao/models/message.model.js";

class MessageService {
  constructor() {
    this.model = messageModel;
  }

  async getMessages() {
    try {
      const messages = await this.model.find().maxTimeMS(20000).lean().exec();
      return messages;
    } catch (error) {
      throw new Error(
        `No se pudo obtener los mensajes. Por favor reintente nuevamente: ${error}`
      );
    }
  }

  async addMessage(message) {
    try {
      // console.log(message);
      await this.model.create(message);
    } catch (error) {
      throw new Error(`No se pudo guardar el mensaje ${error}`);
    }
  }

  /* async deleteAllMessages() {
    try {
      await this.model.deleteMany({});
      console.log('Todos los mensajes han sido eliminados.');
    } catch (error) {
      console.error('Error al eliminar los mensajes:', error);
    }
  } */
}
const messageService = new MessageService();
export default messageService;
