import * as nodemailer from 'nodemailer';


export  const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: null,
  tls: {
    rejectUnauthorized: false,
  },
});


