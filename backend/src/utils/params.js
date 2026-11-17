import { AppError } from './appError.js';

export function lerInteiroPositivo(valor, nome = 'id') {
  if (typeof valor !== 'string' || !/^\d{1,9}$/.test(valor) || Number(valor) <= 0) {
    throw new AppError(`${nome} inválido`, 400);
  }
  return Number(valor);
}