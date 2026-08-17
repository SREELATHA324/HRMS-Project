const nodemailer = require('nodemailer');

let transporter = null;

function createTransporter() {
    if (transporter) return transporter;

    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS || process.env.BREVO_API_KEY;
    const from = process.env.FROM_EMAIL;

    if (!host || !port || !user || !pass || !from) {
        console.log('Email not configured. OTP will be logged.');
        return null;
    }

    transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: port === 465,
        auth: { 
            user: user, 
            pass: pass 
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    return transporter;
}

async function sendEmail(to, subject, html, text) {
    try {
        const transporter = createTransporter();
        const from = process.env.FROM_EMAIL;

        if (!transporter) {
            console.log('Email not sent to', to, ':', text || '');
            return { success: false, message: 'Email service not configured' };
        }

        const mailOptions = {
            from: from,
            to: to,
            subject: subject,
        };

        if (html) {
            mailOptions.html = html;
        } else if (text) {
            mailOptions.text = text;
        } else {
            mailOptions.text = subject;
        }

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Email error:', error.message);
        console.log('Fallback - would send to', to, ':', text || '');
        return { success: false, message: error.message };
    }
}

async function sendOTPEmail(email, otp) {
    const appName = process.env.APP_NAME || 'HRMS';
    const expiry = process.env.OTP_EXPIRY_MINUTES || 10;
    const subject = `OTP for ${appName}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: inline-block; background: #4f46a5; color: white; padding: 10px 24px; border-radius: 8px; font-size: 24px; font-weight: 700;">${appName}</div>
            </div>
            <h2 style="color: #111827; text-align: center;">Password Reset OTP</h2>
            <p style="color: #6b7280; text-align: center; font-size: 16px;">Use the following OTP to reset your password:</p>
            <div style="text-align: center; padding: 20px; margin: 20px 0; background: #f3f4f6; border-radius: 8px;">
                <span style="font-size: 32px; font-weight: 700; letter-spacing: 4px; color: #111827;">${otp}</span>
            </div>
            <p style="color: #6b7280; text-align: center; font-size: 14px;">This OTP is valid for ${expiry} minutes.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #9ca3af; text-align: center; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
    `;
    const text = `Your OTP is ${otp}. Valid for ${expiry} minutes.`;
    return await sendEmail(email, subject, html, text);
}

async function sendPasswordResetEmail(email, otp) {
    return await sendOTPEmail(email, otp);
}

async function sendWelcomeEmail(email, name, tempPassword) {
    const appName = process.env.APP_NAME || 'HRMS';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const subject = `Welcome to ${appName} - Your Account Details`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: inline-block; background: #4f46a5; color: white; padding: 10px 24px; border-radius: 8px; font-size: 24px; font-weight: 700;">${appName}</div>
            </div>
            <h2 style="color: #111827;">Welcome, ${name}!</h2>
            <p style="color: #6b7280; font-size: 16px;">Your account has been created successfully. Here are your login credentials:</p>
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 4px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
            </div>
            <p style="color: #6b7280;">Please login and change your password immediately.</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${frontendUrl}/login" style="display: inline-block; background: #4f46a5; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Login to ${appName}</a>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #9ca3af; text-align: center; font-size: 12px;">This is an automated message. Please do not reply.</p>
        </div>
    `;
    const text = `Welcome to ${appName}!\n\nYour account has been created.\nEmail: ${email}\nTemporary Password: ${tempPassword}\n\nLogin: ${frontendUrl}/login`;
    return await sendEmail(email, subject, html, text);
}

module.exports = {
    sendOTPEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail
};