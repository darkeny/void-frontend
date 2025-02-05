import React, { useState } from 'react';
import { useAuth } from '../../auth';
import Clients from '../../components/Clients';
import { Link } from 'react-router-dom';
import Insumos from '../../components/Insumos';
const Panel: React.FC = () => {

    const { logout } = useAuth();

    const handleSignOut = () => {
        logout();
    };

    const [activeTab, setActiveTab] = useState<'progress_analysis' | 'insumos' >('progress_analysis');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const renderContent = () => {
        if (activeTab === 'progress_analysis') {
            return <Clients />;
        }
        return (

            <>
                <Insumos />
            </>
        );

    };

    return (
        <>
            <div className="min-h-full">
                <nav className="bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <Link to={'/'}>
                                    <div className="flex-shrink-0">
                                        <img className="h-8 w-8" src="https://i.ibb.co/236WzwHz/Grupo-2917.png" alt="Your Company" />
                                    </div>
                                </Link>
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-4">
                                        <a href="#"
                                            className={`rounded-md px-3 py-2 text-sm font-medium ${activeTab === 'progress_analysis' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} onClick={() => setActiveTab('progress_analysis')} aria-current="page">Analise de Progresso
                                        </a>
                                        <a href="#"
                                            className={`rounded-md px-3 py-2 text-sm font-medium ${activeTab === 'insumos' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} onClick={() => setActiveTab('insumos')}>Insumos
                                        </a>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </nav>

                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-2xl font-extralight text-gray-900">Plataforma de Gestão</h1>
                    </div>
                </header>
                <main className='bg-gray-10 mx-44'>
                    <div className="mx-auto  px-4 py-6 sm:px-6 lg:px-8 ">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.200),white)] opacity-20"></div>
                        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-left"></div>
                        {/* <!-- Your content --> */}
                        {renderContent()}
                    </div>
                </main>
            </div>
        </>
    );
};

export default Panel;
