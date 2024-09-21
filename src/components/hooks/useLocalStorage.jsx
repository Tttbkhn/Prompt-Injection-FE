import { useState } from 'react';
import decodeToken from '../helper/jwt-decode';

export const useLocalStorage = (keyName, defaultValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const value = window.localStorage.getItem(keyName);
            if (value) {
                const decoded = decodeToken(value);
                return decoded;
            } else {
                window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
                return defaultValue;
            }
        } catch (err) {
            return defaultValue;
        }
    });

    const setValue = newValue => {
        try {
            window.localStorage.setItem(keyName, JSON.stringify(newValue));
        } catch (err) {
            console.log(err);
        }
        const decodedNewValue = decodeToken(newValue);
        setStoredValue(decodedNewValue);
    };

    return [storedValue, setValue];
};
