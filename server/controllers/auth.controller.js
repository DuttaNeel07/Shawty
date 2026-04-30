const jwt = require('jsonwebtoken');
const { createTransport } = require('nodemailer');
const verifyLinearUser = require('../utils/linearAuth');

const sendVerificationEmail = async (to, name, token) => {
  const verificationLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify?token=${token}`;

  try {
    const transporter = createTransport({
      host: process.env.MAIL_SMTP,
      pool: true,
      port: parseInt(process.env.MAIL_SMTP_PORT || "465", 10),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    transporter.verify((error) => {
      if (error) console.log("Transporter verification error:", error);
    });

    transporter.sendMail(
      {
        to,
        from: `Webadmin - Point Blank <${process.env.MAIL_USER}>`,
        subject: "Point Blank - Login Link",
        html: `<p>Hello ${name},</p>
<p>Click the link below to sign in to the URL shortener:</p>
<a href="${verificationLink}">Sign In to URL Shortener</a>
<p>This link will expire in 15 minutes (i.e., ${new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })} IST).</p>
<p>If you did not request this, please ignore this email.</p>
<p>Best regards,<br/>Team Point Blank</p>`,
        text: `Hello ${name},\n\nClick the link below to sign in to the URL shortener:\n\n${verificationLink}\n\nThis link will expire in 15 minutes (i.e., ${new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })} IST).\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nTeam Point Blank`,
      },
      (error, info) => {
        if (error) console.error("Error sending email:", error);
      },
    );

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

exports.login = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!process.env.JWT_SECRET || !process.env.SESSION_SECRET) {
      console.error('FATAL: JWT_SECRET or SESSION_SECRET is not set');
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    const user = await verifyLinearUser(email);

    if (!user) {
      // Return a 200 anyway to prevent user enumeration
      return res.json({ message: "If you are an active member, an email has been sent." });
    }

    // Create 15-minute token
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Send the email
    const emailSent = await sendVerificationEmail(user.email, user.name, token);

    if (!emailSent) {
      return res.status(500).json({ error: "Failed to send verification email" });
    }

    res.json({ message: "If you are an active member, an email has been sent." });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verify = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    // Verify the 15m token using JWT_SECRET
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: "Login link has expired" });
      }
      return res.status(401).json({ error: "Invalid or expired login link" });
    }

    // Issue a 1-day session token using SESSION_SECRET
    const sessionToken = jwt.sign(
      {
        email: decoded.email,
        name: decoded.name,
      },
      process.env.SESSION_SECRET,
      { expiresIn: '1d' }
    );

    // Return the new session token to the client
    res.json({ token: sessionToken });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};