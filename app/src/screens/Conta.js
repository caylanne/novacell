import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { C } from '../theme';
import { useAuth } from '../auth';
import { Field, Btn, FadeIn, notify } from '../ui';
import Admin from './Admin';

export default function Conta() {
  const { u, login, logout } = useAuth();
  const [un, setUn] = useState('');
  const [pw, setPw] = useState('');
  if (u?.is_staff) return <Admin onSair={logout} nome={u.username} />;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 24 }}>
      <FadeIn>
        <Text style={{ fontSize: 24, fontWeight: '800', color: C.text }}>Área da equipe</Text>
        <Text style={{ color: C.muted, marginVertical: 8 }}>Entre para atualizar preços, peças e taxas do cartão.</Text>
        <Field label="Usuário" value={un} onChangeText={setUn} autoCapitalize="none" />
        <Field label="Senha" value={pw} onChangeText={setPw} secureTextEntry />
        <Btn title="Entrar" onPress={() => login(un.trim(), pw).catch(e => notify(e.message))} />
      </FadeIn>
    </ScrollView>
  );
}
