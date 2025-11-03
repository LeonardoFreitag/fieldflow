import {
  Camera,
  type PhotoFile,
  useCameraDevice,
  useCameraPermission,
  useCameraFormat,
} from 'react-native-vision-camera';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Modal, StyleSheet, View } from 'react-native';
import {
  Camera as CameraIcon,
  Lightning,
  LightningSlash,
  CameraRotate,
  XCircle,
} from 'phosphor-react-native';
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import { useIsForeground } from '@hooks/useIsForeground';
import { Button, HStack, VStack } from '@gluestack-ui/themed';

interface ModalCameraProps {
  isVisible: boolean;
  closeModal: () => void;
  updateUrlImage: (photoFile: PhotoFile) => void;
}
// MAX_ZOOM_FACTOR no longer needed since we use built-in zoom gesture

export function ModalCamera({
  isVisible,
  closeModal,
  updateUrlImage,
}: ModalCameraProps) {
  const camera = useRef<Camera>(null);
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const { hasPermission, requestPermission } = useCameraPermission();

  const device = useCameraDevice(cameraPosition);
  // check if camera page is active

  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;
  const format = useCameraFormat(device, [
    { photoResolution: { width: 1280, height: 720 } },
  ]);

  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  }, []);

  const onFlashPressed = useCallback(() => {
    if (cameraPosition === 'front') {
      setFlash('off');
      Alert.alert('Flash não disponível na câmera frontal');
      return;
    }
    setFlash(f => (f === 'off' ? 'on' : 'off'));
  }, [cameraPosition]);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  // Reset-related logic removed as built-in zoom gesture is used

  const handleTakePicture = async () => {
    try {
      if (!camera.current) return;
      const file = await camera.current.takePhoto({
        flash,
      });

      updateUrlImage(file);
      closeModal();
    } catch (e) {
      Alert.alert('Erro ao tirar foto');
    }
  };

  // Using built-in zoom gesture; min/max zoom not needed here

  // Using Camera's built-in enableZoomGesture instead of custom pinch handler

  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);

  // Gestures: single-tap to focus, double-tap to flip camera (double has priority)
  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd((e: any, success) => {
      if (!success) return;
      if (!device?.supportsFocus) return;
      const { x, y } = e;
      camera.current?.focus({ x, y });
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((_e, success) => {
      if (!success) return;
      onDoubleTap();
    });

  const composedGesture = Gesture.Exclusive(doubleTap, singleTap);

  // if (!hasPermission) return <PermissionsPage />;
  // if (device == null) return <NoCameraDeviceError />;
  if (!hasPermission) return null;
  if (device == null) return null;
  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={composedGesture}>
          <View style={StyleSheet.absoluteFill}>
            <Camera
              device={device}
              isActive={isActive}
              style={styles.cam}
              torch={flash}
              ref={camera}
              enableZoomGesture={true}
              photo={true}
              format={format}
            />
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
      <VStack
        flex={1}
        justifyContent="flex-end"
        position="absolute"
        top={56}
        right={16}
        opacity={0.6}
        gap={6}
      >
        <Button onPress={onFlipCameraPressed}>
          <CameraRotate size={24} color="#fff" />
        </Button>
        <Button onPress={onFlashPressed}>
          {flash === 'off' ? (
            <Lightning size={24} color="#fff" />
          ) : (
            <LightningSlash size={24} color="#fff" />
          )}
        </Button>
      </VStack>

      <HStack
        justifyContent="center"
        position="absolute"
        bottom={42}
        left={0}
        width="100%"
      >
        <Button onPress={handleTakePicture} size="lg" opacity={0.6}>
          <CameraIcon size={24} color="#fff" />
        </Button>
      </HStack>
      <Button
        onPress={closeModal}
        position="absolute"
        top={56}
        left={16}
        opacity={0.6}
      >
        <XCircle size={24} color="#fff" />
      </Button>
    </Modal>
  );
}

const styles = StyleSheet.create({
  cam: {
    flex: 1,
  },
});
