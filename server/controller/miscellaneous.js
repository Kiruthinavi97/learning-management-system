import User from '../models/userModel.js'
import createError from '../utils/error.js'
import sendMail from '../utils/sendMail.js'

export const contactUs = async (req, res, next) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return (next(createError(400, "All input fields are required")))
    }

    const subject = `New message from ${name} (${email})`;
    const textMessage = `
        <h3>From: ${name}</h3>
        <h4>Email: ${email}</h4>
        <br/>
        <p>${message}</p>
    `

    try {
        // Send only to YOUR email (Resend free tier restriction)
        await sendMail(email, process.env.GMAIL_ID, subject, textMessage);

        res.status(200).json({
            success: true,
            message: `Message sent successfully`
        })
    } catch (error) {
        console.error("CONTACT ERROR:", error.message)
        return (next(createError(500, error.message)))
    }
}

export const userStats = async (req, res, next) => {
    try {
        const allUserCount = await User.countDocuments();
        const subscribedUser = await User.countDocuments({
            'subscription.status': 'active'
        });
        res.status(200).json({
            success: true,
            message: 'stats fetched successfully',
            allUserCount,
            subscribedUser
        })
    } catch (error) {
        return (next(createError(400, error.message)))
    }
}