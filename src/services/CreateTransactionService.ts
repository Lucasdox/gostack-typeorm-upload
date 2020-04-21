// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const transactionRepository = getRepository(Transaction);
    const checkCategoryExists = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });
    if (!checkCategoryExists) {
      const categoryObj = categoryRepository.create({ title: category });
      await categoryRepository.save(categoryObj);
      const category_id = categoryObj.id;
    } else {
      const category_id = checkCategoryExists.id;
    }
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
