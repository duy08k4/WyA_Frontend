import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IonReactRouter } from '@ionic/react-router';
import { store } from './redux/store';
import { Provider } from 'react-redux';

import { ToastProvider } from './hooks/toastMessage/toast';
import { SpinnerProvider } from './hooks/spinner/spinner';
import { CacheProvider } from './hooks/cache/cache';
import { SocketProvider } from './hooks/socket/socket';
import AppPage from './App';



const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <SpinnerProvider>
      <ToastProvider>
        <CacheProvider>
          <IonReactRouter>
            <SocketProvider>
              <AppPage />
            </SocketProvider>
          </IonReactRouter>
        </CacheProvider>
      </ToastProvider>
    </SpinnerProvider>
  </Provider>
);