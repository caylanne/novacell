import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View, TextInput, ScrollView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from './theme';

export const notify = m => (Platform.OS === 'web' ? window.alert(m) : Alert.alert('Novacell', m));
export const confirmar = (m, ok) => Platform.OS === 'web' ? (window.confirm(m) && ok())
  : Alert.alert(m, '', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Confirmar', style: 'destructive', onPress: ok }]);

// Entrada: sobe e aparece (use delay para escalonar listas)
export function FadeIn({ delay = 0, children, style }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(v, { toValue: 1, duration: 500, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); }, []);
  return <Animated.View style={[{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }] }, style]}>{children}</Animated.View>;
}

// Flutua suavemente em loop
export function Float({ children, amp = 10 }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = { duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true };
    Animated.loop(Animated.sequence([Animated.timing(v, { toValue: 1, ...t }), Animated.timing(v, { toValue: 0, ...t })])).start();
  }, []);
  return <Animated.View style={{ transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -amp] }) }] }}>{children}</Animated.View>;
}

// Efeito de "mola" ao tocar
export function Press({ onPress, children, style }) {
  const s = useRef(new Animated.Value(1)).current;
  const to = x => Animated.spring(s, { toValue: x, speed: 30, useNativeDriver: true }).start();
  return (
    <Pressable onPress={onPress} onPressIn={() => to(0.95)} onPressOut={() => to(1)}>
      <Animated.View style={[{ transform: [{ scale: s }] }, style]}>{children}</Animated.View>
    </Pressable>
  );
}

const bt = { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14, alignItems: 'center' };
export function Btn({ title, onPress, outline, style }) {
  return (
    <Press onPress={onPress} style={style}>
      {outline
        ? <View style={[bt, { borderWidth: 2, borderColor: C.primary }]}><Text style={{ color: C.primary, fontWeight: '700', fontSize: 15 }}>{title}</Text></View>
        : <LinearGradient colors={[C.primary, C.accent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={bt}><Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>{title}</Text></LinearGradient>}
    </Press>
  );
}

export const Chips = ({ opts, value, onChange }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginVertical: 8 }}>
    {opts.map(([k, l]) => {
      const on = value === k;
      return (
        <Press key={k} onPress={() => onChange(k)}>
          <View style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, marginRight: 8, backgroundColor: on ? C.primary : '#fff', borderWidth: 1, borderColor: on ? C.primary : C.line }}>
            <Text style={{ color: on ? '#fff' : C.text, fontWeight: '600' }}>{l}</Text>
          </View>
        </Press>
      );
    })}
  </ScrollView>
);

export const Field = ({ label, ...p }) => (
  <View style={{ marginBottom: 12 }}>
    {label ? <Text style={{ color: C.muted, marginBottom: 4, fontSize: 13 }}>{label}</Text> : null}
    <TextInput placeholderTextColor={C.muted} {...p} style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 12, fontSize: 16, color: C.text }} />
  </View>
);
