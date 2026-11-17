import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';

// Troque pelo IP do computador que roda o Django (ex.: http://192.168.0.10:8000/api). No navegador pode ser localhost.
export const BASE = 'http://localhost:8000/api';

let token = null;
export const setToken = async t => { token = t; t ? await AsyncStorage.setItem('tk', t) : await AsyncStorage.removeItem('tk'); };
export const loadToken = async () => (token = await AsyncStorage.getItem('tk'));

export async function api(path, { method = 'GET', body } = {}, retry = true) {
  const r = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Token ' + token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (r.status === 401 && token && retry) { await setToken(null); return api(path, { method, body }, false); }
  if (r.status === 204) return null;
  const d = await r.json().catch(() => null);
  if (!r.ok) throw new Error(d?.detail || (d ? Object.values(d).flat().join(' ') : 'Erro de conexão'));
  return d;
}

let cfg = null;
export async function getConfig() { return cfg || (cfg = await api('/config/').catch(() => null)); }
export async function whats(msg) {
  const c = await getConfig();
  if (c) Linking.openURL(`https://wa.me/${c.whatsapp}?text=${encodeURIComponent(msg)}`);
}
