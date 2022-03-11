import nodemailer from "nodemailer";
import { __prod__ } from "../constants";

export async function sendEmail(to: string, html: string) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: __prod__ ? "smtp.gmail.com" : "smtp.ethereal.email",
        port: __prod__ ? 465 : 587,
        secure: __prod__,
        auth: {
            user: __prod__
                ? process.env.GMAIL_USERNAME
                : "nlpqy7qigfx6d5qc@ethereal.email", // generated ethereal user
            pass: __prod__ ? process.env.GMAIL_PASSWORD : "Zb79zCQ5jQ96GZGqrx", // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: __prod__ ? process.env.GMAIL_USERNAME : "example@example.com", // sender address
        to, // list of receivers
        subject: "Change password", // Subject line
        html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
