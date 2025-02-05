import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert } from '../Modal/alert';
import { DeleteModal } from '../Modal/deleteModal';

const API_BASE = 'https://sonil-dev.void.co.mz/api/v4';
const LOGIN_CREDENTIALS = {
    username: 'alexandre.coelho@ubi.co.mz',
    password: 'ubidev987',
};

interface Sector {
    id: string;
    name: string;
}

interface Area {
    id: string;
    name: string;
}

const Customers: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [selectedSector, setSelectedSector] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alertText, setAlertText] = useState('');

    // Autenticação e obtenção do token
    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const response = await axios.post(`${API_BASE}/users/login`, LOGIN_CREDENTIALS);
                setToken(response.data?.data?.token);
            } catch (error) {
                console.error('Erro ao autenticar:', error);
            }
        };

        authenticateUser();
    }, []);

    // Buscar setores quando o token estiver disponível
    useEffect(() => {
        if (!token) return;

        const fetchSectors = async () => {
            try {
                const response = await axios.get<{ data: { data: Sector[] } }>(
                    `${API_BASE}/sectors/all/de190ded-d23c-410c-89ac-89faf4dfb36a`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSectors(response.data?.data?.data || []);
            } catch (error) {
                console.error('Erro ao buscar setores:', error);
            }
        };

        fetchSectors();
    }, [token]);

    // Buscar áreas quando um setor for selecionado
    useEffect(() => {
        if (!selectedSector || !token) return;

        const fetchAreas = async () => {
            try {
                const response = await axios.get<{ data: Area[] }>(
                    `${API_BASE}/areas?sector=${selectedSector}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAreas(response.data?.data || []);
            } catch (error) {
                console.error('Erro ao buscar áreas:', error);
            }
        };

        fetchAreas();
    }, [selectedSector, token]);

    return (
        <div className="container mx-auto">
            <div className="flex gap-4 mb-4">
                {/* Campo de pesquisa */}
                <input
                    type="search"
                    placeholder="Pesquisar por técnico..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2 bg-white h-10 px-5 pr-16 rounded-lg text-sm w-full"
                />

                {/* Select de setores */}
                <select
                    className="border-2 h-10 px-3 rounded-lg"
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                >
                    <option value="">Selecione um setor</option>
                    {sectors.length > 0 ? (
                        sectors.map((sector) => (
                            <option key={sector.id} value={sector.id}>
                                {sector.name}
                            </option>
                        ))
                    ) : (
                        <option value="">Carregando setores...</option>
                    )}
                </select>

                {/* Select de áreas */}
                <select
                    className="border-2 h-10 px-3 rounded-lg"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                >
                    <option value="">Selecione uma área</option>
                    {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                            {area.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tabela de técnicos (você pode preencher os dados quando tiver) */}
            <table className="min-w-full divide-y divide-gray-200 shadow-2xl">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">ID</th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Área</th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Técnico</th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Semana 1</th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Semana 2</th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Semana 3</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  
                </tbody>
            </table>

            {/* Modal de alerta */}
            <Alert text={alertText} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Customers;
