import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport( {
    host: process.env.EMAIL_HOST,
    port: process.env.PORT,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
        user: process.env.EMAIL_USER,//ADMIN EMAIL ID
        pass: process.env.EMAIL_PASS//ADMIN PASSWORD
    },
    tls: {
        rejectUnauthorized: false, // This may be necessary depending on your email service
    },
    connectionTimeout: 20000, // Timeout in milliseconds
    socketTimeout: 20000,
    logger: true, // Enable logging
    debug: true 
} )

export default transporter;
