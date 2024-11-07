const nodemailer = require("nodemailer");

class MailService {
  passwordResetMessage = {};

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.GMAIL_HOST,
      port: process.env.GMAIL_PORT,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }
  async sendPasswordResetEmail(to, link) {
    await this.transporter
      .sendMail({
        from: process.env.GMAIL,
        to,
        subject: "Замена пароля на портале ML PORTAL",
        secure: true,
        text: "",
        html: `<div><h3>Для смены пароля пройдите по ссылке</h3><a href=${link}>${
          "Смена пароля для " + to
        }</a></div>`,
      })
      .then(() => {
        console.log("Message send succes");
        return true;
      })
      .catch((error) => {
        console.log("email", error.message);
        return false;
      });
  }
}

module.exports = new MailService();
