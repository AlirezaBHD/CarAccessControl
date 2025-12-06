import axios from 'axios';

export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_BASE_URL,
    API_BASE_URL: (import.meta.env.VITE_BASE_URL || "http://localhost:5005") + "/api",
};


const api = axios.create({
    baseURL: API_CONFIG.API_BASE_URL,
});

export const cameraAPI = {
    getAll: () => api.get('/cameras'),
    getById: (id) => api.get(`/cameras/${id}`),
    create: (data) => api.post('/cameras', data),
    update: (id, data) => api.put(`/cameras/${id}`, data),
    delete: (id) => api.delete(`/cameras/${id}`),
};

export const vehicleOwnerAPI = {
    getAll: () => api.get('/vehicle-owners'),
    getById: (id) => api.get(`/vehicle-owners/${id}`),
    create: (data) => api.post('/vehicle-owners', data),
    update: (id, data) => api.put(`/vehicle-owners/${id}`, data),
    delete: (id) => api.delete(`/vehicle-owners/${id}`),
};

export const gateAPI = {
    getAll: () => api.get('/gates'),
    getById: (id) => api.get(`/gates/${id}`),
    create: (data) => api.post('/gates', data),
    update: (id, data) => api.put(`/gates/${id}`, data),
    delete: (id) => api.delete(`/gates/${id}`),
};

export const vehicleAPI = {
    getAll: () => api.get('/vehicles'),
    getById: (id) => api.get(`/vehicles/${id}`),
    create: (data) => api.post('/vehicles', data),
    update: (id, data) => api.put(`/vehicles/${id}`, data),
    delete: (id) => api.delete(`/vehicles/${id}`),
};

export const accessEventAPI = {
    getAll: () => api.get('/access-events'),
    getById: (id) => api.get(`/access-events/${id}`),
    exportReport: (filters) => {
        return api.get('/access-events/report', {
            params: filters,
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/json',
            }
        });

    },
    delete: (id) => api.delete(`/access-events/${id}`),

    connectWebSocket: (onMessage) => {
        const ws = new WebSocket('ws://localhost:5000/access-events');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data);
        };
        return ws;
    },
    update: (id, data) => api.patch(`/access-events/${id}`, data),
};