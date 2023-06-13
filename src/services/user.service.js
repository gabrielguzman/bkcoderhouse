import { userModel } from "../dao/models/user.model.js";

class UserService{
    constructor(){
        this.model = userModel;
    }

    async createUser(userData){
        try {
            const newUser = this.model.create(userData);
            return newUser;
        } catch (error) {
            throw new Error(`No se pudo crear el usuario: ${error}`);
        }
    }

    async loginUser(email){
        try {
            const user = await this.model.findOne({email: email});
            console.log(user);
            return user;
        } catch (error) {
            throw new Error(`No se iniciar sesion: ${error}`);
        }
    }
}

const userService = new UserService();
export default userService;
