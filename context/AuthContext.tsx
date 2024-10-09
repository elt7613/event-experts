import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthProps {
  authState?: { token: string | null; authenticated: any | null };
  //   onRegister: (email: string, password: string) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<void>;
  setAuthState: React.Dispatch<React.SetStateAction<any>>;
}

const TOKEN_KEY = 'token';

export const API_URL = 'http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080';

const AuthContext = createContext<AuthProps>({
  setAuthState: () => {},
  onLogin: async (email: string, password: string) => {},
  onLogout: async () => {},
});

export const useAuth = () => {
  const auth = useContext(AuthContext);
  return auth;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: any | null;
  }>({
    token: null,
    authenticated: false,
  });

  // useEffect(() => {
  //   const loadToken = async () => {
  //     const token = await SecureStore.getItemAsync(TOKEN_KEY);
  //     console.log('stored', token);

  //     if (token) {
  //       setAuthState({
  //         token,
  //         authenticated: true,
  //       });
  //       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  //     }
  //   };
  //   loadToken();
  // }, []);

  const Login = async (email: string, password: string) => {};

  const Logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    axios.defaults.headers.common['Authorization'] = '';
    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  //   const onRegister = async (email: string, password: string) => {
  //     const response = await axios.post(`${API_URL}/auth/register`, {
  //       email,
  //       password,
  //     });
  //     setAuthState({
  //       token: response.data.token,
  //       authenticated: response.data.authenticated,
  //     });
  //     await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
  //   };

  const value = {
    onLogin: Login,
    onLogout: Logout,
    authState,
    setAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
