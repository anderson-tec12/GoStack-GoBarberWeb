import MockAdapter from 'axios-mock-adapter';
import { renderHook } from '@testing-library/react-hooks';
import { useAuth, AuthProvider } from '../../hooks/AuthContext';
import api from '../../services/apiClient';

const apiMock = new MockAdapter(api);

describe('Auth Context', () => {
  it('Should be able to sign in ', async () => {
    apiMock.onPost('sessions').reply(200, {
      user: {
        id: 'user123',
        name: 'Jhoe doe',
        email: 'johnjow@exemplae.com',
      },
      token: 'token-123-123',
    });
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'johnjow@exemplae.com',
      password: '123456',
    });

    await waitForNextUpdate();
    expect(result.current.user.email).toEqual('johnjow@exemplae.com');
  });
});
