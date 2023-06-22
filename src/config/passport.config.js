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
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              password: "",
              img: profile._json.avatar_url,
            };
            user = await userService.createUser(newUser);
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
