import { View, Text, Button, StyleSheet } from 'react-native';
import { useCameraPermission } from 'react-native-vision-camera';

export function PermissionsPage() {
  const { requestPermission } = useCameraPermission();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Você poderá utilizar a câmera para capturar as imagens, mas primeiro
        precisamos de sua permissão
      </Text>
      <Button
        title="Autorizar câmera"
        onPress={() => {
          requestPermission();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    marginBottom: 20,
  },
});
