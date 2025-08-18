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
} from '@gluestack-ui/themed';
import { type ProductModel } from '@models/ProductModel';
import { Minus, Plus, Save, Sigma, X } from 'lucide-react-native';
import { HandTap } from 'phosphor-react-native';
import React, { useMemo, useState } from 'react';
import { Input } from './Input';
import { useDispatch } from 'react-redux';
import { updateProductList } from '@store/slice/product/productListSlice';
import productPlaceholder from '@assets/product.png'; // Placeholder for product image

interface ProductCardProps {
  product: ProductModel;
  handleSelectProduct: () => void;
  handleUpQty: () => void;
  handleDownQty: () => void;
}

export function ProductCard({
  product,
  handleSelectProduct,
  handleUpQty,
  handleDownQty,
}: ProductCardProps) {
  const totalProduct = useMemo(
    () => Number(product.qty) * Number(product.price ?? 0),
    [product.qty, product.price],
  );
  const [showModalQuantity, setShowModalQuantity] = useState(false);
  const [itemEdit, setItemEdit] = useState<ProductModel | null>(null);
  const [imageError, setImageError] = useState(false);

  const handleShowModalQuantity = (item: ProductModel) => {
    setItemEdit(item);
    setShowModalQuantity(true);
  };

  const getImageSource = () => {
    if (imageError || !product.photoUrl || product.photoUrl === '') {
      return productPlaceholder;
    }
    return { uri: product.photoUrl };
  };

  return (
    <HStack
      bg="$trueGray700"
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
          {`${product.code} - ${product.description}`}
        </Heading>
        <Text color="$trueGray400">
          {`${Number(product.qty).toLocaleString('pt-BR', {
            maximumFractionDigits: 2,
          })} ${product.unity} x ${Number(product.price ?? 0).toLocaleString(
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
        <Divider my="$0.5" bgColor="$trueGray500" mb="$0.5" />

        <HStack
          marginTop="$1"
          justifyContent="space-between"
          alignItems="center"
          w="$full"
          gap={8}
        >
          <HStack gap={8}>
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
              <Button
                width="$10"
                height="$10"
                rounded="$md"
                backgroundColor="$blueGray500"
                $active-bg="$blueGray400"
                onPress={() => {
                  handleShowModalQuantity(product);
                }}
              >
                <ButtonIcon as={Sigma} size="xl" />
              </Button>
            </>
          </HStack>
          <HStack gap={8}>
            <Button
              width="$10"
              height="$10"
              rounded="$md"
              backgroundColor={product.selected ? '$green500' : '$blueGray600'}
              // $active-bg="$green500"
              onPress={handleSelectProduct}
            >
              <ButtonIcon as={HandTap} size="xl" />
            </Button>
          </HStack>
        </HStack>
      </VStack>
      <ModalQuantity
        visible={showModalQuantity}
        handleCloseModal={() => {
          setShowModalQuantity(false);
        }}
        itemEdit={itemEdit}
      />
    </HStack>
  );
}

interface ModalQuantityProps {
  visible: boolean;
  handleCloseModal: () => void;
  itemEdit: ProductModel | null;
}

function ModalQuantity({
  visible,
  handleCloseModal,
  itemEdit,
}: ModalQuantityProps) {
  const dispatch = useDispatch();
  const [qtyTyped, setQtyTyped] = useState(
    Number(itemEdit?.qty ?? 1).toString(),
  );

  const handleSaveData = () => {
    if (itemEdit) {
      dispatch(
        updateProductList({
          ...itemEdit,
          qty: Number(qtyTyped),
        }),
      );
    }
    handleCloseModal();
  };

  return (
    <Modal isOpen={visible}>
      <ModalBackdrop />
      <ModalContent bg="$trueGray600" rounded="$md">
        <ModalHeader />
        <ModalBody>
          <Heading color="$blueGray300">Quantidade</Heading>
          <Input
            autoFocus
            keyboardType="numeric"
            defaultValue={Number(itemEdit?.qty ?? 1).toString()}
            value={qtyTyped}
            onChangeText={setQtyTyped}
          />
          <HStack mt="$2" justifyContent="flex-end" gap="$2">
            <Button
              width="$20"
              height="$10"
              rounded="$md"
              backgroundColor="$green700"
              $active-bg="$green500"
              onPress={handleSaveData}
            >
              <ButtonIcon as={Save} size="xl" />
            </Button>
            <Button
              width="$20"
              height="$10"
              rounded="$md"
              backgroundColor="$red700"
              $active-bg="$red500"
              onPress={handleCloseModal}
            >
              <ButtonIcon as={X} size="xl" />
            </Button>
          </HStack>
        </ModalBody>
        {/* <ModalFooter /> */}
      </ModalContent>
    </Modal>
  );
}
