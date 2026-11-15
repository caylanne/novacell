import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { C, brl } from './theme';
import { api } from './api';
import { FadeIn } from './ui';

export default function Parcelas({ valor }) {
  const [r, setR] = useState([]);
  useEffect(() => {
    if (!(valor > 0)) { setR([]); return; }
    const t = setTimeout(() => api('/simulacao/?valor=' + valor).then(setR).catch(() => {}), 350);
    return () => clearTimeout(t);
  }, [valor]);
  return (
    <View>
      {r.map((x, i) => (
        <FadeIn key={x.parcelas} delay={i * 40}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 1, borderColor: C.line }}>
            <Text style={{ color: C.text }}>{x.parcelas}x de <Text style={{ fontWeight: '800' }}>{brl(x.parcela)}</Text></Text>
            <Text style={{ color: C.muted }}>total {brl(x.total)}</Text>
          </View>
        </FadeIn>
      ))}
    </View>
  );
}
