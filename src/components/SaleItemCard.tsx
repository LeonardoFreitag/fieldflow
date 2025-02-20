import {
  Heading,
  HStack,
  Image,
  VStack,
  Text,
  Button,
  ButtonIcon,
  Divider,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@gluestack-ui/themed';
import { type SaleItemModel } from '@models/SaleItemModel';
import { useNavigation } from '@react-navigation/native';
import { updateSaleEdit } from '@store/slice/sale/saleEditSlice';
import { addSaleItemEdit } from '@store/slice/saleItem/saleItemEditSlice';
import { useAppSelector } from '@store/store';
import {
  ArchiveRestore,
  ClipboardList,
  Minus,
  Plus,
  Sigma,
  Trash,
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

interface SaleItemCardProps {
  saleItem: SaleItemModel;
}

export function SaleItemCard({ saleItem }: SaleItemCardProps) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const saleEdit = useAppSelector(state => state.saleEdit);
  const [showModalQuantity, setShowModalQuantity] = React.useState(false);

  const totalProduct = useMemo(() => {
    return saleItem.quantity * saleItem.price;
  }, [saleItem.quantity, saleItem.price]);

  const handleAskConfirmDelete = () => {
    const title = saleItem.is_deleted ? 'Restaurar item' : 'Deletar item';
    const message = saleItem.is_deleted
      ? 'Confirma restaurar item?'
      : 'Confirma deletar item?';
    const buttonTitle = saleItem.is_deleted ? 'Restaurar' : 'Deletar';
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
      updateSaleEdit({
        ...saleEdit,
        saleItems: saleEdit.saleItems.map(item => {
          if (item.id === saleItem.id) {
            return {
              ...item,
              is_deleted: !item.is_deleted,
            };
          }
          return item;
        }),
      }),
    );
  };

  const handleUpQty = () => {
    dispatch(
      updateSaleEdit({
        ...saleEdit,
        saleItems: saleEdit.saleItems.map(item => {
          if (item.id === saleItem.id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        }),
      }),
    );
  };

  const handleDownQty = () => {
    if (saleItem.quantity === 1) {
      return;
    }

    dispatch(
      updateSaleEdit({
        ...saleEdit,
        saleItems: saleEdit.saleItems.map(item => {
          if (item.id === saleItem.id) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          return item;
        }),
      }),
    );
  };

  const handleListItemComposition = () => {
    dispatch(addSaleItemEdit(saleItem));
    navigation.navigate('SaleItemComposition');
  };

  return (
    <HStack
      bg={saleItem.is_deleted ? '$red400' : '$trueGray700'}
      alignItems="center"
      p="$2"
      pr="$2"
      rounded="$md"
      mb="$3"
      w="$full"
      justifyContent="space-between"
    >
      <Image
        source={{ uri: saleItem.cover_image }}
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
          {`Produto: ${saleItem.id} - ${saleItem.product}`}
        </Heading>
        <Text color="$trueGray400">
          {`${saleItem.quantity.toLocaleString('pt-BR', {
            maximumFractionDigits: 2,
          })} ${saleItem.unity} x ${saleItem.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })} = ${totalProduct.toLocaleString('pt-BR', {
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
              {!saleItem.is_deleted && <ButtonIcon as={Trash} size="xl" />}
              {saleItem.is_deleted && (
                <ButtonIcon as={ArchiveRestore} size="xl" />
              )}
            </Button>
            {saleItem.is_composed && (
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
            {!saleItem.is_deleted && (
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
      {showModalQuantity && <ModalQuantity />}
    </HStack>
  );
}

function ModalQuantity() {
  return (
    <Modal>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <ModalCloseButton>
            <ButtonIcon as={Trash} size="xl" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody />
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
