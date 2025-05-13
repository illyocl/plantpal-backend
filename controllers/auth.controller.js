const User = require('../models/User');
const crypto = require('crypto');


function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(salt + password).digest('hex');
  return `${hash}:${salt}`;
}


function verifyPassword(inputPassword, storedPassword) {
  const [hash, salt] = storedPassword.split(':');
  const inputHash = crypto.createHash('sha256').update(salt + inputPassword).digest('hex');
  return hash === inputHash;
}


exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Bu email adresiyle kayıtlı bir kullanıcı zaten var.' });
    }

    const hashedPassword = hashPassword(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'Kayıt başarılı!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre.' });
    }

    res.status(200).json({ message: 'Giriş başarılı!', userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};
