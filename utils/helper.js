 //MIDDLEWARE
 
 module.exports.middleware = (req, res, next) => {
  const header = req.headers.cookie;
  const cookie = require('cookie');
  const jwt = require('jsonwebtoken');

  if (!header) {
    return res.redirect('/login');
  }

  const { token } = cookie.parse(header);

  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
    if (err) {
      res.clearCookie('token');
      return res.redirect('/login');
    };
    
    const usr = await require('../model/user')
      .findById(user.id)
      .populate('room');

    req.user = usr;
    next();
  });
}

// CHECK AUTHENTICATED COOKIE JWT

 module.exports.authenticated = (req, res, next) => {
  const header = req.headers.cookie;
  const cookie = require('cookie');

  if (!header) {
    return next();
  }

  const { token } = cookie.parse(header);

  if (token) {
    return res.redirect('/');
  }

  next();
}