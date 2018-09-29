const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const passport = require('passport');
const path = require('path');
const app = express();

const keys = require('./config/keys');

const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const comments = require('./routes/api/post_comments');

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
app.use('/api/comments', comments);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(process.env.PORT || 5000, err => {
  console.log('Server started on port 3000');
});
