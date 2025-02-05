import axios from 'axios';

const API_BASE = 'https://sonil-dev.void.co.mz/api/v4';

const LOGIN_CREDENTIALS = {
    username: 'alexandre.coelho@ubi.co.mz',
    password: 'ubidev987',
};

export const authenticateUser = async () => {
    try {
        const response = await axios.post(`${API_BASE}/users/login`, LOGIN_CREDENTIALS);
        return response.data?.data?.token;
    } catch (error) {
        console.error('Erro ao autenticar:', error);
        return null;
    }
};

export const fetchProgress = async (token: string) => {
    try {
        const response = await axios.get(`${API_BASE}/last-week/de190ded-d23c-410c-89ac-89faf4dfb36a?=&_limit=10`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data?.data?.technicians || [];
    } catch (error) {
        console.error('Erro ao buscar progressos:', error);
        return [];
    }
};

export const fetchSectors = async (token: string) => {
    try {
        const response = await axios.get(`${API_BASE}/sectors/all/de190ded-d23c-410c-89ac-89faf4dfb36a`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data?.data?.data || [];
    } catch (error) {
        console.error('Erro ao buscar setores:', error);
        return [];
    }
};

export const fetchAreas = async (token: string, selectedSector: string) => {
    try {
        const response = await axios.get(`${API_BASE}/areas?sector=${selectedSector}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data?.data || [];
    } catch (error) {
        console.error('Erro ao buscar áreas:', error);
        return [];
    }
};

export const fetchInsumos = async (token: string) => {
    try {
        const response = await axios.get(`${API_BASE}/analytics/farm-inputs/23e9336a-b20a-4478-a58f-875cc065e871?offset=1&limit=10?&filter=&phase=nurseries`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data?.data || [];
        
    } catch (error) {
        console.error('Erro ao buscar insumos:', error);
        return [];
    }
};
