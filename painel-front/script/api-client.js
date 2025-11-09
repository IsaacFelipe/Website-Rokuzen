class PainelApiClient {
    constructor(baseUrl) {
        const host = window.location.hostname || '127.0.0.1';
        const defaultBase = `http://${host}:5000/api`;
        this.baseUrl = baseUrl || defaultBase;
    }

    async request(path, options = {}) {
        const url = `${this.baseUrl}${path}`;
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            ...options
        };

        if (config.body && typeof config.body !== 'string') {
            config.body = JSON.stringify(config.body);
        }

        const response = await fetch(url, config);
        if (!response.ok) {
            const message = await this.extractError(response);
            throw new Error(message || `Erro na requisição: ${response.status}`);
        }

        if (response.status === 204) {
            return null;
        }

        return response.json();
    }

    async extractError(response) {
        try {
            const data = await response.json();
            return data?.message;
        } catch (error) {
            return null;
        }
    }

    getDashboardOverview() {
        return this.request('/dashboard/overview');
    }

    getTherapists() {
        return this.request('/therapists');
    }

    createTherapist(payload) {
        return this.request('/therapists', { method: 'POST', body: payload });
    }

    updateTherapist(id, payload) {
        return this.request(`/therapists/${id}`, { method: 'PUT', body: payload });
    }

    deleteTherapist(id) {
        return this.request(`/therapists/${id}`, { method: 'DELETE' });
    }

    getClients() {
        return this.request('/clients');
    }

    createClient(payload) {
        return this.request('/clients', { method: 'POST', body: payload });
    }

    updateClient(id, payload) {
        return this.request(`/clients/${id}`, { method: 'PUT', body: payload });
    }

    deleteClient(id) {
        return this.request(`/clients/${id}`, { method: 'DELETE' });
    }

    getAppointments(date) {
        const query = date ? `?date=${encodeURIComponent(date)}` : '';
        return this.request(`/appointments${query}`);
    }

    createAppointment(payload) {
        return this.request('/appointments', { method: 'POST', body: payload });
    }

    updateAppointment(id, payload) {
        return this.request(`/appointments/${id}`, { method: 'PUT', body: payload });
    }

    deleteAppointment(id) {
        return this.request(`/appointments/${id}`, { method: 'DELETE' });
    }
}

window.PainelApiClient = PainelApiClient;

let resolvedApiUrl;
if (window.PAINEL_API_URL) {
    resolvedApiUrl = window.PAINEL_API_URL;
} else {
    try {
        const url = new URL(window.location.href);
        resolvedApiUrl = url.searchParams.get('api');
    } catch (error) {
        resolvedApiUrl = undefined;
    }
}

window.painelApi = new PainelApiClient(resolvedApiUrl);

