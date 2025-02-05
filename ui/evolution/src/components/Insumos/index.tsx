import React, { useEffect, useState } from 'react';
import { FaLongArrowAltDown } from "react-icons/fa";
import { FaLongArrowAltUp } from "react-icons/fa";
import { authenticateUser, fetchSectors, fetchAreas } from '../../axios/api';
import { Alert } from '../Modal/alert';

interface Distribution {
    sector: string;
    area_name: string;
    technician_name: string;
    producers: number;
    seeds_x_distributed: number;
    seeds_x_received: number;
    seeds_y_distributed: number;
    seeds_y_received: number;
}

interface Sector {
    id: string;
    name: string;
}

interface Area {
    id: string;
    name: string;
}

const Insumos: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [data, setData] = useState<Distribution[]>([]);
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [selectedSector, setSelectedSector] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alertText, setAlertText] = useState('');

    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await authenticateUser();
            setToken(userToken);
        };
        fetchToken();
    }, []);



    useEffect(() => {
        if (!token) return;
        fetchSectors(token).then(setSectors);
    }, [token]);

    useEffect(() => {
        if (!selectedSector || !token) return;
        fetchAreas(token, selectedSector).then(setAreas);
    }, [selectedSector, token]);

    const filteredData = data.filter(({ sector, area_name }) => {
        const sectorName = sectors.find(s => s.id === selectedSector)?.name.toLowerCase();
        const areaName = areas.find(a => a.id === selectedArea)?.name.toLowerCase();
        return (!selectedSector || sector.toLowerCase() === sectorName)
            && (!selectedArea || area_name.toLowerCase() === areaName);
    });

    return (


        <div className="container mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Distribuição Viveiros</h2>
                <div className="flex items-center gap-4">
                    <div className="flex gap-4">
                        <select
                            className="border-2 h-10 px-3 rounded-lg"
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value)}
                        >
                            <option value="">Sector</option>
                            {sectors.map((sector) => (
                                <option key={sector.id} value={sector.id}>
                                    {sector.name}
                                </option>
                            ))}
                        </select>

                        <select
                            className="border-2 h-10 px-3 rounded-lg"
                            value={selectedArea}
                            onChange={(e) => setSelectedArea(e.target.value)}
                        >
                            <option value="">Area</option>
                            {areas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-8 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                        Adicionar Distribuição
                        <FaLongArrowAltUp />
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-8 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                        Exportar Relatórios
                        <FaLongArrowAltDown />
                    </button>
                </div>
            </div>


            <table className="min-w-full divide-y divide-gray-200 shadow-2xl">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Sector</th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Área</th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Técnico</th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Produtores</th>
                        <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500" colSpan={2}>Semente X</th>
                        <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500" colSpan={2}>Semente Y</th>
                    </tr>
                    <tr>
                        <th className="px-6 py-3"></th>
                        <th className="px-6 py-3"></th>
                        <th className="px-6 py-3"></th>
                        <th className="px-6 py-3"></th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Distribuidores</th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Recebidores</th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Distribuidores</th>
                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Recebidores</th>
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.length > 0 ? (
                        filteredData.map((row, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 text-xs">{row.sector}</td>
                                <td className="px-6 py-4 text-xs">{row.area_name}</td>
                                <td className="px-6 py-4 text-xs">{row.technician_name}</td>
                                <td className="px-6 py-4 text-xs">{row.producers}</td>
                                <td className="px-6 py-4 text-xs">{row.seeds_x_distributed}</td>
                                <td className="px-6 py-4 text-xs">{row.seeds_x_received}</td>
                                <td className="px-6 py-4 text-xs">{row.seeds_y_distributed}</td>
                                <td className="px-6 py-4 text-xs">{row.seeds_y_received}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="px-6 py-4 text-center text-gray-500 text-lg font-medium">
                                Nenhuma distribuição encontrada
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Alert text={alertText} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Insumos;
