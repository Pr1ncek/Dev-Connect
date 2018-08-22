const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const passport = require('passport');
const app = express();

const keys = require('./config/keys');

const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

// Bodyparser setup
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Passport middleware
app.use(passport.initialize());

// Passport config strategy
require('./config/passport')(passport);

// MongoDB config
mongoose.connect(
  keys.mongoURI,
  { useNewUrlParser: true },
  error => {
    if (error) {
      console.log('MongoDB connection failed! \n' + error);
      return;
    }
    console.log('MongoDB connected!');
  }
);

// Router Config
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(process.env.PORT || 3000, err => {
  console.log('Server started on port 3000');
});
