import { Home } from 'lucide-react-native';
import { View } from 'react-native';

interface HouseMarkerProps {
  markerStatus: string;
}

export const HouseMarker = ({ markerStatus }: HouseMarkerProps) => {
  let bg = '#2563EB'; // azul (pending)
  if (markerStatus === 'visited') bg = '#16A34A'; // verde
  if (markerStatus === 'not_visited') bg = '#DC2626'; // vermelho

  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: 12,
        padding: 6,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 3,
      }}
    >
      <Home size={15} color="#FFFFFF" />
    </View>
  );
};
