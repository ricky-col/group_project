import nodemailer from "nodemailer";

export const sendInviteMail = async (email, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Board Invitation 🚀",
    html: `
      <h2>You are invited to collaborate</h2>
      <a href="${link}">Click to join</a>
    `,
  });
};