import nodemailer from "nodemailer";

const sendEmail = async (emailTo, emailSubject, emailText) => {
  let transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  let mailOption = {
    from: `Onestopmtb <${process.env.RECIPIENT_EMAIL}>`,
    to: emailTo,
    subject: emailSubject,
    text: emailText,
  };
  return await transport.sendMail(mailOption);
};

export default sendEmail;
