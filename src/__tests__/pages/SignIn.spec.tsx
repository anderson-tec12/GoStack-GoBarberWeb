import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

/*
  Senha = renderiza um componente
  fireEvent = simula uma interação comc a tela
*/

/*
  Criando um mock global para o arquivo de teste
  podemos mocar qualquer modulo ou função
*/
const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

/*
  () => ({
      signIn: jest.fn(),
    })
*/

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }), // função vazia
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/AuthContext', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

jest.mock('../../hooks/ToastContext', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignIn Page', () => {
  // limpando mock a cadas teste
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('Should be able to sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    // selecionando um elemento da pagina
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, {
      target: { value: 'johndoe@exemple.com.br' },
    });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    // disparando um click nesse botão
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('Should not be able to sign in with incalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    // selecionando um elemento da pagina
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, {
      target: { value: '' },
    });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    // disparando um click nesse botão
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('Should display an error if login error', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    // selecionando um elemento da pagina
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, {
      target: { value: 'johndoe@exemple.com.br' },
    });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    // disparando um click nesse botão
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
