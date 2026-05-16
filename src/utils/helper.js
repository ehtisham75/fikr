import { DeviceEventEmitter } from 'react-native';

const Helper = {
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    validateEmail: (email) => {
        return Helper.emailRegex.test(email);
    },

    strongPasswordRegex: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    validatePassword: (password) => {
        return Helper.strongPasswordRegex.test(password);
    },

    phoneRegex: /^\d{10}$/,
    validatePhone: (phone) => {
        return Helper.phoneRegex.test(phone);
    }
};

export default Helper;

export const showToast = (type, header, text) => {
    DeviceEventEmitter.emit('showToast', { type, header, text });
}

export const getDeviceTimeZone = () => {
    try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return timeZone;
    } catch (error) {
        console.log('Error getting timezone:', error);
        return null;
    }
};

export const formatStatusLabel = (status) => {
    if (!status || typeof status !== 'string') return '';
    return status
        .split(/[_\s]+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}