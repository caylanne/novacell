import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Switch } from 'react-native';
import { C, brl } from '../theme';
import { api } from '../api';
import { Chips, Field, Btn, Press, FadeIn, notify, confirmar } from '../ui';

const MARCAS = ['apple', 'samsung', 'motorola', 'xiaomi'];
const CFG = {
  produtos: {
    campos: [
      { k: 'nome', l: 'Nome' }, { k: 'marca', l: 'Marca', o: ['apple', 'xiaomi'] }, { k: 'condicao', l: 'Condição', o: ['novo', 'seminovo'] },
      { k: 'armazenamento', l: 'Armazenamento' }, { k: 'cor', l: 'Cor' }, { k: 'bateria', l: 'Bateria % (seminovos)', n: 1 },
      { k: 'preco', l: 'Preço (R$)', n: 1 }, { k: 'descricao', l: 'Descrição' }, { k: 'imagem', l: 'Link da imagem' },
      { k: 'destaque', l: 'Mostrar em destaque', b: 1 }, { k: 'ativo', l: 'Visível no catálogo', b: 1, d: true },
    ],
    titulo: p => p.nome, sub: p => `${p.condicao}, ${brl(p.preco)}${p.ativo ? '' : ' (oculto)'}`,
  },
  pecas: {
    campos: [
      { k: 'marca', l: 'Marca', o: MARCAS }, { k: 'modelo', l: 'Modelo' }, { k: 'peca', l: 'Peça (tela, bateria...)' },
      { k: 'preco', l: 'Preço (R$)', n: 1 }, { k: 'disponivel', l: 'Disponível', b: 1, d: true },
    ],
    titulo: p => `${p.modelo}, ${p.peca}`, sub: p => `${p.marca}, ${brl(p.preco)}${p.disponivel ? '' : ' (sem estoque)'}`,
  },
  taxas: {
    campos: [{ k: 'parcelas', l: 'Parcelas', n: 1 }, { k: 'taxa', l: 'Taxa do Mercado Pago (%)', n: 1 }],
    titulo: t => `${t.parcelas}x`, sub: t => `${t.taxa}%`,
  },
};

function Crud({ endpoint }) {
  const { campos, titulo, sub } = CFG[endpoint];
  const [items, setItems] = useState([]);
  const [f, setF] = useState(null);
  const load = () => api(`/${endpoint}/`).then(setItems).catch(e => notify(e.message));
  useEffect(() => { setF(null); load(); }, [endpoint]);
  const novo = () => setF(Object.fromEntries(campos.map(c => [c.k, c.o ? c.o[0] : c.b ? !!c.d : ''])));
  const salvar = async () => {
    try {
      const body = {};
      campos.forEach(c => { const v = f[c.k]; body[c.k] = c.n ? (v === '' || v == null ? null : String(v).replace(',', '.')) : v; });
      await api(`/${endpoint}/${f.id ? f.id + '/' : ''}`, { method: f.id ? 'PUT' : 'POST', body });
      setF(null); load();
    } catch (e) { notify(e.message); }
  };
  const apagar = id => confirmar('Excluir este item?', async () => { await api(`/${endpoint}/${id}/`, { method: 'DELETE' }); load(); });

  if (f) return (
    <View>
      {campos.map(c => c.b ? (
        <View key={c.k} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: C.text }}>{c.l}</Text>
          <Switch value={!!f[c.k]} onValueChange={v => setF({ ...f, [c.k]: v })} trackColor={{ true: C.primary }} />
        </View>
      ) : c.o ? (
        <View key={c.k}><Text style={{ color: C.muted, fontSize: 13 }}>{c.l}</Text>
          <Chips opts={c.o.map(o => [o, o])} value={f[c.k]} onChange={v => setF({ ...f, [c.k]: v })} /></View>
      ) : (
        <Field key={c.k} label={c.l} value={String(f[c.k] ?? '')} keyboardType={c.n ? 'decimal-pad' : 'default'} autoCapitalize="none"
          onChangeText={v => setF({ ...f, [c.k]: v })} />
      ))}
      <Btn title="Salvar" onPress={salvar} />
      <Btn title="Cancelar" outline onPress={() => setF(null)} style={{ marginTop: 10 }} />
    </View>
  );
  return (
    <View>
      <Btn title="Adicionar" onPress={novo} style={{ marginBottom: 12 }} />
      {items.map((it, i) => (
        <FadeIn key={it.id} delay={i * 30}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: C.line }}>
            <Press onPress={() => setF({ ...it })} style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: C.text }}>{titulo(it)}</Text>
              <Text style={{ color: C.muted }}>{sub(it)}</Text>
            </Press>
            <Press onPress={() => apagar(it.id)}><Text style={{ color: C.bad, fontWeight: '700', padding: 6 }}>Excluir</Text></Press>
          </View>
        </FadeIn>
      ))}
      {items.length === 0 && <Text style={{ color: C.muted, textAlign: 'center', marginTop: 20 }}>Nada cadastrado ainda. Toque em Adicionar.</Text>}
    </View>
  );
}

function Equipe() {
  const [un, setUn] = useState('');
  const [pw, setPw] = useState('');
  const criar = () => api('/auth/registrar/', { method: 'POST', body: { username: un.trim(), password: pw } })
    .then(() => { notify('Conta criada.'); setUn(''); setPw(''); }).catch(e => notify(e.message));
  return (
    <View>
      <Text style={{ color: C.muted, marginBottom: 12 }}>Crie uma conta para outra pessoa da equipe atualizar o catálogo.</Text>
      <Field label="Usuário" value={un} onChangeText={setUn} autoCapitalize="none" />
      <Field label="Senha (mínimo 6 caracteres)" value={pw} onChangeText={setPw} secureTextEntry />
      <Btn title="Criar conta" onPress={criar} />
    </View>
  );
}

export default function Admin({ onSair, nome }) {
  const [aba, setAba] = useState('produtos');
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: C.text }}>Olá, {nome}</Text>
        <Press onPress={onSair}><Text style={{ color: C.primary, fontWeight: '700' }}>Sair</Text></Press>
      </View>
      <Chips value={aba} onChange={setAba} opts={[['produtos', 'Aparelhos'], ['pecas', 'Peças'], ['taxas', 'Taxas do cartão'], ['equipe', 'Equipe']]} />
      {aba === 'equipe' ? <Equipe /> : <Crud endpoint={aba} key={aba} />}
    </ScrollView>
  );
}
