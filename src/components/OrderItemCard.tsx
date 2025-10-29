import {
  Heading,
  HStack,
  VStack,
  Text,
  Button,
  ButtonIcon,
  Divider,
  Image,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@store/store';
import {
  ArchiveRestore,
  ClipboardList,
  Minus,
  Plus,
  Sigma,
  Trash,
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { ModalQuantity } from './ModalQuantity';
import { updateTravelClientOrderEdit } from '@store/slice/travel/travelClientOrderEditSlice';
import productPlaceholder from '@assets/product.png'; // Placeholder for product image
import { type TravelClientOrdersItemsModel } from '@models/TravelClientOrdersItemsModel';
import { addTravelClientOrderItemsEdit } from '@store/slice/travel/travelClientOrderItemEditSlice';

interface OrderItemCardProps {
  productItem: TravelClientOrdersItemsModel;
}

export function OrderItemCard({ productItem }: OrderItemCardProps) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const travelClientOrderEdit = useAppSelector(
    state => state.travelClientOrderEdit,
  );
  const [showModalQuantity, setShowModalQuantity] = useState(false);
  const [quantity, setQuantity] = useState(
    Number(productItem.quantity).toString(),
  );
  const [imageError, setImageError] = useState(false);

  const handleAskConfirmDelete = () => {
    const title = productItem.isDeleted ? 'Restaurar item' : 'Deletar item';
    const message = productItem.isDeleted
      ? 'Confirma restaurar item?'
      : 'Confirma deletar item?';
    const buttonTitle = productItem.isDeleted ? 'Restaurar' : 'Deletar';
    Alert.alert(title, message, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: buttonTitle,
        style: 'destructive',
        onPress: () => {
          handleDeleteItem();
        },
      },
    ]);
  };

  const handleDeleteItem = () => {
    dispatch(
      updateTravelClientOrderEdit({
        ...travelClientOrderEdit,
        TravelClientOrdersItems:
          travelClientOrderEdit.TravelClientOrdersItems?.filter(
            tItem => tItem.id !== productItem.id,
          ),
      }),
    );
  };

  const handleUpQty = () => {
    dispatch(
      updateTravelClientOrderEdit({
        ...travelClientOrderEdit,
        TravelClientOrdersItems:
          travelClientOrderEdit.TravelClientOrdersItems?.map(tItem => {
            if (tItem.id === productItem.id) {
              return {
                ...tItem,
                quantity: tItem.quantity + 1,
              };
            }
            return tItem;
          }),
      }),
    );
  };

  const handleDownQty = () => {
    if (productItem.quantity === 1) {
      return;
    }

    dispatch(
      updateTravelClientOrderEdit({
        ...travelClientOrderEdit,
        TravelClientOrdersItems:
          travelClientOrderEdit.TravelClientOrdersItems?.map(tItem => {
            if (tItem.id === productItem.id) {
              return {
                ...tItem,
                quantity: tItem.quantity - 1,
              };
            }
            return tItem;
          }),
      }),
    );
  };

  const handleListItemComposition = () => {
    dispatch(addTravelClientOrderItemsEdit(productItem));
    navigation.navigate('SaleItemComposition');
  };

  const handleShowModalQuantity = (qtyItem: number) => {
    setQuantity(qtyItem.toString());
    setShowModalQuantity(true);
  };

  const handleCloseModalQuantity = () => {
    setShowModalQuantity(false);
  };

  const handleUpdateQuantity = (
    aItem: TravelClientOrdersItemsModel,
    qty: number,
  ) => {
    dispatch(
      updateTravelClientOrderEdit({
        ...travelClientOrderEdit,
        TravelClientOrdersItems:
          travelClientOrderEdit.TravelClientOrdersItems?.map(tItem => {
            if (tItem.id === productItem.id) {
              return {
                ...tItem,
                quantity: qty,
              };
            }
            return tItem;
          }),
      }),
    );
    setShowModalQuantity(false);
  };

  const getImageSource = () => {
    if (
      imageError ||
      !productItem.Product?.photoUrl ||
      productItem.Product?.photoUrl === ''
    ) {
      return productPlaceholder;
    }
    return { uri: productItem.Product.photoUrl };
  };

  const totalItemFromComposition = useMemo(() => {
    if (
      !productItem.TravelClientOrdersItemsComposition ||
      productItem.TravelClientOrdersItemsComposition.length === 0
    ) {
      return productItem.price;
    }
    return productItem.TravelClientOrdersItemsComposition.reduce(
      (acc, item) => {
        if (item.removed) return acc;
        return acc + (Number(item.pQuantity) * Number(item.pPrice) || 0);
      },
      0,
    );
  }, [productItem.TravelClientOrdersItemsComposition, productItem.price]);

  // const totalProduct = useMemo(() => {
  //   return productItem.quantity * productItem.price;
  // }, [productItem.quantity, productItem.price]);

  return (
    <HStack
      bg={productItem.isDeleted ? '$red400' : '$trueGray700'}
      alignItems="center"
      p="$2"
      pr="$2"
      rounded="$md"
      mb="$3"
      w="$full"
      justifyContent="space-between"
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
          {`Produto: ${productItem.code} - ${productItem.description}`}
        </Heading>
        <Text color="$trueGray400">
          {`${Number(productItem.quantity).toLocaleString('pt-BR', {
            maximumFractionDigits: 2,
          })} ${productItem.unity} x ${Number(
            totalItemFromComposition,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })} = ${(
            Number(productItem.quantity) * totalItemFromComposition || 0
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}`}
        </Text>
        <Divider my="$0.5" bgColor="$trueGray500" mb="$0.5" />

        <HStack
          marginTop="$1"
          justifyContent="space-between"
          alignItems="center"
          w="$full"
          gap={8}
        >
          <HStack gap={8}>
            <Button
              width="$10"
              height="$10"
              rounded="$md"
              backgroundColor="$amber500"
              $active-bg="$amber600"
              onPress={handleAskConfirmDelete}
            >
              {!productItem.isDeleted && <ButtonIcon as={Trash} size="xl" />}
              {productItem.isDeleted && (
                <ButtonIcon as={ArchiveRestore} size="xl" />
              )}
            </Button>
            {productItem.isComposed && (
              <Button
                width="$10"
                height="$10"
                rounded="$md"
                backgroundColor="$darkBlue400"
                $active-bg="$darkBlue500"
                onPress={handleListItemComposition}
              >
                <ButtonIcon as={ClipboardList} size="xl" />
              </Button>
            )}
          </HStack>
          <HStack gap={8}>
            {!productItem.isDeleted && (
              <>
                <Button
                  width="$10"
                  height="$10"
                  rounded="$md"
                  backgroundColor="$blueGray500"
                  $active-bg="$blueGray400"
                  onPress={() => {
                    handleShowModalQuantity(productItem.quantity);
                  }}
                >
                  <ButtonIcon as={Sigma} size="xl" />
                </Button>
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
      {showModalQuantity && (
        <ModalQuantity
          handleCloseModal={handleCloseModalQuantity}
          qtyTyped={quantity.toString()}
          visible={showModalQuantity}
          setQtyTyped={setQuantity}
          handleUpdateQty={() => {
            handleUpdateQuantity(productItem, Number(quantity));
          }}
        />
      )}
    </HStack>
  );
}
