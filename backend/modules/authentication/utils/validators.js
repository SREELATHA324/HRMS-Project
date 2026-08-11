function validateEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    if (!password) return false;
    if (password.length < 8) return false;
    if (password.length > 128) return false;
    return true;
}

function validateOTP(otp) {
    if (!otp) return false;
    const length = parseInt(process.env.OTP_LENGTH) || 6;
    const regex = new RegExp(`^\\d{${length}}$`);
    return regex.test(otp);
}

function validateLoginInput(email, password) {
    const errors = [];
    
    if (!email || !validateEmail(email)) {
        errors.push('Valid email is required');
    }
    
    if (!password || password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

function validateForgotPasswordInput(email) {
    const errors = [];
    
    if (!email || !validateEmail(email)) {
        errors.push('Valid email is required');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

function validateOTPInput(email, otp) {
    const errors = [];
    
    if (!email || !validateEmail(email)) {
        errors.push('Valid email is required');
    }
    
    if (!otp || !validateOTP(otp)) {
        errors.push('Valid OTP is required');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

function validateResetPasswordInput(password, confirmPassword) {
    const errors = [];
    
    if (!password || !validatePassword(password)) {
        errors.push('Password must be at least 8 characters');
    }
    
    if (password !== confirmPassword) {
        errors.push('Passwords do not match');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

module.exports = {
    validateEmail,
    validatePassword,
    validateOTP,
    validateLoginInput,
    validateForgotPasswordInput,
    validateOTPInput,
    validateResetPasswordInput
};