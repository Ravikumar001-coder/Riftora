import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.jsx';
import { AppProviders } from './app/AppProviders.jsx';
import { Agentation } from 'agentation';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProviders>
      <App />
      {import.meta.env.DEV && <Agentation />}
    </AppProviders>
  </React.StrictMode>,
);
