import csvParse from 'csv-parse';
import fs from 'fs';

import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(filepath: string): Promise<Transaction[]> {
    const contactsReadStream = fs.createReadStream(filepath);
    const parsers = csvParse({
      from_line: 2, // para não pegar a 1° linha.
    });

    const parseCSV = contactsReadStream.pipe(parsers);

    const transactions = [];
    const categories = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) => {
        return cell.trim();
      });

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });
    await new Promise(resolve => parseCSV.on('end', resolve));

    return { categories, transactions };
  }
}

export default ImportTransactionsService;
