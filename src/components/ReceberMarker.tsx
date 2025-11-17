import { CircleDollarSign } from 'lucide-react-native';
import { useCallback } from 'react';
import { View } from 'react-native';

interface HouseMarkerProps {
  markerStatus: string;
}

export const ReceberMarker = ({ markerStatus }: HouseMarkerProps) => {
  const getMarkerColor = useCallback((status: string | undefined) => {
    switch (status) {
      case 'visited':
        return '#F97316';
      case 'visited_received':
        return '#16A34A';
      case 'open':
        return '#2563EB';
      case 'not_visited':
        return '#DC2626';
      default:
        return '#2563EB';
    }
  }, []);

  return (
    <View
      style={{
        backgroundColor: getMarkerColor(markerStatus),
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
      <CircleDollarSign size={15} color="#FFFFFF" />
    </View>
  );
};
