const failedRetrieval = "Failed to retrieve item";

const notFound = "No items found";

const requiredFields = "All fields are required";

const errorCreating = "Error creating item";

const duplicatedData = "Item with this identifier already exists";

const wrong = "Something went wrong.";

const requiredUpload = "Please upload a PDF file.";

const duplicateEmail = 'O email já foi utilizado para inscrição.';

const duplicateIdentityNumber = 'O Bilhete de Identidade já foi utilizado para inscrição.';

const invalidCredentials = "Email ou senha incorretas!";

const duplicateActiveLoan = 'Este cliente já possui um empréstimo ativo.';

const requiredCustomer = "Usuário não Associado!.";

const ThrowActiveLoan = "Cliente possui um empréstimo ativo e não pode ser excluído."

const ERROR_MESSAGES = {
    duplicatedData,
    duplicateEmail,
    ThrowActiveLoan,
    requiredCustomer,
    invalidCredentials,
    duplicateActiveLoan,
    duplicateIdentityNumber,
    failedRetrieval,
    requiredFields,
    errorCreating,
    notFound,
    wrong,
    requiredUpload
}

export default ERROR_MESSAGES;