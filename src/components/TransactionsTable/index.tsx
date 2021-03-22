import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Container } from './styles';

interface ITransaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
  parsedValue?: string;
  parsedDate?: string;
}

export function TransactionsTable() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  useEffect(() => {
    async function loadTransactions() {
      const { data } = await api.get<{ transactions: ITransaction[] }>('/transactions')

      const parsedTransactions = data.transactions.map(transaction => ({
        ...transaction,
        parsedValue: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(transaction.amount),
        parsedDate: new Intl.DateTimeFormat('pt-BR')
          .format(new Date(transaction.createdAt))
      }))

      setTransactions(parsedTransactions)
    }

    loadTransactions();
  }, [])

  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.title}</td>
              <td className={transaction.type}>{transaction.parsedValue}</td>
              <td>{transaction.category}</td>
              <td>{transaction.parsedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};
