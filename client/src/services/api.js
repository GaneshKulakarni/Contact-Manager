const API_URL = '/api';

export const contactAPI = {
    // Get all contacts
    getAll: async (sort = '-createdAt') => {
        try {
            const response = await fetch(`${API_URL}/contacts?sort=${sort}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch contacts');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Get deleted contacts
    getDeleted: async () => {
        try {
            const response = await fetch(`${API_URL}/contacts/deleted`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch deleted contacts');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Create new contact
    create: async (contactData) => {
        try {
            const response = await fetch(`${API_URL}/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create contact');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Update contact
    update: async (id, contactData) => {
        try {
            const response = await fetch(`${API_URL}/contacts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update contact');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Delete contact (soft delete)
    delete: async (id) => {
        try {
            const response = await fetch(`${API_URL}/contacts/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete contact');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Restore contact
    restore: async (id) => {
        try {
            const response = await fetch(`${API_URL}/contacts/${id}/restore`, {
                method: 'PUT',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to restore contact');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Permanently delete contact
    permanentDelete: async (id) => {
        try {
            const response = await fetch(`${API_URL}/contacts/${id}/permanent`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to permanently delete contact');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Toggle favorite
    toggleFavorite: async (id) => {
        try {
            const response = await fetch(`${API_URL}/contacts/${id}/favorite`, {
                method: 'PUT',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to toggle favorite');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },
};
