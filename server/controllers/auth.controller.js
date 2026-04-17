const jwt = require('jsonwebtoken');
const verifyLinearUser = require('../utils/linearAuth');

exports.login = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!process.env.JWT_SECRET) {
      console.error('FATAL: JWT_SECRET is not set in environment variables');
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    const user = await verifyLinearUser(email);

    if (!user) {
      return res.status(401).json({ error: "Not an active member" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};