import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { store } from './redux/store';
import { Provider } from 'react-redux';

import { ToastProvider } from './components/toastMessage/toast';
import { SpinnerProvider } from './components/spinner/spinner';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <SpinnerProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </SpinnerProvider>
  </Provider>
);