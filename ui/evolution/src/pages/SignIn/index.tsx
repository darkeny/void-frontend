import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import { Alert } from '../../components/Modal/alert';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useAuth } from '../../auth';
import { handleError } from '../../handleError';


const VALID_EMAIL = "jobar@void.co.mz";
const VALID_PASSWORD = "frontend";

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('user');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalText, setModalText] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPasswordField, setShowPasswordField] = useState(false);
    const { setAuth } = useAuth();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const emailValue = event.target.value;
        setEmail(emailValue);
        setShowPasswordField(validateEmail(emailValue));
    };

    const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const onUserTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUserType(event.target.value);
    };

    const onSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        
        if (email === VALID_EMAIL && password === VALID_PASSWORD) {
            navigate('/panel');
        } else {
            setModalText('Email ou senha incorretos!');
            setModalOpen(true);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            <div className="container max-w-7xl mx-auto px-4 sm:px-8">
                <div className="hidden md:block absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.200),white)] opacity-20"></div>
                <div className="hidden md:block absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-left"></div>

                <div data-aos="zoom-in" className="flex items-center justify-center mt-16 sm:mt-32">
                    <div className="w-full md:w-1/2 flex flex-col items-center">
                        <a href='/' className="flex flex-col items-center justify-start">
                            <div className="flex flex-col items-center">
                                <span className='px-5 lg:text-xl text-md pt-20'>Faça login para entrar na sua conta</span>
                            </div>
                        </a>

                        <form onSubmit={onSubmit} className="rounded-lg shadow-2xl bg-white w-full p-4 sm:p-10" encType="multipart/form-data">
                            <div className="text-center">
                                <div className="text-xs sm:text-sm leading-6 text-gray-600">
                                    <div className="mb-2">
                                        <div className="flex items-center justify-center gap-2 rounded-md bg-gray-500 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                                            <FcGoogle className="h-5 w-5" />
                                            Continuar com o Google
                                        </div>
                                    </div>

                                    <div className="py-2">
                                        <input id="email" name="email" type="email" placeholder='Por gentileza Insira o seu email aqui' className="peer mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm" value={email} onChange={onEmailChange} />
                                        {formSubmitted && !email && <p className="text-red-400 text-left text-xs sm:text-sm p-2">Por favor, insira um email válido.</p>}
                                    </div>

                                    {showPasswordField && (
                                        <div className="py-2">
                                            <input id="password" name="password" type="password" placeholder='Insira a senha' className="peer mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm" value={password} onChange={onPasswordChange} />
                                            {formSubmitted && !password && <p className="text-red-400 text-left text-xs sm:text-sm p-2">Por favor, insira uma senha.</p>}
                                        </div>
                                    )}

                                    <div className="py-2">
                                        <label htmlFor="userType" className="block text-xs sm:text-sm text-left ml-2 text-gray-600">Você é um:</label>
                                        <select id="userType" name="userType" className="block w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm" value={userType} onChange={onUserTypeChange}>
                                            <option value="user">Cliente</option>
                                            <option value="admin">Administrador</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 text-center">
                                <button
                                    type="submit"
                                    className="relative rounded-md bg-blue-600 px-8 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <FaSpinner className="animate-spin h-6 w-6" />
                                            <span className="ml-2">Enviando...</span>
                                        </div>
                                    ) : (
                                        'Submeter'
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Link to the signup page */}
                        <div className="mt-4 text-center">
                            <span className="text-xs sm:text-sm text-gray-600">
                                Não tem uma conta?{' '}
                                <Link to="/signup" className="text-blue-600 hover:underline">Inscreva-se</Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <Alert text={modalText} isOpen={modalOpen} onClose={closeModal} />
        </>
    );
};

export { SignIn };
