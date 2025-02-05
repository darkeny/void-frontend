import React, { useEffect, useState } from 'react';
import { FaLongArrowAltDown } from "react-icons/fa";
import { FaLongArrowAltUp } from "react-icons/fa";
import { authenticateUser, fetchSectors, fetchAreas, fetchInsumos } from '../../axios/api';
import { Alert } from '../Modal/alert';

interface Viveiro {
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
    const [viveiro, setViveiro] = useState<Viveiro[]>([]);
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

    useEffect(() => {
        if (!token) return;
        fetchInsumos(token).then((data) => {
            console.log("Insumos brutos:", data);

            // Transformando os dados no formato esperado
            if (data && data.sectors) {
                const formattedData = data.sectors.map(sector => ({
                    sector: sector.name,
                    area_name: "-", // Adapte conforme necessário
                    technician_name: "-", // Adapte conforme necessário
                    producers: sector.totalFarmers || 0,
                    seeds_x_distributed: sector.packages.find(p => p.name === "Semente X")?.sent || 0,
                    seeds_x_received: sector.packages.find(p => p.name === "Semente X")?.received || 0,
                    seeds_y_distributed: sector.packages.find(p => p.name === "Semente Y")?.sent || 0,
                    seeds_y_received: sector.packages.find(p => p.name === "Semente Y")?.received || 0,
                }));

                setViveiro(formattedData);
            }
        });
    }, [token]);






    const filteredData = Array.isArray(viveiro) ? viveiro.filter(({ sector }) => {
        const sectorName = sectors.find(s => s.id === selectedSector)?.name.toLowerCase();
        return (!selectedSector || sector.toLowerCase() === sectorName);
    }) : [];

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
                        <>
                            {filteredData.map((row, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 text-xs">{row.sector}</td>
                                    <td className="px-6 py-4 text-xs">{row.area_name}</td>
                                    <td className="px-6 py-4 text-xs">{row.technician_name}</td>
                                    <td className="px-6 py-4 text-xs">{Number(row.producers).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-xs">{Number(row.seeds_x_distributed).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-xs">{Number(row.seeds_x_received).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-xs">{Number(row.seeds_y_distributed).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-xs">{Number(row.seeds_y_received).toFixed(2)}</td>
                                </tr>
                            ))}

                            {/* Linha de total */}
                            <tr className="bg-gray-100 font-bold">
                                <td className="px-6 py-4 text-xs leading-5 text-gray-700" colSpan={3}>Total</td>
                                <td className="px-6 py-4 text-xs leading-5 text-gray-700">
                                    {filteredData.reduce((sum, row) => sum + (Number(row.producers) || 0), 0).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-xs leading-5 text-gray-700">
                                    {filteredData.reduce((sum, row) => sum + (Number(row.seeds_x_distributed) || 0), 0).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-xs leading-5 text-gray-700">
                                    {filteredData.reduce((sum, row) => sum + (Number(row.seeds_x_received) || 0), 0).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-xs leading-5 text-gray-700">
                                    {filteredData.reduce((sum, row) => sum + (Number(row.seeds_y_distributed) || 0), 0).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-xs leading-5 text-gray-700">
                                    {filteredData.reduce((sum, row) => sum + (Number(row.seeds_y_received) || 0), 0).toFixed(2)}
                                </td>
                            </tr>
                        </>
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
