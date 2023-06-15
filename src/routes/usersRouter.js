import { Router } from "express";
import userService from "../services/user.service.js";

const usersRouter = Router();

//ruta para crear el usuario
usersRouter.post('/', async (req, res) => {
  const userData = req.body;
  try {
    const newUser = await userService.createUser(userData);
    const successMessage = 'Se ha registrado correctamente';
    res.render('login', { successMessage });
  } catch (error) {
    const errorMessage = 'Error al registrar el usuario';
    res.redirect(`/?error=${encodeURIComponent(errorMessage)}`);
  }
});
//Al no tener un usuario, primero se creará un usuario, para esto, la pantalla de login deberá tener un link de redirección “Regístrate” 
usersRouter.post('/auth', async(req, res) => {
    const { email, password } = req.body;
    //Se revisará que el admin NO viva en base de datos, sino que sea una validación que se haga de manera interna en el código.
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
        //si las credenciales estan bien, pasar a product, sino quedarse en login
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
   req.session.destroy();
   res.redirect(`/`);
})

export {usersRouter};