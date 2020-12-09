// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';

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

    const transaction = transactionRepository.create({
      title,
      value,
      type,
    });
    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
