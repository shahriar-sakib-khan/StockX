// src/utils/logOnce.js
const loggedMessages = new Set();

export function logOnce(message, ...optionalParams) {
    if (!loggedMessages.has(message)) {
        console.log(message, ...optionalParams);
        loggedMessages.add(message);
    }
}
