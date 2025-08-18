import RNPickerSelect from 'react-native-picker-select';
import { View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

interface SelectPickerProps {
  selectOptions: Array<{ label: string; value: string }>;
  value?: string;
  onValueChange: (value: string) => void;
}

export const SelectPicker = ({
  selectOptions,
  value,
  onValueChange,
}: SelectPickerProps) => {
  return (
    <View style={{ position: 'relative' }}>
      <RNPickerSelect
        value={value ?? ''}
        onValueChange={onValueChange}
        items={selectOptions}
        style={{
          inputIOS: {
            color: '#FFFFFF',
            fontSize: 16,
            paddingVertical: 12,
            paddingHorizontal: 10,
            paddingRight: 40, // Espaço para a seta
            borderWidth: 1,
            borderColor: '#CCCCCC',
            borderRadius: 4,
            backgroundColor: '#1F2937',
          },
          inputAndroid: {
            color: '#FFFFFF',
            fontSize: 16,
            paddingVertical: 12,
            paddingHorizontal: 10,
            paddingRight: 40, // Espaço para a seta
            borderWidth: 1,
            borderColor: '#CCCCCC',
            borderRadius: 4,
            backgroundColor: '#1F2937',
          },
          modalViewTop: {
            backgroundColor: '#1F2937',
            opacity: 0.1,
          },
          modalViewMiddle: {
            backgroundColor: '#1F2937',
            borderTopWidth: 1,
            borderTopColor: '#374151',
          },
          modalViewBottom: {
            backgroundColor: '#1F2937',
          },
          chevronContainer: {
            backgroundColor: '#1F2937',
          },
          chevron: {
            borderTopColor: '#9CA3AF',
          },
          done: {
            color: '#60A5FA',
            fontSize: 16,
            fontWeight: 'bold',
          },
          placeholder: {
            color: '#9CA3AF',
            fontSize: 16,
          },
          iconContainer: {
            top: 12,
            right: 10,
          },
        }}
        placeholder={{
          label: 'Selecione uma forma de pagamento',
          value: '',
          color: '#9CA3AF',
        }}
        useNativeAndroidPickerStyle={false}
        darkTheme={true}
        Icon={() => (
          <ChevronDown size={20} color="#9CA3AF" style={{ marginTop: 2 }} />
        )}
      />
    </View>
  );
};
