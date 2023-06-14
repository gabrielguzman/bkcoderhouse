export function authMiddleware(req, res, next) {
    if (req.session.user ?? null) {
      res.redirect("/products");
    }else{
      next();
    }
  }

export function isGuest(req, res, next){
  if (!req.session.user) {
    res.redirect("/");
  }else{
    next();
  }
}