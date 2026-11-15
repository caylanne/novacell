import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, brl, MARCAS_PECAS } from '../theme';
import { api, getConfig, whats } from '../api';
import { Chips, Field, FadeIn, Btn } from '../ui';

export default function Assistencia() {
  const [marca, setMarca] = useState('');
  const [q, setQ] = useState('');
  const [lista, setLista] = useState([]);
  const [cfg, setCfg] = useState(null);
  useEffect(() => { getConfig().then(setCfg); }, []);
  useEffect(() => {
    const t = setTimeout(() => api(`/pecas/?marca=${marca}&q=${encodeURIComponent(q)}`).then(setLista).catch(() => setLista([])), 250);
    return () => clearTimeout(t);
  }, [marca, q]);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ color: C.muted, marginBottom: 12 }}>Trocamos peças de Samsung, Motorola, Xiaomi e Apple. Confira os modelos e valores abaixo.</Text>
      <Chips opts={MARCAS_PECAS} value={marca} onChange={setMarca} />
      <Field placeholder="Buscar modelo (ex.: Galaxy A15)" value={q} onChangeText={setQ} />
      {lista.map((x, i) => (
        <FadeIn key={x.id} delay={i * 50}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: C.line }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: C.text }}>{x.modelo}</Text>
              <Text style={{ color: C.muted }}>{x.peca}</Text>
            </View>
            {x.disponivel
              ? <Text style={{ fontWeight: '800', color: C.primary, fontSize: 16 }}>{brl(x.preco)}</Text>
              : <Text style={{ color: C.bad, fontWeight: '600' }}>Sem estoque</Text>}
          </View>
        </FadeIn>
      ))}
      <View style={{ backgroundColor: '#FFF1E8', borderRadius: 18, padding: 18, marginTop: 16 }}>
        <Ionicons name="chatbubbles" size={28} color={C.primary} />
        <Text style={{ fontSize: 18, fontWeight: '800', color: C.text, marginTop: 6 }}>Não achou seu modelo?</Text>
        <Text style={{ color: C.text, marginVertical: 6 }}>Outros modelos também podem ter peça disponível. Consulte um atendente.</Text>
        {cfg && <Text style={{ fontWeight: '700', color: C.text, marginBottom: 12 }}>{cfg.telefone}{'\n'}{cfg.horario}{'\n'}{cfg.endereco}</Text>}
        <Btn title="Consultar no WhatsApp" onPress={() => whats(q ? `Olá! Vocês têm peça para o ${q}?` : 'Olá! Gostaria de consultar uma peça para o meu aparelho.')} />
      </View>
    </ScrollView>
  );
}
