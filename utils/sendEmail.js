const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// config dotenv
dotenv.config({ path: `${__dirname}/../config/config.env` });

async function sendEmail(options) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    // defined transport object, email information
    const { from, to, subject, html } = options;
    const message = {
      from,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(message);

    console.log(`Message sent ${info.messageId}`);

    return {
      result: true
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = sendEmail;
