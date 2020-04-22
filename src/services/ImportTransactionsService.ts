import path from 'path';
import fs from 'fs';
import parse from 'csv-parse';
import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();
    const transactionsData: Transaction[] = [];
    const csvrows: string[] = [];
    const filePath = path.join(uploadConfig.directory, filename);
    const promise1 = await fs
      .createReadStream(filePath)
      .pipe(parse({ delimiter: ':' }));

    await new Promise((resolve, reject) => {
      promise1.on('data', csvrow => {
        resolve(csvrows.push(csvrow));
      });
    });
    await new Promise((resolve, reject) => {
      promise1.on('end', () => {
        resolve(csvrows.splice(0, 1));
      });
    });
    for (const row of csvrows) {
      const type = row[0].split(',')[1] === 'income' ? 'income' : 'outcome';
      const [title, , value, category] = row[0].split(',');
      const transaction = await createTransaction.execute({
        title,
        type,
        value: Number(value),
        category,
      });
      await transactionsData.push(transaction);
    }
    return transactionsData;
  }
}

export default ImportTransactionsService;
