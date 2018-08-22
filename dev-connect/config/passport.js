const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const mongoose = require('mongoose');
const User = mongoose.model('User');
const keys = require('./keys');

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.jwtSecret;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (payload, done) => {
      User.findById(payload.id, (err, user) => {
        if (user) {
          return done(null, user);
        }
        return done(null, { Error: err });
      });
    })
  );
};
