export const C = { bg: '#FBF8F6', card: '#FFFFFF', primary: '#F26A1B', amber: '#FBB02D', accent: '#B63A8C', text: '#2A1A14', muted: '#8C7A70', line: '#EEE2DA', ok: '#1E9E5A', bad: '#C23B3B' };
export const brl = v => 'R$ ' + Number(v || 0).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const MARCAS_PECAS = [['', 'Todas'], ['apple', 'Apple'], ['samsung', 'Samsung'], ['motorola', 'Motorola'], ['xiaomi', 'Xiaomi']];
