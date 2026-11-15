import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';
import { FadeIn, Float, Btn, Press } from '../ui';
import { api, whats } from '../api';
import ProdutoCard from '../ProdutoCard';

const INFO = [
  ['phone-portrait', 'Aparelhos novos', 'iPhone e Xiaomi lacrados', 'Catálogo'],
  ['refresh-circle', 'Seminovos', 'iPhones revisados com garantia', 'Catálogo'],
  ['construct', 'Assistência técnica', 'Samsung, Motorola, Xiaomi e Apple', 'Assistência'],
  ['card', 'Simule no cartão', 'Parcele em até 12x', 'Simulador'],
];

export default function Home({ navigation }) {
  const [dest, setDest] = useState([]);
  useEffect(() => { api('/produtos/?destaque=1').then(setDest).catch(() => {}); }, []);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <LinearGradient colors={[C.amber, C.primary, C.accent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 28, paddingTop: 64, paddingBottom: 36, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 }}>
        <Float><Ionicons name="phone-portrait" size={72} color="#fff" /></Float>
        <FadeIn delay={150}><Text style={{ color: '#fff', fontSize: 40, fontWeight: '800', marginTop: 12 }}>novacell</Text></FadeIn>
        <FadeIn delay={300}><Text style={{ color: '#fff', fontSize: 17, marginTop: 4, marginBottom: 20 }}>Seu próximo celular e o conserto do atual, no mesmo lugar.</Text></FadeIn>
        <FadeIn delay={450}>
          <Btn title="Ver catálogo" onPress={() => navigation.navigate('Catálogo')} outline style={{ backgroundColor: '#fff', borderRadius: 14, marginBottom: 10 }} />
          <Press onPress={() => whats('Olá! Vim pelo app da Novacell.')}><Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700', padding: 8 }}>Falar com um atendente</Text></Press>
        </FadeIn>
      </LinearGradient>

      {dest.length > 0 && (
        <View style={{ padding: 20, paddingRight: 0 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 12 }}>Em destaque</Text>
          <FlatList horizontal showsHorizontalScrollIndicator={false} data={dest} keyExtractor={p => String(p.id)}
            renderItem={({ item, index }) => <ProdutoCard p={item} i={index} width={200} onPress={() => navigation.navigate('Catálogo', { screen: 'Detalhe', params: { p: item } })} />} />
        </View>
      )}

      <View style={{ padding: 20 }}>
        {INFO.map(([ic, t, s, to], i) => (
          <FadeIn key={t} delay={i * 90}>
            <Press onPress={() => navigation.navigate(to)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: C.line }}>
              <Ionicons name={ic} size={30} color={C.primary} />
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text style={{ fontWeight: '700', fontSize: 16, color: C.text }}>{t}</Text>
                <Text style={{ color: C.muted }}>{s}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={C.muted} />
            </Press>
          </FadeIn>
        ))}
      </View>
    </ScrollView>
  );
}
