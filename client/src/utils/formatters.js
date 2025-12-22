/**
 * Global formatting utilities for dates and currency
 * Use these functions throughout the application for consistent formatting
 */

/**
 * Format date to MM/DD/YYYY or localized format
 * @param {string|Date} date - Date to format
 * @param {string} format - 'short' (MM/DD/YYYY), 'long' (Dec 21, 2025), 'full' (December 21, 2025)
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'short') => {
    if (!date) return 'N/A';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Check if date is valid
    if (isNaN(dateObj.getTime())) return 'Invalid Date';

    const month = dateObj.getMonth() + 1; // 0-indexed
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthNamesShort = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    switch (format) {
        case 'long':
            return `${monthNamesShort[dateObj.getMonth()]} ${day}, ${year}`;
        case 'full':
            return `${monthNames[dateObj.getMonth()]} ${day}, ${year}`;
        case 'short':
        default:
            return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
    }
};

/**
 * Format date with time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date with time (MM/DD/YYYY HH:MM AM/PM)
 */
export const formatDateTime = (date) => {
    if (!date) return 'N/A';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return 'Invalid Date';

    const datePart = formatDate(dateObj, 'short');

    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12

    const minutesStr = minutes.toString().padStart(2, '0');

    return `${datePart} ${hours}:${minutesStr} ${ampm}`;
};

/**
 * Format currency to USD with exactly 2 decimal places
 * @param {number|string} amount - Amount to format
 * @param {boolean} showSymbol - Whether to show $ symbol (default: true)
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, showSymbol = true) => {
    if (amount === null || amount === undefined || amount === '') return showSymbol ? '$0.00' : '0.00';

    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numAmount)) return showSymbol ? '$0.00' : '0.00';

    // Round to 2 decimal places (half-up rounding)
    const rounded = Math.round(numAmount * 100) / 100;

    // Format with exactly 2 decimal places
    const formatted = rounded.toFixed(2);

    return showSymbol ? `$${formatted}` : formatted;
};

/**
 * Format number with commas for thousands
 * @param {number|string} number - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (number) => {
    if (number === null || number === undefined || number === '') return '0';

    const num = typeof number === 'string' ? parseFloat(number) : number;

    if (isNaN(num)) return '0';

    return num.toLocaleString('en-US');
};

/**
 * Parse date string in YYYY-MM-DD format to Date object
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {Date} Date object
 */
export const parseDate = (dateString) => {
    if (!dateString) return null;

    const parts = dateString.split('-');
    if (parts.length !== 3) return null;

    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // 0-indexed
    const day = parseInt(parts[2]);

    return new Date(year, month, day);
};

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date for input
 */
export const formatDateForInput = (date) => {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return '';

    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};
