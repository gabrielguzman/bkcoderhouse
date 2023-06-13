import { Router } from "express";
import userService from "../services/user.service.js";

const usersRouter = Router();

usersRouter.post('/', async(req,res)=>{
   const userData = req.body;
   try {
      const newUser = await userService.createUser(userData);
      res.status(201).json(newUser);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

usersRouter.post('/auth', async(req,res)=>{
   const {email, password} = req.body;
   try {
		const user = await userService.loginUser(email);

		if (!user) throw new Error('Invalid data'); // Existe el usuario?
		if (user.password !== password) throw new Error('Invalid data'); // La contraseña es correcta?
      
		req.session.user = user;
      
		//res.redirect('/products'); 
	} catch (error) {
      console.log(error);
		res.status(400).json({error});
	}
});

usersRouter.post('/logout', (req,res)=>{
   req.session.destroy();
   res.json({ success: true, message: 'Se cerro la sesión exitosamente' });
})

export {usersRouter};