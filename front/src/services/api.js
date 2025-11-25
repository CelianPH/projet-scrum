const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      // Si la réponse est 204 No Content, retourner null
      if (response.status === 204) {
        return null;
      }

      // Vérifier si la réponse a du contenu avant de parser JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async login(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await this.request('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    return response;
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  async logout() {
    try {
      // Appeler l'endpoint de logout côté backend si un token existe
      const token = localStorage.getItem('token');
      if (token) {
        await this.request('/auth/logout', {
          method: 'POST',
        }).catch(() => {
          // Ignorer les erreurs si le token est déjà invalide
          console.log('Logout endpoint called (token may already be invalid)');
        });
      }
    } catch (error) {
      // Continuer même en cas d'erreur (token peut être déjà expiré)
      console.log('Logout error (non-critical):', error);
    } finally {
      // Toujours nettoyer le localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getCategories() {
    return await this.request('/categories');
  }

  async getStockMovements() {
    return await this.request('/stock-movements');
  }

  // User management methods
  async getUsers() {
    return await this.request('/users');
  }

  async createUser(userData) {
    return await this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId, userData) {
    return await this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId) {
    return await this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Profile management methods
  async updateProfile(profileData) {
    return await this.request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(currentPassword, newPassword) {
    return await this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  }
}

export default new ApiService();
