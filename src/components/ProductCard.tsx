import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@ui/modal';
import { Divider } from '@ui/divider';
import { Button, ButtonIcon } from '@ui/button';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { Image } from '@ui/image';
import { HStack } from '@ui/hstack';
import { Heading } from '@ui/heading';
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
    <HStack className="bg-trueGray-700 items-center p-2 pr-2 rounded-md mb-3 w-full justify-between">
      <Image
        source={getImageSource()}
        alt="Product"
        className="w-20 h-20 rounded-md"
      />
      <VStack className="flex-1 p-[8px] justify-between items-start">
        <Heading size="xs" className="text-trueGray-100">
          {`${product.code} - ${product.description}`}
        </Heading>
        <Text className="text-trueGray-400">
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
        <Divider className="my-0.5 bg-trueGray-500 mb-0.5" />

        <HStack className="mt-1 justify-between items-center w-full gap-[8px]">
          <HStack className="gap-[8px]">
            <>
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
              <Button
                onPress={() => {
                  handleShowModalQuantity(product);
                }}
                className="w-10 h-10 rounded-md bg-blueGray-500  active:bg-blueGray-400"
              >
                <ButtonIcon as={Sigma} size="xl" />
              </Button>
            </>
          </HStack>
          <HStack className="gap-[8px]">
            <Button
              // $active-bg="$green500"
              onPress={handleSelectProduct}
              className={` ${product.selected ? 'bg-green-500' : 'bg-blueGray-600'} w-10 h-10 rounded-md `}
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
      <ModalContent className="bg-trueGray-600 rounded-md">
        <ModalHeader />
        <ModalBody>
          <Heading className="text-blueGray-300">Quantidade</Heading>
          <Input
            autoFocus
            keyboardType="numeric"
            defaultValue={Number(itemEdit?.qty ?? 1).toString()}
            value={qtyTyped}
            onChangeText={setQtyTyped}
          />
          <HStack className="mt-2 justify-end gap-2">
            <Button
              onPress={handleSaveData}
              className="w-20 h-10 rounded-md bg-green-700  active:bg-green-500"
            >
              <ButtonIcon as={Save} size="xl" />
            </Button>
            <Button
              onPress={handleCloseModal}
              className="w-20 h-10 rounded-md bg-red-700  active:bg-red-500"
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
