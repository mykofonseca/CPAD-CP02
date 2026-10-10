import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TOP_SPACING } from './theme';

export default function App() {
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);

  // Sem .push(): novo array com spread, mantendo o estado imutável
  const addItem = () => {
    const name = text.trim();
    if (!name) return;
    setItems([...items, { id: Date.now().toString(), name, done: false }]);
    setText('');
  };

  const toggleItem = (id) => {
    setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  };

  const removeItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const clearAll = () => {
    // Alert.alert com botões não funciona no navegador (web), então usamos confirm
    if (Platform.OS === 'web') {
      if (window.confirm('Deseja remover todos os itens da lista?')) setItems([]);
      return;
    }
    Alert.alert('Limpar tudo', 'Deseja remover todos os itens da lista?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: () => setItems([]) },
    ]);
  };

  const doneCount = items.filter((i) => i.done).length;
  const progress = items.length ? (doneCount / items.length) * 100 : 0;

  const renderItem = ({ item }) => (
    <View style={[styles.item, item.done && styles.itemDone]}>
      <TouchableOpacity
        style={styles.itemMain}
        onPress={() => toggleItem(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.check, item.done && styles.checkDone]}>
          {item.done && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <Text style={[styles.itemText, item.done && styles.itemTextDone]}>
          {item.name}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => removeItem(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoEmoji}>🛒</Text>
          </View>
          <Text style={styles.title}>Lista de Compras do Maykon</Text>
          <Text style={styles.subtitle}>
            {items.length === 0
              ? 'Nenhum item ainda'
              : `${doneCount} de ${items.length} comprados`}
          </Text>
          {items.length > 0 && (
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          )}
        </View>

        {/* Entrada */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="Digite um novo item..."
            placeholderTextColor={COLORS.muted}
            value={text}
            onChangeText={setText}
            onSubmitEditing={addItem}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addBtn} onPress={addItem} activeOpacity={0.85}>
            <Text style={styles.addBtnText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista */}
        <FlatList
          style={styles.flat}
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🧺</Text>
              <Text style={styles.emptyText}>Sua lista está vazia</Text>
              <Text style={styles.emptyHint}>Adicione o primeiro item acima.</Text>
            </View>
          }
        />

        {/* Rodapé */}
        {items.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={clearAll} activeOpacity={0.85}>
            <Text style={styles.clearText}>🗑  Limpar tudo</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const shadow = {
  shadowColor: '#5C4327',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 3,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
    paddingTop: TOP_SPACING,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  header: { alignItems: 'center', marginTop: 12, marginBottom: 20 },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...shadow,
  },
  logoEmoji: { fontSize: 30 },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.brown,
    textAlign: 'center',
  },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  progressTrack: {
    width: '70%',
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: COLORS.green, borderRadius: 3 },

  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
    ...shadow,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.brown,
    marginRight: 7,
  },
  addBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  addBtnText: { color: COLORS.brown, fontWeight: '800', fontSize: 15 },

  flat: { flex: 1 },
  list: { paddingBottom: 12, flexGrow: 1 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    ...shadow,
  },
  itemDone: { opacity: 0.7 },
  itemMain: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: COLORS.gold,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  checkMark: { color: '#fff', fontSize: 14, fontWeight: '800' },
  itemText: { flex: 1, fontSize: 16, color: COLORS.brown, fontWeight: '500' },
  itemTextDone: { textDecorationLine: 'line-through', color: COLORS.muted },
  removeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  removeText: { color: COLORS.accent, fontSize: 14, fontWeight: '800' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyEmoji: { fontSize: 52, marginBottom: 8 },
  emptyText: { fontSize: 18, fontWeight: '700', color: COLORS.brown },
  emptyHint: { fontSize: 14, color: COLORS.muted, marginTop: 4 },

  clearBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.card,
  },
  clearText: { color: COLORS.accent, fontWeight: '800', fontSize: 15 },
});
