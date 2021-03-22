import { useState } from 'react';

import { GlobalStyle } from "./styles/global";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { NewTransactionModal } from './components/NewTransactionModal';
import { TransactionsProvider } from './hooks/useTransactions';

export function App() {
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);

  function handleToggleNewTransactionModal() {
    setIsNewTransactionModalOpen(prevState => !prevState);
  }

  return (
    <TransactionsProvider >
      <GlobalStyle />
      <Header onOpenNewTransactionModal={handleToggleNewTransactionModal} />
      <Dashboard />
      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onRequestClose={handleToggleNewTransactionModal}
      />
    </TransactionsProvider>
  );
};
