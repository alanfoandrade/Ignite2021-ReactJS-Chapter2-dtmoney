import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {api} from '../services/api';

interface ITransaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
  parsedValue: string;
  parsedDate: string;
}

interface IListTransactionsApiResponse {
  transactions: Array<Omit<ITransaction, 'parsedValue' | 'parsedDate'>>;
}

interface ICreateTransactionsApiResponse {
  transaction: Omit<ITransaction, 'parsedValue' | 'parsedDate'>;
}

type ICreateTransactionDTO = Omit<ITransaction, 'id' | 'createdAt' | 'parsedValue' | 'parsedDate'>;

interface ITransactionsProviderProps {
  children: ReactNode;
}

interface ITransactionsContextData {
  transactions: ITransaction[];
  createTransaction: (transaction: ICreateTransactionDTO) => Promise<void>;
}

const TransactionsContext = createContext<ITransactionsContextData>({} as ITransactionsContextData);

export function TransactionsProvider({ children }: ITransactionsProviderProps) {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  useEffect(() => {
    async function loadTransactions() {
      const { data } = await api.get<IListTransactionsApiResponse>('/transactions')

      const parsedTransactions = data.transactions.map(transaction => ({
        ...transaction,
        parsedValue: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(transaction.type === 'withdraw' ? transaction.amount * -1 : transaction.amount),
        parsedDate: new Intl.DateTimeFormat('pt-BR')
          .format(new Date(transaction.createdAt))
      }))

      setTransactions(parsedTransactions)
    }

    loadTransactions();
  }, [])

  async function createTransaction(transaction: ICreateTransactionDTO) {
    const { data } = await api.post<ICreateTransactionsApiResponse>('/transactions', transaction);

    const parsedTransaction = {
      ...data.transaction,
      parsedValue: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(data.transaction.type === 'withdraw' ? data.transaction.amount * -1 : data.transaction.amount),
      parsedDate: new Intl.DateTimeFormat('pt-BR')
        .format(new Date(data.transaction.createdAt))
    }

    setTransactions(prevState => [...prevState, { ...parsedTransaction }])
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}