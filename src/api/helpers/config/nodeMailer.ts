import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const mailer = (mail:string, subject:string, text:string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USERMAIL,
      pass: process.env.MAILPASS,
    },
  });

  const mailOptions = {
    from: process.env.USERMAIL,
    to: mail,
    subject: subject,
    text: text,
  };
  transporter
    .sendMail(mailOptions)
    .then(() => console.log("Mail sent successfully"))
    .catch((error) => console.error(error.message));
};