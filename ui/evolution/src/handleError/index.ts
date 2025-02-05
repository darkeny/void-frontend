import ERROR_MESSAGES from "../constants/error-messages";

const handleError = (error: any) => {
    if (error.response && error.response.data) {
        const { error: errorMessage } = error.response.data;

        if (errorMessage === ERROR_MESSAGES.duplicateEmail) {
            return ERROR_MESSAGES.duplicateEmail;
        }
        if (errorMessage === ERROR_MESSAGES.requiredFields) {
            return ERROR_MESSAGES.requiredFields;
        }
        if (errorMessage === ERROR_MESSAGES.duplicateIdentityNumber) {
            return ERROR_MESSAGES.duplicateIdentityNumber;
        }
        if (errorMessage === ERROR_MESSAGES.invalidCredentials) {
            return ERROR_MESSAGES.invalidCredentials;
        }
        if (errorMessage === ERROR_MESSAGES.requiredCustomer) {
            return ERROR_MESSAGES.requiredCustomer;
        }
        if (errorMessage === ERROR_MESSAGES.duplicateActiveLoan) {
            return ERROR_MESSAGES.duplicateActiveLoan;
        }
        if (errorMessage === ERROR_MESSAGES.ThrowActiveLoan) {
            return ERROR_MESSAGES.ThrowActiveLoan;
        }
    }
    return 'Usuário ou senha incorreto.';
};

export { handleError }





