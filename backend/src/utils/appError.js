export class AppError extends Error {
  constructor(mensagem, status = 500) {
    super(mensagem);
    this.status = status;
  }
}

export default AppError;