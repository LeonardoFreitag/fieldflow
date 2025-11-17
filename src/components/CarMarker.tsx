import { Car } from 'lucide-react-native';
import { View } from 'react-native';

export const CarMarker = () => (
  <View
    style={{
      backgroundColor: '#1E3A8A',
      borderRadius: 20,
      padding: 8,
      borderWidth: 3,
      borderColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    }}
  >
    <Car size={15} color="#FFFFFF" />
  </View>
);
