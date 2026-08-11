const nodemailer = require('nodemailer');

let transporter = null;

function createTransporter() {
    if (transporter) return transporter;

    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT);
    const user = process.env.SMTP_USER;
    const pass = process.env.BREVO_API_KEY;
    const from = process.env.FROM_EMAIL;

    if (!host || !port || !user || !pass || !from) {
        console.log('Email not configured. OTP will be logged.');
        return null;
    }

    transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: port === 465,
        auth: { user: user, pass: pass }
    });

    return transporter;
}

async function sendEmail(to, subject, text) {
    try {
        const transporter = createTransporter();
        const from = process.env.FROM_EMAIL;

        if (!transporter) {
            console.log('OTP for', to, ':', text);
            return { success: false };
        }

        const info = await transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: text
        });

        console.log('Email sent:', info.messageId);
        return { success: true };

    } catch (error) {
        console.error('Email error:', error.message);
        console.log('OTP for', to, ':', text);
        return { success: false };
    }
}

async function sendOTPEmail(email, otp) {
    const appName = process.env.APP_NAME || 'HRMS';
    const expiry = process.env.OTP_EXPIRY_MINUTES || 10;
    const subject = `OTP for ${appName}`;
    const text = `Your OTP is ${otp}. Valid for ${expiry} minutes.`;
    return await sendEmail(email, subject, text);
}

async function sendPasswordResetEmail(email, otp) {
    const appName = process.env.APP_NAME || 'HRMS';
    const expiry = process.env.OTP_EXPIRY_MINUTES || 10;
    const subject = `Password Reset OTP for ${appName}`;
    const text = `Your password reset OTP is ${otp}. Valid for ${expiry} minutes.`;
    return await sendEmail(email, subject, text);
}

module.exports = {
    sendOTPEmail,
    sendPasswordResetEmail
};