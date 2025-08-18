import {
  Camera,
  type PhotoFile,
  useCameraDevice,
  useLocationPermission,
  useCameraFormat,
} from 'react-native-vision-camera';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  type GestureResponderEvent,
  Modal,
  StyleSheet,
} from 'react-native';
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedGestureHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Camera as CameraIcon,
  Lightning,
  LightningSlash,
  CameraRotate,
  XCircle,
} from 'phosphor-react-native';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  type PinchGestureHandlerGestureEvent,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import { useIsForeground } from '@hooks/useIsForeground';
import { Button, HStack, VStack } from '@gluestack-ui/themed';

interface ModalCameraProps {
  isVisible: boolean;
  closeModal: () => void;
  updateUrlImage: (photoFile: PhotoFile) => void;
}
const SCALE_FULL_ZOOM = 3;

Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

export const MAX_ZOOM_FACTOR = 10;

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
  const location = useLocationPermission();

  const device = useCameraDevice(cameraPosition);

  const zoom = useSharedValue(device?.neutralZoom ?? 0);
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
    location.requestPermission();
  }, [location]);

  const handleTakePicture = async () => {
    if (!camera.current) return;
    const file = await camera.current.takePhoto();

    updateUrlImage(file);

    closeModal();
  };

  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const onPinchGesture = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    { startZoom?: number }
  >({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(
        event.scale,
        [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
        [-1, 0, 1],
        Extrapolation.CLAMP,
      );
      zoom.value = interpolate(
        scale,
        [-1, 0, 1],
        [minZoom, startZoom, maxZoom],
        Extrapolation.CLAMP,
      );
    },
  });

  const onFocusTap = useCallback(
    ({ nativeEvent: event }: GestureResponderEvent) => {
      if (!device?.supportsFocus) return;
      camera.current?.focus({
        x: event.locationX,
        y: event.locationY,
      });
    },
    [device?.supportsFocus],
  );

  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);

  // if (!hasPermission) return <PermissionsPage />;
  // if (device == null) return <NoCameraDeviceError />;
  if (device == null) return null;
  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
          <Reanimated.View
            onTouchEnd={onFocusTap}
            style={StyleSheet.absoluteFill}
          >
            <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
              <Camera
                device={device}
                isActive={true}
                style={styles.cam}
                torch={flash}
                ref={camera}
                enableZoomGesture={true}
                photo={true}
                format={format}
              />
            </TapGestureHandler>
          </Reanimated.View>
        </PinchGestureHandler>
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
