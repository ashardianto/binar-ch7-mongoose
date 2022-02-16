const express = require('express');
const mongoose = require('mongoose');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const PORT = 3000;

const app = express();
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

mongoose.connect(process.env.MONGODB_URL, { useUnifiedTopology: true, useNewUrlParser: true, });
mongoose.connection.on('connected', () => console.log(`MongoURI: ${process.env.MONGODB_URL}`));

app.use(flash());
app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: false,
  resave: false,
}))
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(path.resolve(), 'public')));
app.set('view engine', 'pug');

const router = require('./router')
app.use(router)
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

// app.get('/', require('./utils/helper').middleware, async (req, res) => {
//   res.render('index.pug', { user: req.user, });
// });

// app.get('/login', require('./utils/helper').authenticated, (req, res) => res.render('login.pug'));
// app.get('/register', require('./utils/helper').authenticated, (req, res) => res.render('register.pug'));

// app.post('/login', require('./controller/user').authUser);
// app.post('/register', require('./controller/user').addUser);
// app.delete('/logout', (req, res) => {
//   res.clearCookie('token');
//   res.redirect('/login');
// });

// app.post('/room', require('./controller/room').addRoom);
// app.get('/room/:id', require('./controller/room').getRoom)
// app.post('/room/:id/record', require('./controller/room').records)

