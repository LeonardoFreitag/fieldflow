import { Image } from '@ui/image';
import { Divider } from '@ui/divider';
import { Button, ButtonIcon } from '@ui/button';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { HStack } from '@ui/hstack';
import { Heading } from '@ui/heading';
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
      className={` ${productItem.isDeleted ? 'bg-red-400' : 'bg-trueGray-700'} items-center p-2 pr-2 rounded-md mb-3 w-full justify-between `}
    >
      <Image
        source={getImageSource()}
        alt="Product"
        className="w-20 h-20 rounded-md"
      />
      <VStack className="flex-1 p-[8px] justify-between items-start">
        <Heading size="xs" className="text-trueGray-100">
          {`Produto: ${productItem.code} - ${productItem.description}`}
        </Heading>
        <Text className="text-trueGray-400">
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
        <Divider className="my-0.5 bg-trueGray-500 mb-0.5" />

        <HStack className="mt-1 justify-between items-center w-full gap-[8px]">
          <HStack className="gap-[8px]">
            <Button
              onPress={handleAskConfirmDelete}
              className="w-10 h-10 rounded-md bg-amber-500  active:bg-amber-600"
            >
              {!productItem.isDeleted && <ButtonIcon as={Trash} size="xl" />}
              {productItem.isDeleted && (
                <ButtonIcon as={ArchiveRestore} size="xl" />
              )}
            </Button>
            {productItem.isComposed && (
              <Button
                onPress={handleListItemComposition}
                className="w-10 h-10 rounded-md bg-darkBlue-400  active:bg-darkBlue-500"
              >
                <ButtonIcon as={ClipboardList} size="xl" />
              </Button>
            )}
          </HStack>
          <HStack className="gap-[8px]">
            {!productItem.isDeleted && (
              <>
                <Button
                  onPress={() => {
                    handleShowModalQuantity(productItem.quantity);
                  }}
                  className="w-10 h-10 rounded-md bg-blueGray-500  active:bg-blueGray-400"
                >
                  <ButtonIcon as={Sigma} size="xl" />
                </Button>
                <Button
                  onPress={handleUpQty}
                  className="w-10 h-10 rounded-md bg-green-700  active:bg-green-500"
                >
                  <ButtonIcon as={Plus} size="xl" />
                </Button>
                <Button
                  onPress={handleDownQty}
                  className="w-10 h-10 rounded-md bg-red-700  active:bg-red-500"
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
