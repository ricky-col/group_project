import nodemailer from "nodemailer";

export const sendInviteMail = async (email, link) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    family: 4, // Force IPv4 to prevent ENETUNREACH on IPv6 in Render
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false
    }
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