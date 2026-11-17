import React from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, brl } from '../theme';
import { FadeIn, Float, Btn } from '../ui';
import { whats } from '../api';
import Parcelas from '../Parcelas';

export default function Detalhe({ route }) {
  const p = route.params.p;
  const info = [p.armazenamento, p.cor, p.bateria ? `Bateria ${p.bateria}%` : null].filter(Boolean).join(', ');
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20 }}>
      <View style={{ height: 240, borderRadius: 22, backgroundColor: '#FFF1E8', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {p.imagem ? <Image source={{ uri: p.imagem }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
          : <Float><Ionicons name="phone-portrait-outline" size={110} color={C.primary} /></Float>}
      </View>
      <FadeIn delay={100}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: C.text, marginTop: 18 }}>{p.nome}</Text>
        <Text style={{ color: p.condicao === 'novo' ? C.ok : C.accent, fontWeight: '700', marginTop: 2 }}>{p.condicao === 'novo' ? 'Novo' : 'Seminovo'}</Text>
        {info ? <Text style={{ color: C.muted, marginTop: 4 }}>{info}</Text> : null}
        <Text style={{ fontSize: 32, fontWeight: '800', color: C.primary, marginVertical: 12 }}>{brl(p.preco)}</Text>
        {p.descricao ? <Text style={{ color: C.text, lineHeight: 22, marginBottom: 16 }}>{p.descricao}</Text> : null}
        <Btn title="Tenho interesse (WhatsApp)" onPress={() => whats(`Olá! Tenho interesse no ${p.nome} (${p.condicao}) de ${brl(p.preco)}.`)} />
      </FadeIn>
      <Text style={{ fontSize: 18, fontWeight: '800', color: C.text, marginTop: 28 }}>Parcelamento no cartão</Text>
      <Text style={{ color: C.muted, marginBottom: 6 }}>Simulação com as taxas da maquininha. O valor final é confirmado na loja.</Text>
      <Parcelas valor={Number(p.preco)} />
    </ScrollView>
  );
}
