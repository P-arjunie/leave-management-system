import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        console.log('Making API request:', config.method.toUpperCase(), config.url);
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Token added to request headers');
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('API response received:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('API error:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.response?.data?.message || error.message
        });

        if (error.response?.status === 401) {
            console.log('Unauthorized access, clearing token');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Generic API call function
export const apiCall = async (method, url, data = null) => {
    try {
        console.log(`Making ${method.toUpperCase()} request to ${url}`);
        let response;
        
        switch (method.toLowerCase()) {
            case 'get':
                response = await api.get(url);
                break;
            case 'post':
                response = await api.post(url, data);
                break;
            case 'put':
                response = await api.put(url, data);
                break;
            case 'delete':
                response = await api.delete(url);
                break;
            default:
                throw new Error(`Unsupported HTTP method: ${method}`);
        }
        
        console.log(`Response from ${url}:`, response.data);
        return response;
    } catch (error) {
        console.error(`Error in ${method.toUpperCase()} request to ${url}:`, error);
        throw error;
    }
};

// Auth functions
export const login = async (credentials) => {
    console.log('Login attempt with credentials:', credentials);
    try {
        const response = await apiCall('post', '/login', credentials);
        console.log('Login response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
};

export const register = async (userData) => {
    return apiCall('post', '/register', userData);
};

export const logout = async () => {
    return apiCall('post', '/logout');
};

export const getUser = async () => {
    return apiCall('get', '/user');
};

// Leave management functions
export const getLeaves = async () => {
    return apiCall('get', '/leaves');
};

export const createLeave = async (leaveData) => {
    return apiCall('post', '/leaves', leaveData);
};

export const getLeave = async (id) => {
    return apiCall('get', `/leaves/${id}`);
};

export const updateLeave = async (id, leaveData) => {
    return apiCall('put', `/leaves/${id}`, leaveData);
};

export const getUserLeaves = async (userId) => {
    return apiCall('get', `/users/${userId}/leaves`);
};

// Admin API calls
export const getEmployees = () => apiCall('get', '/admin/employees');