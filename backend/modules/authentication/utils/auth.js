const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
const RESET_TOKEN_EXPIRY = process.env.RESET_TOKEN_EXPIRY || '5m';
const OTP_LENGTH = parseInt(process.env.OTP_LENGTH) || 6;
const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;

async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

function generateToken(user) {
    const payload = {
        userId: user.id,
        role: user.role,
        iat: Math.floor(Date.now() / 1000)
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

function generateResetToken(userId) {
    const payload = {
        userId: userId,
        iat: Math.floor(Date.now() / 1000)
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: RESET_TOKEN_EXPIRY });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

function generateOTP() {
    const min = Math.pow(10, OTP_LENGTH - 1);
    const max = Math.pow(10, OTP_LENGTH) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

function getOTPExpiry() {
    return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);
}

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    generateResetToken,
    verifyToken,
    generateOTP,
    getOTPExpiry,
    OTP_LENGTH,
    OTP_EXPIRY_MINUTES
};