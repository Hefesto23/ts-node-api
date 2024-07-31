class ApiError extends Error {
  public readonly statusCode: number;
  public isOperational: boolean = true;

  /**
  * Cria uma nova instância da classe ApiError.
  *
  * @param {string} message - A mensagem de erro.
  * @param {number} [statusCode=400] - O código de status HTTP.
  * @param {boolean} [isOperational=true] - Indica se o erro é operacional.
  * @param {string} [stack=''] - O rastreamento na pilha de arquivos.
  */
  constructor(message: string, statusCode = 400, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
