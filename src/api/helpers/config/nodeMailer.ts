import nodemailer from "nodemailer";
import dotenv from "dotenv";

import logger from "@/utils/logger";

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
    .then(() => logger.info("Mail sent successfully"))
    .catch((error) => logger.error(error.message));
};