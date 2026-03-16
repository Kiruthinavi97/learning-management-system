import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const sendMail = async (fromMail, toMail, subject, message) => {
    const { error } = await resend.emails.send({
        from: 'onboarding@resend.dev', // use this until you verify your domain
        to: toMail,
        replyTo: fromMail,
        subject: subject,
        html: message
    })

    if (error) {
        throw new Error(error.message)
    }
}

export default sendMail