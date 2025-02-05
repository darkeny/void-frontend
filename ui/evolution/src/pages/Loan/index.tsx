import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "../../components/Navbar";
import { Alert } from "../../components/Modal/alert";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import axios from "axios";
import { handleError } from "../../handleError";
import { useFetchUserData } from "../../utils";
import { SuccessAlert } from "../../components/Modal/successAlert";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_APP_API_URL;

const Loan: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useFetchUserData();
    const userId = user.userId;
    const role = user.role;


    const [formData, setFormData] = useState({
        loanAmount: "",
        paymentTerm: Number(), // Prazo de pagamento
        paymentMethod: "",
        accountNumber: "", // Número da conta
        collateral: "",
        installments: Number(), // Número de parcelas selecionado
        isPartialPayment: true, // Para o checkbox de pZgamento total
        customerId: "",
    });


    const [error, setError] = useState(""); // Para armazenar mensagens de erro
    const [alertText, setAlertText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]); // Para armazenar as imagens da garantia
    const fileInputRef = useRef<HTMLInputElement>(null); // Referência para o campo de arquivos oculto
    formData.customerId = userId

    // Atualiza automaticamente o campo de prazo com base no valor do empréstimo
    useEffect(() => {
        const loanAmountValue = parseFloat(formData.loanAmount);

        if (!isNaN(loanAmountValue)) {
            if (loanAmountValue >= 5000) {
                setFormData(prevState => ({
                    ...prevState,
                    paymentTerm: 30 // Um mês
                }));
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    paymentTerm: Number() // Reseta o campo se o valor for menor que 1000
                }));
            }
        }
    }, [formData.loanAmount]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;

        if (type === "checkbox") {
            setFormData(prevState => ({
                ...prevState,
                [name]: checked,
                installments: checked ? Number() : prevState.installments, // Limpa parcelas se o pagamento total for selecionado
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }

        // Limpa a mensagem de erro ao alterar os campos
        setError("");
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            installments: checked ? 0 : NaN, // Usa `NaN` para "resetar" mantendo o tipo `number`
        }));
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filesList = e.target.files;
        if (filesList) {
            setFiles(Array.from(filesList));
        }
    };

    const handleFileButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validação: Verificar se todos os campos estão preenchidos
        if (!formData.loanAmount || !formData.paymentMethod || !formData.collateral || !formData.accountNumber || files.length === 0) {
            setAlertText('Todos os campos são obrigatórios.');
            setIsModalOpen(true);
            return;
        }

        // Validação: Verificar se é um administrador
        if (role === "ADMIN") {
            setAlertText('Administradores não têm permissão para solicitar crédito!');
            setIsModalOpen(true);
            return;
        }

        // Validação: fazer com que apenas valores apartir de 10k sejam parcelados
        if (parseFloat(formData.loanAmount) < 10000) {
            formData.isPartialPayment = true;
        }

        // Validação: Não aceitar valores menores que 5000 MT
        const loanAmountValue = parseFloat(formData.loanAmount);
        if (isNaN(loanAmountValue) || loanAmountValue < 5000) {
            setAlertText("O valor mínimo para solicitar o empréstimo é de 5000 MT.");
            setIsModalOpen(true);
            return;
        }

        setLoading(true); // Set loading to true when form submission starts

        try {
            // Lógica de submissão do formulário
            const response = await axios.post(`${apiUrl}/ibuildLoan`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                // Sucesso: exibe a mensagem de sucesso e abre o modal de sucesso
                setAlertText('Empréstimo criado com sucesso');
                setIsModalSuccessOpen(true);

                setTimeout(() => {
                    navigate('/mypanel');
                }, 3000);

                // Limpar o formulário após sucesso
                setFormData({
                    loanAmount: "",
                    paymentTerm: Number(), // Prazo de pagamento
                    paymentMethod: "",
                    accountNumber: "", // Número da conta
                    collateral: "",
                    installments: Number(), // Número de parcelas selecionado
                    isPartialPayment: true, // Para o checkbox de pagamento total
                    customerId: "",
                });
            } else {
                // Sucesso: exibe a mensagem de sucesso e abre o modal de sucesso
                setAlertText('Empréstimo criado com sucesso');
                setIsModalSuccessOpen(true);

                setTimeout(() => {
                    navigate('/mypanel');
                }, 3000);

                // Limpar o formulário após sucesso
                setFormData({
                    loanAmount: "",
                    paymentTerm: Number(), // Prazo de pagamento
                    paymentMethod: "",
                    accountNumber: "", // Número da conta
                    collateral: "",
                    installments: Number(), // Número de parcelas selecionado
                    isPartialPayment: true, // Para o checkbox de pagamento total
                    customerId: "",
                });
            }
        } catch (error: any) {
            console.error('Error sending message:', error);
            const errorMessage = handleError(error); // Tratamento de erro centralizado
            setAlertText(errorMessage)
            setIsModalOpen(true); // Abre o modal de erro   
        } finally {
            setLoading(false); // Finalize a ação de loading após sucesso ou erro
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsModalSuccessOpen(false);
    };

    // Lógica para mostrar o campo de parcelas e o checkbox
    const loanAmountValue = parseFloat(formData.loanAmount);
    const shouldShowInstallmentsField = loanAmountValue >= 10000 && !formData.isPartialPayment;
    const shouldShowCheckbox = loanAmountValue >= 10000;

    // Mostrar o campo de número de conta baseado na forma de pagamento
    const shouldShowAccountNumberField = formData.paymentMethod !== "";

    return (
        <>
            <Navbar />
            <div className="hidden md:block absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.200),white)] opacity-20"></div>
            <div className="hidden md:block absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-left"></div>
            <div data-aos="zoom-in" className="flex justify-center items-center min-h-screen">
                <div className="bg-gradient-to-br from-gray-100 via-white to-gray-100 rounded-lg shadow-xl w-full max-w-screen-xl p-8 mx-4 relative overflow-hidden before:content-[''] before:absolute before:w-48 before:h-48 before:bg-gradient-to-r before:from-gray-400 before:to-blue-500 before:opacity-20 before:rounded-full before:top-0 before:left-0 before:-translate-x-1/2 before:-translate-y-1/2 after:content-[''] after:absolute after:w-64 after:h-64 after:bg-gradient-to-r after:from-yellow-400 after:to-red-500 after:opacity-20 after:rounded-full after:bottom-0 after:right-0 after:translate-x-1/2 after:translate-y-1/2">
                    <h2 className="lg:text-3xl text-xl font-extrabold text-center text-gray-800 mb-6">Solicitação de crédito</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Informação do Empréstimo */}
                        <div>
                            <h3 className="lg:text-xl text-md font-bold text-gray-700 mb-4">Informação do Empréstimo</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700">Valor do Empréstimo</label>
                                    <input
                                        type="number"
                                        name="loanAmount"
                                        value={formData.loanAmount}
                                        onChange={handleInputChange}
                                        placeholder="Insira o valor do empréstimo"
                                        className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    />
                                    {error && (
                                        <p className="text-red-500 text-sm mt-2">{error}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                                    <div className="flex-1 relative">
                                        <label className="block text-sm font-medium text-gray-700">Valor a Pagar (MZN)</label>
                                        <input
                                            type="number"
                                            name="amount"  // Corrigido o nome do campo
                                            value={parseFloat(formData.loanAmount) * 1.30} // Exibe o valor calculado
                                            onChange={handleInputChange}  // Pode ser mantido se necessário para outros inputs
                                            placeholder="O valor a pagar será preenchido automaticamente"
                                            className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            readOnly  // Impede a edição
                                        />

                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700">Prazo de Pagamento (dias)</label>
                                        <input
                                            type="number"
                                            name="paymentTerm"
                                            value={formData.paymentTerm}
                                            onChange={handleInputChange}
                                            placeholder="O prazo será preenchido automaticamente"
                                            className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700">Forma de Pagamento</label>
                                    <select
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleInputChange}
                                        className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" disabled>Selecione o banco</option>
                                        <option value="Absa Bank">Absa Bank Moçambique</option>
                                        <option value="Millenium Bim">Millenium Bim</option>
                                        <option value="M-pesa">M-Pesa</option>
                                        <option value="E-mola">E-Mola</option>
                                    </select>
                                </div>

                                {/* Campo de Número da Conta */}
                                {shouldShowAccountNumberField && (
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700">Número da Conta</label>
                                        <input
                                            type="text"
                                            name="accountNumber"
                                            value={formData.accountNumber}
                                            onChange={handleInputChange}
                                            placeholder="Insira o número da conta"
                                            className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700">Garantia</label>
                                    <input
                                        type="text"
                                        name="collateral"
                                        value={formData.collateral}
                                        onChange={handleInputChange}
                                        placeholder="Insira a garantia"
                                        className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex flex-col gap-6 md:flex-row lg:pt-7 md:items-start">
                                    {/* Checkbox de Pagamento Total */}
                                    {shouldShowCheckbox && (
                                        <div className="relative flex items-center gap-2 md:w-1/2">
                                            <input
                                                type="checkbox"
                                                name="isPartialPayment"
                                                checked={formData.isPartialPayment}
                                                onChange={handleInputChange}
                                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                id="isPartialPayment"
                                            />
                                            <label htmlFor="isPartialPayment" className="text-sm font-medium text-gray-700">
                                                Efectuar Pagamento Integral
                                            </label>
                                        </div>
                                    )}

                                    {/* Campo de Parcelas */}
                                    {shouldShowInstallmentsField && (
                                        <div className="flex flex-col md:w-1/2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Número de Parcelas</label>
                                            <div className="flex flex-col gap-2 md:flex-row">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        id="first"
                                                        type="radio"
                                                        name="installments"
                                                        value="2"
                                                        checked={formData.installments === 2}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                installments: Number(e.target.value),
                                                            }))
                                                        }
                                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="first" className="text-sm font-medium text-gray-700">
                                                        2 parcelas
                                                    </label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        id="second"
                                                        type="radio"
                                                        name="installments"
                                                        value="3"
                                                        checked={formData.installments === 3}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                installments: Number(e.target.value),
                                                            }))
                                                        }
                                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="second" className="text-sm font-medium text-gray-700">
                                                        3 parcelas
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>


                                {/* Botão para Upload de Arquivo */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700">Imagens da Garantia</label>
                                    <button
                                        type="button"
                                        onClick={handleFileButtonClick}
                                        className="mt-2 block w-full p-3 rounded-lg border border-slate-400 text-slate-600 bg-white hover:bg-blue-50 focus:ring-2 focus:ring-blue-500"
                                    >
                                        {files.length > 0 ? 'Imagens Carregadas' : 'Carregar Imagens'}
                                        {files.length > 0 && (
                                            <IoCheckmarkDoneOutline className="h-6 w-6 inline ml-2 text-green-500" />
                                        )}
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 px-4 text-white font-bold rounded-lg shadow-lg transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {loading ? "Enviando..." : "Enviar Solicitação"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {isModalOpen && (
                <Alert
                    isOpen={isModalOpen}
                    text={alertText}
                    onClose={handleCloseModal}
                />
            )}

            {isModalSuccessOpen && (
                <SuccessAlert
                    isOpen={isModalSuccessOpen}
                    text={alertText}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default Loan;


