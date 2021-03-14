import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Globalstyle from './styles/global';
// import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';

// Contexto global
// import { AuthProvider } from './hooks/AuthContext';
// import { ToastProvider } from './hooks/ToastContext';

import Routes from './Router';
import AppProvider from './hooks';

const App: React.FC = () => (
  <BrowserRouter>
    <AppProvider>
      <Routes />
    </AppProvider>

    {/* <SignUp /> */}
    <Globalstyle></Globalstyle>
  </BrowserRouter>
);

export default App;
