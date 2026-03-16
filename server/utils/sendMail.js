import nodemailer from 'nodemailer'

const sendMail = async (fromMail, toMail, subject, message) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_ID,
            pass: process.env.APP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    await transporter.sendMail({
        from: process.env.GMAIL_ID,  // must be your Gmail, not user-submitted email
        to: toMail,
        replyTo: fromMail,           // user's email goes here so you can reply to them
        subject: subject,
        html: message
    })
}

export default sendMail