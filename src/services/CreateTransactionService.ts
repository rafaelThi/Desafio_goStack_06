import { getCustomRepository, getRepository } from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface RequestParms {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestParms): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const categoryRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }

    let nameTransactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!nameTransactionCategory) {
      nameTransactionCategory = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(nameTransactionCategory);
    }
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: nameTransactionCategory,
    });
    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
