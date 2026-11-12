const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
};

export default asyncHandler;
//Sua única e principal função é capturar erros automaticamente em funções assíncronas (async/await) e repassá-los para o gerenciador de erros global do Express.