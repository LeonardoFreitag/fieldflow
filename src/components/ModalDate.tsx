import { Platform, useColorScheme, Modal as RNModal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Box } from '@ui/box';
import { HStack } from '@ui/hstack';
import { Button, ButtonIcon } from '@ui/button';
import { X, Save } from 'lucide-react-native';

interface ModalDateProps {
  showScheduling: boolean;
  setShowScheduling: (visible: boolean) => void;
  handleUpdateScheduling: (date: Date) => void;
  pickerDate: Date;
  setPickerDate: (date: Date) => void;
}

export const ModalDate: React.FC<ModalDateProps> = ({
  showScheduling,
  setShowScheduling,
  handleUpdateScheduling,
  pickerDate,
  setPickerDate,
}: ModalDateProps) => {
  const colorScheme = useColorScheme();
  const iosThemeProps =
    Platform.OS === 'ios'
      ? {
          themeVariant: 'light' as const,
        }
      : {};
  return (
    <RNModal
      visible={showScheduling}
      animationType="slide"
      transparent
      onRequestClose={() => {
        setShowScheduling(false);
      }}
    >
      <Box className="absolute left-0 right-0 top-0 bottom-0 bg-rgba(0,0,0,0.5) justify-center items-center">
        <Box
          className={` ${colorScheme === 'dark' ? 'bg-info-200' : 'bg-white'} w-[90%] max-w-[420px] rounded-lg p-4 `}
        >
          <DateTimePicker
            {...iosThemeProps}
            value={pickerDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            locale="pt-BR"
            onChange={(event, date) => {
              if (event?.type === 'dismissed') {
                return;
              }
              const selectedDate = date ?? pickerDate;
              setPickerDate(selectedDate);
            }}
          />
          <HStack className="w-full justify-end mt-3 gap-[8px]">
            <Button
              variant="outline"
              onPress={() => {
                setShowScheduling(false);
              }}
            >
              <ButtonIcon as={X} size="lg" />
            </Button>
            <Button
              onPress={() => {
                handleUpdateScheduling(pickerDate);
                setShowScheduling(false);
              }}
            >
              <ButtonIcon as={Save} size="lg" />
            </Button>
          </HStack>
        </Box>
      </Box>
    </RNModal>
  );
};
