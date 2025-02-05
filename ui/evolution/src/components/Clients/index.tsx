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

const Customers: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [sectors, setSectors] = useState<Sector[]>([]);

    const [areas, setAreas] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSector, setSelectedSector] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alertText, setAlertText] = useState('');

    // Authenticate user and get token
    useEffect(() => {
        authenticateUser();
    }, []);

    // Fetch data when token is available
    useEffect(() => {
        if (token) {
            fetchSectors();
            fetchData();
        }
    }, [token]);

    // Fetch areas when a sector is selected
    useEffect(() => {
        if (selectedSector) {
            fetchAreas(selectedSector);
        }
    }, [selectedSector]);

    const authenticateUser = async () => {
        try {
            const response = await axios.post(`${API_BASE}/users/login`, LOGIN_CREDENTIALS);
            setToken(response.data.data.token);
        } catch (error) {
            console.error('Erro ao autenticar:', error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://sonil-dev.void.co.mz/api/v4/last-week/de190ded-d23c-410c-89ac-89faf4dfb36a?=&_limit=10`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(response.data);
            console.log("Dados do setor", response)
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };
    const fetchSectors = async () => {
        try {
            const response = await axios.get<{ data: Sector[] }>(`${API_BASE}/sectors/all/de190ded-d23c-410c-89ac-89faf4dfb36a`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Acesse os dados corretamente
            setSectors(response.data.data);
        } catch (error) {
            console.error('Erro ao buscar setores:', error);
        }
    };

    const fetchAreas = async (sectorId: string) => {
        
        try {
            const response = await axios.get(`https://sonil-dev.void.co.mz/api/v4/areas?sector=${sectorId}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { sector: sectorId },
            });
            setAreas(response.data);
        } catch (error) {
            console.error('Erro ao buscar áreas:', error);
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex gap-4 mb-4">
                <input
                    type="search"
                    placeholder="Pesquisar por técnico..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2 bg-white h-10 px-5 pr-16 rounded-lg text-sm w-full"
                />
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
                <select
                    className="border-2 h-10 px-3 rounded-lg"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                >
                    <option value="">Selecione uma área</option>
                  
                    {areas.map((area) => (
                        <option key={area.id} value={area.id}>{area.name}</option>
                    ))} 
                </select>
            </div>

            <table className="min-w-full divide-y divide-gray-200 shadow-2xl">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">id</th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Área</th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Técnico</th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Semana 1</th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Semana 2</th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Semana 3</th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Eliminar</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((technician_id) => (
                        <tr key={technician_id.id}>
                            <td className="px-6 py-4 text-xs text-gray-500">{technician_id.sector}</td>
                            <td className="px-6 py-4 text-xs text-gray-500">{technician_id.area}</td>
                            <td className="px-6 py-4 text-xs text-gray-500">{technician_id.tecnico}</td>
                            <td className="px-6 py-4 text-xs text-gray-500">{technician_id.semana1}</td>
                            <td className="px-6 py-4 text-xs text-gray-500">{technician_id.semana2}</td>
                            <td className="px-6 py-4 text-xs text-gray-500">{technician_id.semana3}</td>
                            <td className="px-6 py-4 text-lg text-gray-500">
                                <DeleteModal text="Eliminar" subtitles="Tem certeza?" onSubmit={() => console.log(`Excluir ID: ${technician_id.id}`)} id={technician_id.id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Alert text={alertText} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Customers;
