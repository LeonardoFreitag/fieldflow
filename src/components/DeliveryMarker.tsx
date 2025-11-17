import { Home } from 'lucide-react-native';
import { useCallback } from 'react';
import { View } from 'react-native';

interface HouseMarkerProps {
  markerStatus: string;
}

export const DeliveryMarker = ({ markerStatus }: HouseMarkerProps) => {
  const getMarkerColor = useCallback((status: string | undefined) => {
    switch (status) {
      case 'delivered':
        return '#16A34A'; // green-600
      case 'canceled':
        return '#DC2626'; // red-600
      case 'charged':
        return '#2563EB'; // blue-600
      case 'pending':
        return '#EAB308'; // yellow-500
      case 'not_delivered':
        return '#F97316'; // orange-500
      default:
        return '#2563EB'; // default blue
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
      <Home size={15} color="#FFFFFF" />
    </View>
  );
};
