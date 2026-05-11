// FIX #1: Import socket.io-client properly via npm instead of window.io
// Run: npm install socket.io-client  (in smart-parking-web/)
import { io } from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5001/api';

export const fetchAPI = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
    }

    return response.json();
};

// Global Socket.io client — connects to backend on port 5001
export const socket = io('http://localhost:5001');
