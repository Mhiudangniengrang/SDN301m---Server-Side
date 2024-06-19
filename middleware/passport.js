const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const Member = require("../model/memberSchema");

const initialize = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await Member.findOne({ membername: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Member.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

module.exports = initialize;
