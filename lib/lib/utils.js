"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRequest = void 0;
const apiRequest = async ({ url, method, data }) => {
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error('Response wasn`t ok!');
    }
    return await response.json();
};
exports.apiRequest = apiRequest;
