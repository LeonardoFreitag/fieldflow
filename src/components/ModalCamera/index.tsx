import { VStack } from '@ui/vstack';
import { HStack } from '@ui/hstack';
import { Button, ButtonIcon } from '@ui/button';
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
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { useIsForeground } from '@hooks/useIsForeground';

import {
  SwitchCamera,
  Zap,
  ZapOff,
  Camera as CameraIcon,
  X,
} from 'lucide-react-native';

interface ModalCameraProps {
  isVisible: boolean;
  closeModal: () => void;
  updateUrlImage: (photoFile: PhotoFile) => void;
}

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
  const [isInitialized, setIsInitialized] = useState(false);

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(cameraPosition);
  const isForeground = useIsForeground();

  // Ativa a câmera somente quando a modal está visível e o app está em foreground
  const isActive = isVisible && isForeground;

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
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  // Ao abrir/fechar a modal, reseta o estado de inicialização
  useEffect(() => {
    if (isVisible) {
      setIsInitialized(false);
    }
  }, [isVisible]);

  const handleTakePicture = async () => {
    try {
      if (!camera.current || !isInitialized || !isActive) {
        Alert.alert('Aguarde', 'A câmera ainda está inicializando.');
        return;
      }
      const file = await camera.current.takePhoto({ flash });
      updateUrlImage(file);
      closeModal();
    } catch (e: any) {
      Alert.alert('Erro ao tirar foto', e?.message ?? 'Tente novamente.');
    }
  };

  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);

  // Gestos: só faz focus após inicialização
  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd((e: any, success) => {
      if (!success) return;
      if (!device?.supportsFocus) return;
      if (!isInitialized) return;
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

  if (!hasPermission || device == null) return null;

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={composedGesture}>
          <View style={StyleSheet.absoluteFill}>
            <Camera
              ref={camera}
              device={device}
              isActive={isActive}
              style={styles.cam}
              torch={flash}
              enableZoomGesture
              photo
              format={format}
              onInitialized={() => {
                setIsInitialized(true);
              }}
              onError={e => {
                // log opcional
                console.warn('Camera error', e);
              }}
            />
          </View>
        </GestureDetector>
      </GestureHandlerRootView>

      {/* Ações */}
      <VStack className="flex-1 justify-end absolute top-12 right-6 opacity-70 gap-[6px]">
        <Button onPress={onFlipCameraPressed} className="bg-background-700">
          <ButtonIcon as={SwitchCamera} size="xl" />
        </Button>
        <Button onPress={onFlashPressed}>
          {flash === 'off' ? (
            <ButtonIcon as={Zap} size="xl" />
          ) : (
            <ButtonIcon as={ZapOff} size="xl" />
          )}
        </Button>
      </VStack>

      <HStack className="justify-center absolute bottom-10 left-0 w-[100%]">
        <Button
          onPress={handleTakePicture}
          className="opacity-70 w-44 h-14"
          disabled={!isInitialized || !isActive}
        >
          <ButtonIcon as={CameraIcon} className="w-8 h-8" />
        </Button>
      </HStack>

      <Button
        onPress={closeModal}
        className="absolute top-12 left-8 opacity-70"
      >
        <ButtonIcon as={X} size="xl" />
      </Button>
    </Modal>
  );
}

const styles = StyleSheet.create({
  cam: {
    flex: 1,
  },
});
