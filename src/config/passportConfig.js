const { User } = require("../db.js");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;
const passport = require("passport");

passport.use(
  //primero dentro de la nueva estrategia puedo elegir los campos, por default sino es username
  new localStrategy((username, password, done) => {
    User.findOne({ where: { username: username } })
      .then((user) => {
        if (!user) {
          return done(null, false, { msg: "El usuario no existe" });
        } else if (user && user.resetPasswordForce === false) {
          //Match the password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { msg: "La contraseña es incorrecta" });
            }
          });
        } else if (user && user.resetPasswordForce === true) {
          return done(null, false, { msg: "Tú contraseña fue cambiada" });
        }
      })
      .catch((err) => console.log(err));
  })
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findByPk(id).then((user) => {
    done(null, user);
  });
});

module.exports = passport;
