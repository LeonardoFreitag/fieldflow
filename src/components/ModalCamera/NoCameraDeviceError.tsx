import { View, Text, StyleSheet } from 'react-native';

export function NoCameraDeviceError() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Nenhuma câmera encontrada</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 14,
  },
});
