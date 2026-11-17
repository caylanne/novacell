import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { C } from '../theme';
import { api } from '../api';
import { Chips, Field } from '../ui';
import ProdutoCard from '../ProdutoCard';

export default function Catalogo({ navigation }) {
  const [cond, setCond] = useState('');
  const [marca, setMarca] = useState('');
  const [q, setQ] = useState('');
  const [lista, setLista] = useState([]);
  useEffect(() => {
    const t = setTimeout(() => api(`/produtos/?condicao=${cond}&marca=${marca}&q=${encodeURIComponent(q)}`).then(setLista).catch(() => setLista([])), 250);
    return () => clearTimeout(t);
  }, [cond, marca, q]);
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingHorizontal: 16 }}>
      <Field placeholder="Buscar modelo" value={q} onChangeText={setQ} />
      <Chips value={cond} onChange={setCond} opts={[['', 'Todos'], ['novo', 'Novos'], ['seminovo', 'Seminovos']]} />
      <Chips value={marca} onChange={setMarca} opts={[['', 'Todas as marcas'], ['apple', 'Apple'], ['xiaomi', 'Xiaomi']]} />
      <FlatList data={lista} keyExtractor={p => String(p.id)} contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={<Text style={{ color: C.muted, textAlign: 'center', marginTop: 40 }}>Nenhum aparelho encontrado. Tente outro filtro.</Text>}
        renderItem={({ item, index }) => <ProdutoCard p={item} i={index} onPress={() => navigation.navigate('Detalhe', { p: item })} />} />
    </View>
  );
}
