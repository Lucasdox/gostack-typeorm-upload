import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import { getRepository } from 'typeorm';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getRepository(Transaction);
    const transaction = await transactionsRepository.findOne(id);
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }
    transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
