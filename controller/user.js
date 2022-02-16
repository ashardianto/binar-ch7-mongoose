const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.addUser = async (req, res) => {
  const { name, email, password, cpassword } = req.body;

  let error;
  let user = new User({
    name: name,
    email: email,
    password: password,
  });

  const validateSync = user.validateSync();
  const errorUnmatched = password !== cpassword;

  if (validateSync && (error = validateSync.errors['email']))
    return req.flash('error_email', error.message) && res.redirect('/register');

  if (validateSync && (error = validateSync.errors['password']))
    return req.flash('error_password', error.message) && res.redirect('/register');

  if (errorUnmatched && (error = 'Password is not match.'))
    return req.flash('error_unmatched', error) && res.redirect('/register');

  try {
    if (await User.findOne({ email: email }))
      return req.flash('error_istaken', 'Email already registered.') &&
             res.redirect('/register');

    user = new User({
      name: name,
      email: email,
      password: await bcrypt.hash(password, 10),
    });

    return await user.save() && res.redirect('/login');

  } catch (e) {
    return req.flash('error_unknown', 'Something when wrong, try again later.') &&
           res.redirect('/register');
  }
}

module.exports.authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user || await bcrypt.compare(password, user.password) !== true) {
    req.flash('error_creds', 'Invalid email/password');
    return res.render('login.pug');
  }

  const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, { expiresIn: '30m'});
  res.setHeader('Set-Cookie', require('cookie').serialize('token', token, {
    httpOnly: true,
  }));

  return res.redirect('/');
}