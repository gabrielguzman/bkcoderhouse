export function authMiddleware(req, res, next) {
    if (req.session && req.session.user) {
      next();
    } else {
      res.redirect("/login");
    }
  }

export function checkAuthentication (req, res, next){
    if (req.session.user) {
      res.redirect('/products'); 
      next(); // Continuar con el siguiente middleware o ruta si el usuario no está autenticado
    }
  };
  