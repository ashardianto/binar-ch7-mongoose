const router = require('express').Router()

  router.get('/', require('./utils/helper').middleware, async (req, res) => {
    res.render('index.pug', { user: req.user, });
  });
  
  router.get('/login', require('./utils/helper').authenticated, (req, res) => res.render('login.pug'));
  router.get('/register', require('./utils/helper').authenticated, (req, res) => res.render('register.pug'));
  
  router.post('/login', require('./controller/user').authUser);
  router.post('/register', require('./controller/user').addUser);
  router.delete('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
  });
  
  router.post('/room', require('./controller/room').addRoom);
  router.get('/room/:id', require('./controller/room').getRoom)
  router.post('/room/:id/record', require('./controller/room').records)

module.exports = router