const { createTransport } = require('nodemailer');
require('dotenv').config();

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

transporter.verify(function(error, success) {
  if (error) {
    console.log("SMTP Connection Error:");
    console.log(error);
  } else {
    console.log("SMTP Connection Success!");
  }
});
