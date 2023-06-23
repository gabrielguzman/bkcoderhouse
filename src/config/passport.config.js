import passport from "passport";
import GitHubStrategy from "passport-github2";
import userService from "../services/user.service.js";

const incializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.deacdc63b50836c7",
        clientSecret: "bfa8587f12fb8788b8d8bbd85f004f6279618d7d",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          let user = await userService.loginUser(profile._json.email);
          if (!user) {
            let newUser = {
              first_name: profile._json.name ? profile._json.name : "usuario_pruebagithub", // si no tengo seteado en mi perfil de github asignar esto
              last_name: " ", //dejo un espacio ya que el modelo tengo que last_name es requerido
              email: profile._json.email ? profile._json.email  : "email_pruebagithub" ,// si no tengo seteado en mi perfil de github asignar esto
              password: " ", //dejo un espacio ya que en el modelo tengo que password es requerido
            };
            user = await userService.createUser(newUser);
            console.log(`User sin password ${user}`);
            done(null, user);
          } else {
            done(null, user);
          }
        } catch (error) {
          done(error, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userService.getById(id);
    done(null, user);
  });
};

export default incializePassport;
