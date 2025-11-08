import { Button, ButtonIcon } from '@ui/button';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { Image } from '@ui/image';
import { HStack } from '@ui/hstack';
import { Heading } from '@ui/heading';
import { type TravelClientOrdersItemsCompositionModel } from '@models/TravelClientOrdersitemsCompositionModel';
import { updateTravelClientOrderEdit } from '@store/slice/travel/travelClientOrderEditSlice';
import { updateTravelClientOrderItemsEdit } from '@store/slice/travel/travelClientOrderItemEditSlice';
import { useAppSelector } from '@store/store';
import { ArchiveRestore, Trash } from 'lucide-react-native';
import React, { useState } from 'react';
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
      className={` ${travelClientOrderItemComposition.removed ? 'bg-red-500' : 'bg-trueGray-700'} items-start p-2 pr-2 rounded-md mb-3 w-full justify-between relative `}
    >
      <Image
        source={getImageSource()}
        alt="Product"
        className="w-20 h-20 rounded-md"
      />
      <VStack className="flex-1 p-[8px] justify-between items-start">
        <Heading size="xs" className="text-trueGray-100">
          {`${travelClientOrderItemComposition.pCode} - ${travelClientOrderItemComposition.pDescription}`}
        </Heading>
        <Text className="text-trueGray-400">
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
        onPress={handleDeleteItemComposition}
        className="w-10 h-10 rounded-md bg-amber-500  active:bg-amber-600 absolute bottom-2 right-2"
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
