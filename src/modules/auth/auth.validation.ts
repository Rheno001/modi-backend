export const validateRegister = (data: any) => {
    const errors: string[] = [];

    if (!data.firstName || data.firstName.trim() === '') {
        errors.push('First name is required');
    }

    if (!data.lastName || data.lastName.trim() === '') {
        errors.push('Last name is required');
    }

    if (!data.email || data.email.trim() === '') {
        errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Email is invalid');
    }

    if (!data.password) {
        errors.push('Password is required');
    } else if (data.password.length < 8) {
        errors.push('Password must be at least 8 characters');
    } else if (!/[A-Z]/.test(data.password)) {
        errors.push('Password must contain at least one uppercase letter');
    } else if (!/[0-9]/.test(data.password)) {
        errors.push('Password must contain at least one number');
    }

    return errors;
};

export const validateLogin = (data: any) => {
    const errors: string[] = [];

    if (!data.email || data.email.trim() === '') {
        errors.push('Email is required');
    }

    if (!data.password || data.password.trim() === '') {
        errors.push('Password is required');
    }

    return errors;
};