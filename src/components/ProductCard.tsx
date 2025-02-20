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
  ModalCloseButton,
  ModalFooter,
} from '@gluestack-ui/themed';
import { type ProductModel } from '@models/ProductModel';
import {
  CheckCheck,
  Disc,
  Minus,
  Plus,
  Save,
  Sigma,
  X,
} from 'lucide-react-native';
import { HandTap } from 'phosphor-react-native';
import React, { useMemo } from 'react';
import { Input } from './Input';

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
    () => product.qty * product.price,
    [product.qty, product.price],
  );
  const [showModalQuantity, setShowModalQuantity] = React.useState(false);
  const [itemEdit, setItemEdit] = React.useState<ProductModel | null>(null);

  const handleShowModalQuantity = (item: ProductModel) => {
    setItemEdit(item);
    setShowModalQuantity(true);
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
        source={{ uri: product.image }}
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
          {`${product.id} - ${product.name}`}
        </Heading>
        <Text color="$trueGray400">
          {`${product.qty.toLocaleString('pt-BR', {
            maximumFractionDigits: 2,
          })} ${product.unity} x ${product.price.toLocaleString('pt-BR', {
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
              backgroundColor={product.selected ? '$green700' : '$blueGray600'}
              $active-bg="$green500"
              onPress={handleSelectProduct}
            >
              {!product.selected && <ButtonIcon as={HandTap} size="xl" />}
              {product.selected && <ButtonIcon as={CheckCheck} size="xl" />}
            </Button>
          </HStack>
        </HStack>
      </VStack>
      <ModalQuantity
        visible={showModalQuantity}
        handleCloseModal={() => {
          setShowModalQuantity(false);
        }}
      />
    </HStack>
  );
}

interface ModalQuantityProps {
  visible: boolean;
  handleCloseModal: () => void;
}

function ModalQuantity({ visible, handleCloseModal }: ModalQuantityProps) {
  const handleSaveData = () => {
    handleCloseModal();
  };

  return (
    <Modal isOpen={visible}>
      <ModalBackdrop />
      <ModalContent bg="$trueGray600" rounded="$md">
        <ModalHeader />
        <ModalBody>
          <Heading color="$blueGray300">Quantidade</Heading>
          <Input />
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
