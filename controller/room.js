const Room = require('../model/room');
const User = require('../model/user');

 module.exports.addRoom = async (req, res) => {
  let { name, userId } = req.body;
  let room = new Room({ name, user: userId });

  if (await Room.findOne({ name: name })) {
    req.flash('error_name', 'Room already exist');
    res.redirect('/');

    return;
  }

  await room.save();

  const user = await User.findById(userId);

  if (!user) {
    req.flash('error_user', 'User not found.');
    res.redirect('/');

    return;
  }

  if (!user.room.includes(room._id)) {
    user.room.push(room._id);
  }
  
  await user.save();

  res.redirect('/');
 }

module.exports.getRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const room = await Room.findById(id);
  
    if (!room) {
      return res.redirect('/');
    }

    res.render('room.pug', { room })
  } catch (e) { return res.redirect('/'); }
}

 module.exports.records = async (req, res) => {
  const { result } = req.body;
  const { id } = req.params;
  
  try {
    const room = await Room.findById(id);

    if (room) {
      room.result.push(result);
      await room.save();
  
      return res.json({ room })
    }

  } catch (e) { res.json({ result }); }
 }
