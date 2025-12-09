const API_URL = 'http://localhost:5000/api';

class NotesAPI {
    async getNotes(filters = {}) {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.tag) params.append('tag', filters.tag);
        
        const url = `${API_URL}/notes${params.toString() ? '?' + params.toString() : ''}`;
        const response = await fetch(url);
        return await response.json();
    }

    async createNote(noteData) {
        const response = await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });
        return await response.json();
    }

    async updateNote(id, noteData) {
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });
        return await response.json();
    }

    async deleteNote(id) {
        await fetch(`${API_URL}/notes/${id}`, {
            method: 'DELETE'
        });
    }

    async getTags() {
        const response = await fetch(`${API_URL}/tags`);
        return await response.json();
    }
}

const api = new NotesAPI();
