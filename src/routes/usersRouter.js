import { Router } from "express";
import userService from "../services/user.service.js";
import { authMiddleware, checkAuthentication } from "../middleware/auth.middleware.js";

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

usersRouter.post('/auth', async(req, res) => {
    const { email, password } = req.body;
    const adminCredentials = {
      email: 'adminCoder@coder.com',
      password: 'adminCod3r123',
    };
    
    let errorMessage = '';
  
    try {
      const user = await userService.loginUser(email);
  
      if (email === adminCredentials.email && password === adminCredentials.password) {
        req.session.user = {
          email: adminCredentials.email,
          role: 'admin',
          first_name: 'CoderAdmin',
        };
        res.redirect('/products'); // Redirige a la página del panel de control del administrador
        return;
      } else if (!user || user.password !== password) {
        errorMessage = 'Invalid email or password';
      } else {
        req.session.user = user;
        res.redirect('/products');
        return;
      }
    } catch (error) {
      console.log(error);
      errorMessage = 'An error occurred';
    }
  
    res.redirect(`/?error=${encodeURIComponent(errorMessage)}`);
  });

usersRouter.post('/logout', (req,res)=>{
   delete req.session.error;
   req.session.destroy();
   res.json({ success: true, message: 'Se cerro la sesión exitosamente' });
})

export {usersRouter};