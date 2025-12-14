const API_URL = 'http://localhost:5000/api';

const api = {
    async getNotes(filters = {}) {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_URL}/notes?${params}`);
        return response.json();
    }
};
