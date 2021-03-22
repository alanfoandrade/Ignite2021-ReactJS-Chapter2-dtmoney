import React from 'react';
import { createServer, Model } from 'miragejs';

import ReactDOM from 'react-dom';
import { App } from './App';

createServer({
  models: {
    transaction: Model,
  },

  seeds(server) {
    server.db.loadData({
      transactions: [
        {
          id: 1,
          title: 'Freelance website',
          type: 'deposit',
          category: 'Dev',
          amount: 6000,
          createdAt: new Date('2021-03-21 21:04')
        },
        {
          id: 2,
          title: 'Freelance mobile',
          type: 'deposit',
          category: 'Dev',
          amount: 9000,
          createdAt: new Date('2021-03-15 21:04')
        },
        {
          id: 3,
          title: 'Aluguel',
          type: 'withdraw',
          category: 'Moradia',
          amount: 2000,
          createdAt: new Date('2021-03-05 21:04')
        },
        {
          id: 4,
          title: 'Supermercado',
          type: 'withdraw',
          category: 'Alimentação',
          amount: 600,
          createdAt: new Date('2021-03-12 21:04')
        },
        {
          id: 5,
          title: 'Horas PJ',
          type: 'deposit',
          category: 'Dev',
          amount: 4000,
          createdAt: new Date('2021-03-18 21:04')
        },
      ],
    })
  },

  routes() {
    this.namespace = 'api';

    this.get('/transactions', () => {
      return this.schema.all('transaction');
    });

    this.post('/transactions', (schema, request) => {
      const data = JSON.parse(request.requestBody);

      return schema.create('transaction', { ...data, createdAt: new Date() });
    });
  }
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);