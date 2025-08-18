import {
  Heading,
  HStack,
  Image,
  VStack,
  Text,
  Button,
  ButtonIcon,
} from '@gluestack-ui/themed';
import { type TravelClientOrdersItemsCompositionModel } from '@models/TravelClientOrdersitemsCompositionModel';
import { updateTravelClientOrderEdit } from '@store/slice/travel/travelClientOrderEditSlice';
import { updateTravelClientOrderItemsEdit } from '@store/slice/travel/travelClientOrderItemEditSlice';
import { useAppSelector } from '@store/store';
import { ArchiveRestore, Trash } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import productPlaceholder from '@assets/product.png'; // Placeholder for product image

interface SaleItemCompositionCardProps {
  travelClientOrderItemComposition: TravelClientOrdersItemsCompositionModel;
}

export function SaleItemCompositionCard({
  travelClientOrderItemComposition,
}: SaleItemCompositionCardProps) {
  const dispatch = useDispatch();
  const travelClientOrderEdit = useAppSelector(
    state => state.travelClientOrderEdit,
  );
  const travelClientOrderItemEdit = useAppSelector(
    state => state.travelClientOrderItemEdit,
  );
  const [imageError, setImageError] = useState(false);

  const handleDeleteItemComposition = () => {
    const updatedItemEdit = {
      ...travelClientOrderItemEdit,
      TravelClientOrdersItemsComposition:
        travelClientOrderItemEdit.TravelClientOrdersItemsComposition?.map(
          item =>
            item.id === travelClientOrderItemComposition.id
              ? { ...item, removed: !item.removed }
              : item,
        ) ?? [],
    };
    const updatedOrderEdit = {
      ...travelClientOrderEdit,
      TravelClientOrdersItems:
        travelClientOrderEdit.TravelClientOrdersItems?.map(item =>
          item.id === updatedItemEdit.id ? updatedItemEdit : item,
        ),
    };
    dispatch(updateTravelClientOrderItemsEdit(updatedItemEdit));
    dispatch(updateTravelClientOrderEdit(updatedOrderEdit));
  };

  const getImageSource = () => {
    if (
      imageError ||
      !travelClientOrderItemComposition.photoUrl ||
      travelClientOrderItemComposition.photoUrl === ''
    ) {
      return productPlaceholder;
    }
    return { uri: travelClientOrderItemComposition.photoUrl };
  };

  return (
    <HStack
      bg={travelClientOrderItemComposition.removed ? '$red500' : '$trueGray700'}
      alignItems="flex-start"
      p="$2"
      pr="$2"
      rounded="$md"
      mb="$3"
      w="$full"
      justifyContent="space-between"
      position="relative"
    >
      <Image
        source={getImageSource()}
        alt="Product"
        w="$20"
        h="$20"
        rounded="$md"
      />
      <VStack
        flex={1}
        padding={8}
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Heading size="xs" color="$trueGray100">
          {`${travelClientOrderItemComposition.pCode} - ${travelClientOrderItemComposition.pDescription}`}
        </Heading>
        <Text color="$trueGray400">
          {`${travelClientOrderItemComposition.pQuantity.toLocaleString(
            'pt-BR',
            {
              maximumFractionDigits: 2,
            },
          )} ${travelClientOrderItemComposition.pUnity} x ${travelClientOrderItemComposition.pPrice.toLocaleString(
            'pt-BR',
            {
              style: 'currency',
              currency: 'BRL',
            },
          )} = ${(
            Number(travelClientOrderItemComposition.pQuantity) *
              Number(travelClientOrderItemComposition.pPrice) || 0
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}`}
        </Text>
      </VStack>
      <Button
        width="$10"
        height="$10"
        rounded="$md"
        backgroundColor="$amber500"
        $active-bg="$amber600"
        onPress={handleDeleteItemComposition}
        position="absolute"
        bottom="$2"
        right="$2"
      >
        {!travelClientOrderItemComposition.removed && (
          <ButtonIcon as={Trash} size="xl" />
        )}
        {travelClientOrderItemComposition.removed && (
          <ButtonIcon as={ArchiveRestore} size="xl" />
        )}
      </Button>
    </HStack>
  );
}
