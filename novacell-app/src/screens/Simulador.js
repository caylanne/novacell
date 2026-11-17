import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { C } from '../theme';
import { Field } from '../ui';
import Parcelas from '../Parcelas';

export default function Simulador() {
  const [v, setV] = useState('');
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ color: C.muted, marginBottom: 14 }}>Digite o valor da compra ou do conserto e veja as parcelas no cartão de crédito.</Text>
      <Field label="Valor (R$)" value={v} onChangeText={setV} keyboardType="decimal-pad" placeholder="Ex.: 2500" />
      <Parcelas valor={Number(v.replace(',', '.'))} />
    </ScrollView>
  );
}
