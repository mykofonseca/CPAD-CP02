import { Platform, StatusBar as RNStatusBar } from 'react-native';

export const COLORS = {
  cream: '#FBF3E4',
  gold: '#F2A93C',
  brown: '#5C4327',
  muted: '#8a7454',
  card: '#FFFFFF',
  accent: '#D64545',
  chip: '#FFF3DC',
  border: '#EDE0C8',
  green: '#4C9A6A',
};

// Margem extra pro topo em Android, já que a SafeAreaView sozinha não
// empurra o conteúdo pra baixo da status bar nesse sistema.
export const TOP_SPACING =
  Platform.OS === 'android' ? RNStatusBar.currentHeight || 24 : 8;
