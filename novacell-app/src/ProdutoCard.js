import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, brl } from './theme';
import { FadeIn, Press } from './ui';

export default function ProdutoCard({ p, onPress, i = 0, width }) {
  return (
    <FadeIn delay={i * 70} style={width ? { width } : null}>
      <Press onPress={onPress} style={{ backgroundColor: C.card, borderRadius: 18, padding: 12, marginBottom: 12, marginRight: width ? 12 : 0, borderWidth: 1, borderColor: C.line }}>
        <View style={{ height: 130, borderRadius: 12, backgroundColor: '#FFF1E8', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {p.imagem ? <Image source={{ uri: p.imagem }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
            : <Ionicons name="phone-portrait-outline" size={56} color={C.primary} />}
        </View>
        <Text style={{ color: C.text, fontWeight: '700', fontSize: 16, marginTop: 10 }} numberOfLines={1}>{p.nome}</Text>
        <Text style={{ color: p.condicao === 'novo' ? C.ok : C.accent, fontWeight: '600', marginTop: 2 }}>
          {p.condicao === 'novo' ? 'Novo' : 'Seminovo'}{p.armazenamento ? `, ${p.armazenamento}` : ''}
        </Text>
        <Text style={{ color: C.primary, fontWeight: '800', fontSize: 20, marginTop: 6 }}>{brl(p.preco)}</Text>
      </Press>
    </FadeIn>
  );
}
