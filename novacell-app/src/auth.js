import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setToken, loadToken } from './api';

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [u, setU] = useState(null);
  useEffect(() => { (async () => { if (await loadToken()) setU(JSON.parse((await AsyncStorage.getItem('u')) || 'null')); })(); }, []);
  const login = async (username, password) => {
    const d = await api('/auth/login/', { method: 'POST', body: { username, password } });
    await setToken(d.token); await AsyncStorage.setItem('u', JSON.stringify(d)); setU(d);
  };
  const logout = async () => { await setToken(null); await AsyncStorage.removeItem('u'); setU(null); };
  return <Ctx.Provider value={{ u, login, logout }}>{children}</Ctx.Provider>;
}
