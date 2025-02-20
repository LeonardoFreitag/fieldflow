import {
  Heading,
  HStack,
  Image,
  VStack,
  Text,
  Button,
  ButtonIcon,
} from '@gluestack-ui/themed';
import { type SaleItemCompositionModel } from '@models/SaleItemCompositionModel';
import { updateSaleEdit } from '@store/slice/sale/saleEditSlice';
import { updateSaleItemEdit } from '@store/slice/saleItem/saleItemEditSlice';
import { useAppSelector } from '@store/store';
import { ArchiveRestore, Minus, Plus, Trash } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

interface SaleItemCompositionCardProps {
  saleItemComposition: SaleItemCompositionModel;
}

export function SaleItemCompositionCard({
  saleItemComposition,
}: SaleItemCompositionCardProps) {
  const dispatch = useDispatch();
  const saleEdit = useAppSelector(state => state.saleEdit);
  const saleItemEdit = useAppSelector(state => state.saleItemEdit);

  const totalProduct = useMemo(() => {
    return saleItemComposition.quantity * saleItemComposition.price;
  }, [saleItemComposition.quantity, saleItemComposition.price]);

  const handleAskConfirmDelete = () => {
    const title = saleItemComposition.is_deleted
      ? 'Restaurar item'
      : 'Deletar item';
    const message = saleItemComposition.is_deleted
      ? 'Confirma restaurar item?'
      : 'Confirma deletar item?';
    const buttonTitle = saleItemComposition.is_deleted
      ? 'Restaurar'
      : 'Deletar';
    Alert.alert(title, message, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: buttonTitle,
        style: 'destructive',
        onPress: () => {
          handleDeleteItemComposition();
        },
      },
    ]);
  };

  const handleDeleteItemComposition = () => {
    dispatch(
      updateSaleItemEdit({
        ...saleItemEdit,
        composition: saleItemEdit.composition.map(item => {
          if (item.id === saleItemComposition.id) {
            return {
              ...item,
              is_deleted: !item.is_deleted,
            };
          }
          return item;
        }),
      }),
    );
    dispatch(
      updateSaleEdit({
        ...saleEdit,
        saleItems: saleEdit.saleItems.map(item => {
          if (item.id === saleItemComposition.id) {
            return {
              ...item,
              is_deleted: true,
            };
          }
          return item;
        }),
      }),
    );
  };

  const handleUpQty = () => {};

  const handleDownQty = () => {};

  return (
    <HStack
      bg={saleItemComposition.is_deleted ? '$red400' : '$trueGray700'}
      alignItems="center"
      p="$2"
      pr="$2"
      rounded="$md"
      mb="$3"
      w="$full"
      justifyContent="space-between"
    >
      <Image
        source={{ uri: saleItemComposition.cover_image }}
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
          {`Produto: ${saleItemComposition.id} - ${saleItemComposition.product}`}
        </Heading>
        <Text color="$trueGray400">
          {`${saleItemComposition.quantity.toLocaleString('pt-BR', {
            maximumFractionDigits: 2,
          })} ${saleItemComposition.unity} x ${saleItemComposition.price.toLocaleString(
            'pt-BR',
            {
              style: 'currency',
              currency: 'BRL',
            },
          )} = ${totalProduct.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}`}
        </Text>
        <HStack
          marginTop="$1"
          justifyContent="space-between"
          alignItems="center"
          w="$full"
          gap={8}
        >
          <HStack gap={8}>
            {saleItemComposition.is_deleted ? (
              <Button
                width="$10"
                height="$10"
                rounded="$md"
                backgroundColor="$amber500"
                $active-bg="$amber600"
                onPress={handleAskConfirmDelete}
              >
                {!saleItemComposition.is_deleted && (
                  <ButtonIcon as={Trash} size="xl" />
                )}
                {saleItemComposition.is_deleted && (
                  <ButtonIcon as={ArchiveRestore} size="xl" />
                )}
              </Button>
            ) : (
              <Button
                width="$10"
                height="$10"
                rounded="$md"
                backgroundColor="$amber500"
                $active-bg="$amber600"
                onPress={handleAskConfirmDelete}
              >
                <ButtonIcon as={Trash} size="xl" />
              </Button>
            )}
          </HStack>
          <HStack gap={8}>
            {!saleItemComposition.is_deleted && (
              <>
                <Button
                  width="$10"
                  height="$10"
                  rounded="$md"
                  backgroundColor="$green700"
                  $active-bg="$green500"
                  onPress={handleUpQty}
                >
                  <ButtonIcon as={Plus} size="xl" />
                </Button>
                <Button
                  width="$10"
                  height="$10"
                  rounded="$md"
                  backgroundColor="$red700"
                  $active-bg="$red500"
                  onPress={handleDownQty}
                >
                  <ButtonIcon as={Minus} size="xl" />
                </Button>
              </>
            )}
          </HStack>
        </HStack>
      </VStack>
    </HStack>
  );
}
