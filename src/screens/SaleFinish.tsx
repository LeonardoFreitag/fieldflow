import {
  Button,
  ButtonIcon,
  Heading,
  VStack,
  HStack,
  Text,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { CustomerHeader } from '@components/CustomerHeader';
import {
  Check,
  ChevronLeft,
  CornerDownLeft,
  Send,
  Trash,
} from 'lucide-react-native';
import { useAppSelector } from '../store/store';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { InputNumber } from '@components/InputNumber';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  addTravelClientOrdersPaymentFormList,
  resetTravelClientOrdersPaymentFormList,
  deleteTravelClientOrdersPaymentFormList,
} from '@store/slice/travel/travelClientOrderPamentFormListSlice';
import uuid from 'react-native-uuid';
import { returnNumber } from '@utils/returnNumber';
import { FlatList, Keyboard } from 'react-native';
import { type TravelClientOrdersPaymentFormModel } from '@models/TravelClientOrdersPaymentFormModel';
import { SelectPicker } from '@components/SelectPicker';
import { Input } from '@components/Input';
import { type TravelClientOrdersModel } from '@models/TravelClientOrdersModel';
import { type TravelClientOrdersItemsModel } from '@models/TravelClientOrdersItemsModel';
import { api } from '@services/api';
import { type TravelModel } from '@models/TravelModel';
import { type TravelClientsModel } from '@models/TravelClientsModel';
import { updateTravelEdit } from '@store/slice/travel/travelEditSlice';
import { CreateTravel } from '@storage/travel/createTravelRoute';
import { updateClientList } from '@store/slice/client/clientListSlice';

const PaymentFormSchema = yup.object().shape({
  paymentFormId: yup
    .string()
    .required('Campo obrigatório')
    .test('not-empty', 'Campo obrigatório', value => value !== ''),
  amount: yup.string().required('Campo obrigatório'),
});

interface PaymentFormData {
  paymentFormId: string;
  amount: string;
}

export function SaleFinish() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const travelClientEdit = useAppSelector(state => state.travelClientEdit);
  const travelClientOrderEdit = useAppSelector(
    state => state.travelClientOrderEdit,
  );
  const clientEdit = useAppSelector(state => state.clientEdit);
  const travelClientOrdersPaymentFormList = useAppSelector(
    state => state.travelClientOrdersPaymentFormList,
  );
  const travelEdit = useAppSelector(state => state.travelEdit);
  const [observations, setObservations] = React.useState(
    travelClientOrderEdit.notes ?? '',
  );

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: yupResolver(PaymentFormSchema),
    defaultValues: {
      paymentFormId: '',
      amount: '0',
    },
  });

  const travelOrderTotal = useMemo(() => {
    const total = travelClientOrderEdit.TravelClientOrdersItems?.reduce(
      (acc, saleItem) => {
        const itemTotal = Number(saleItem.quantity) * Number(saleItem.price);
        return acc + itemTotal;
      },
      0,
    );
    return total;
  }, [travelClientOrderEdit.TravelClientOrdersItems]);

  const handleFinishOrder = async () => {
    // enviar o pedido para api
    const newTravelClientOrder: TravelClientOrdersModel = {
      travelClientId: travelClientOrderEdit.travelClientId,
      clientId: clientEdit.id ?? '',
      orderNumber: '',
      orderDate: new Date(),
      notes: observations,
      status: 'completed',
      total: travelOrderTotal ?? 0,
      TravelClientOrdersItems: (
        travelClientOrderEdit.TravelClientOrdersItems ?? []
      ).map((item: TravelClientOrdersItemsModel) => ({
        productId: item.productId,
        code: item.code,
        reference: item.reference,
        description: item.description,
        unity: item.unity,
        price: Number(item.price),
        quantity: Number(item.quantity),
        amount: Number(item.amount),
        notes: item.notes,
        isDeleted: item.isDeleted ?? false,
        isComposed: item.isComposed ?? false,
        tableCode: item.tableCode,
        TravelClientOrdersItemsComposition:
          item.TravelClientOrdersItemsComposition?.map(composition => ({
            productId: composition.productId,
            stockId: composition.stockId,
            pCode: composition.pCode,
            pReference: composition.pReference,
            pDescription: composition.pDescription,
            pUnity: composition.pUnity,
            pQuantity: Number(composition.pQuantity),
            pPrice: Number(composition.pPrice),
            pAmount: Number(composition.pAmount),
            removed: composition.removed,
            tableCode: composition.tableCode,
          })),
      })),
      TravelClientOrdersPaymentForm: travelClientOrdersPaymentFormList.map(
        paymentForm => ({
          paymentFormId: paymentForm.paymentFormId,
          description: paymentForm.description,
          amount: Number(paymentForm.amount),
          installments: paymentForm.installments,
        }),
      ),
    };

    try {
      const response = await api.post<TravelClientOrdersModel>(
        '/travel/travelClientOrders',
        newTravelClientOrder,
      );

      const checkOutClient: TravelClientsModel = {
        id: travelClientEdit.id ?? '',
        travelId: travelClientEdit.travelId ?? '',
        clientId: travelClientEdit.clientId ?? '',
        clientCode: travelClientEdit.clientCode ?? '',
        orderInRoute: travelClientEdit.orderInRoute ?? '',
        latitude: Number(travelClientEdit.latitude) ?? 0,
        longitude: Number(travelClientEdit.longitude) ?? 0,
        checkInDate: travelClientEdit.checkInDate,
        notes: travelClientEdit.notes ?? '',
        checkOutDate: new Date(),
        status: 'visited',
        dataFrom: travelClientEdit.dataFrom ?? '',
      };

      const updatedTravelClient = await api.patch<TravelClientsModel>(
        '/travel/travelClients',
        checkOutClient,
      );

      const updateTravelClientOrder = response.data;

      const updatedTravel: TravelModel = {
        ...travelEdit,
        TravelClients: travelEdit.TravelClients?.map(client =>
          client.id === updatedTravelClient.data.id
            ? {
                ...updatedTravelClient.data,
                TravelClientOrders: [
                  ...(client.TravelClientOrders ?? []),
                  updateTravelClientOrder,
                ],
              }
            : client,
        ),
        orderedClients: travelEdit.orderedClients?.map(client => {
          if (client.id === updatedTravelClient.data.clientId) {
            return {
              ...client,
              visiteStatus: 'visited',
            };
          }
          return client;
        }),
      };

      dispatch(updateTravelEdit(updatedTravel));

      dispatch(
        updateClientList({
          ...clientEdit,
          status: 'visited',
        }),
      );

      dispatch(resetTravelClientOrdersPaymentFormList());

      CreateTravel(updatedTravel);

      navigation.reset({
        index: 0,
        routes: [{ name: 'SaleRouteDrive' }],
      });
    } catch (error) {
      console.error('Erro ao enviar o pedido:', error);
      // Aqui você pode tratar o erro, exibir uma mensagem ao usuário, etc.
      return;
    }

    // atualizar o estado no redux

    // marcar o cliente como atendido

    // salva tudo no local storage

    navigation.reset({
      index: 0,
      routes: [{ name: 'SaleRouteDrive' }],
    });
  };

  const selectOptions = useMemo(() => {
    return [
      ...(clientEdit.ClientPaymentForm?.map(method => ({
        label: method.description,
        value: method.id.toString(),
      })) || []),
    ];
  }, [clientEdit.ClientPaymentForm]);

  const totalPago = useMemo(() => {
    const total = travelClientOrdersPaymentFormList.reduce(
      (acc, paymentForm) => {
        return acc + Number(paymentForm.amount);
      },
      0,
    );
    return total;
  }, [travelClientOrdersPaymentFormList]);

  const totalRestante = useMemo(() => {
    return (travelOrderTotal ?? 0) - totalPago;
  }, [travelOrderTotal, totalPago]);

  const handleImportValueFromOrder = () => {
    const value = totalRestante.toFixed(2).replace('.', ',');
    setValue('amount', value);
  };

  const handleIncludePaymentForm = handleSubmit((data: PaymentFormData) => {
    // Busca a descrição da forma de pagamento selecionada
    const selectedPaymentMethod = clientEdit.ClientPaymentForm?.find(
      method => method.id.toString() === data.paymentFormId,
    );

    // Converte amount para number se for string
    const amountValue = returnNumber(data.amount);

    if (amountValue <= 0) {
      // Se o valor for menor ou igual a zero, não adiciona a forma de pagamento
      return;
    }

    // Cria a nova forma de pagamento
    const newPaymentForm = {
      id: uuid.v4().toString(),
      travelClientOrdersId: travelClientOrderEdit.id ?? '',
      paymentFormId: data.paymentFormId,
      description: selectedPaymentMethod?.description ?? '',
      amount: amountValue,
      installments: 1, // valor padrão
    };

    // Adiciona à lista no Redux
    dispatch(addTravelClientOrdersPaymentFormList(newPaymentForm));

    // Reseta o formulário e força limpeza do select
    reset({
      paymentFormId: '',
      amount: '0',
    });
  });

  const handleRemovePaymentForm = (
    paymentFormDelete: TravelClientOrdersPaymentFormModel,
  ) => {
    dispatch(deleteTravelClientOrdersPaymentFormList(paymentFormDelete));
  };

  return (
    <VStack flex={1}>
      <CustomerHeader data={clientEdit} showBackButton={false} />
      <VStack p="$2" flex={1} height="100%">
        <Heading size="sm" mx="$1" mt="$1" color="$trueGray100">
          {`Fechamento pedido - Itens: ${travelClientOrderEdit.TravelClientOrdersItems?.length}`}
        </Heading>
        <VStack
          justifyContent="space-between"
          alignItems="center"
          padding="$2"
          rounded="$md"
          backgroundColor="$trueGray800"
          flex={1}
        >
          <Text color="$trueGray100" size="sm" w="$full" mb="$2">
            Observações:
          </Text>
          <Input
            placeholder="Observações sobre o pedido..."
            keyboardType="default"
            autoCapitalize="none"
            numberOfLines={4}
            multiline
            rounded="$md"
            padding="$2"
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
            blurOnSubmit={true}
            onChangeText={text => {
              // Atualiza as observações no estado do pedido
              setObservations(text);
            }}
          />
        </VStack>

        <HStack
          justifyContent="space-between"
          w="$full"
          mt="$2"
          alignItems="flex-end"
        >
          <Text size="xs" mx="$1" mt="$1" color="$red500">
            {`Total: ${travelOrderTotal?.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}`}
          </Text>
          <Text size="xs" mx="$1" mt="$1" color="$green500">
            {`Total pago: ${totalPago?.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}`}
          </Text>
          <Text size="xs" mx="$1" mt="$1" color="$blue500">
            {`Saldo: ${totalRestante?.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}`}
          </Text>
        </HStack>
        <VStack
          space="md"
          mt="$4"
          p="$2"
          rounded="$md"
          height="70%"
          justifyContent="flex-start"
        >
          <VStack mb="$2">
            <Heading size="sm" color="$trueGray100" mb="$2">
              Forma de pagamento
            </Heading>
            <Controller
              control={control}
              name="paymentFormId"
              render={({ field: { onChange, value } }) => (
                <SelectPicker
                  value={value ?? ''}
                  onValueChange={onChange}
                  selectOptions={selectOptions}
                />
              )}
            />
          </VStack>
          <HStack
            w="$full"
            justifyContent="space-between"
            gap="$2"
            alignItems="flex-end"
          >
            <VStack w="$full" flex={1}>
              <Heading size="sm" color="$trueGray100" mb="$2">
                Valor
              </Heading>
              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, value } }) => (
                  <InputNumber
                    value={value?.toString()}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.amount && (
                <Text color="$red500" size="xs" mt="$1">
                  {errors.amount.message}
                </Text>
              )}
            </VStack>
            <Button
              width="$12"
              height="$12"
              rounded="$md"
              backgroundColor="$blue500"
              $active-bg="$blue700"
              onPress={handleImportValueFromOrder}
            >
              <ButtonIcon as={CornerDownLeft} size="xl" />
            </Button>
            <Button
              width="$12"
              height="$12"
              rounded="$md"
              backgroundColor="$green700"
              $active-bg="$green500"
              onPress={handleIncludePaymentForm}
            >
              <ButtonIcon as={Check} size="xl" />
            </Button>
          </HStack>
          <FlatList
            data={travelClientOrdersPaymentFormList}
            keyExtractor={paymentForm =>
              paymentForm.id?.toString() ?? Math.random().toString()
            }
            renderItem={({ item }) => (
              <HStack
                justifyContent="space-between"
                alignItems="center"
                padding="$2"
                rounded="$md"
                backgroundColor="$trueGray600"
                mb="$1"
              >
                <HStack flex={1} gap="$10">
                  <Text color="$trueGray100" size="sm" w="$3/5">
                    {item.description}
                  </Text>
                  <Text color="$trueGray400" size="xs">
                    {item.amount.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </Text>
                </HStack>
                <Button
                  width="$12"
                  height="$12"
                  rounded="$md"
                  backgroundColor="$red700"
                  $active-bg="$red500"
                  onPress={() => {
                    handleRemovePaymentForm(item);
                  }}
                >
                  <ButtonIcon as={Trash} size="lg" />
                </Button>
              </HStack>
            )}
            ListEmptyComponent={
              <Text color="$trueGray400" size="sm" textAlign="center">
                Nenhuma forma de pagamento adicionada.
              </Text>
            }
          />
        </VStack>
      </VStack>
      <HStack
        justifyContent="space-between"
        position="absolute"
        bottom="$0"
        left="$0"
        backgroundColor="$trueGray900"
        width="100%"
        height="$24"
        padding="$2"
      >
        <Button
          size="lg"
          rounded="$md"
          w="$24"
          h="$12"
          backgroundColor="$blue500"
          $active-bg="$blue700"
          onPress={() => {
            navigation.goBack();
          }}
          gap="$1"
        >
          <ButtonIcon as={ChevronLeft} size="xl" />
          <Text color="$trueGray100" size="xs">
            Voltar
          </Text>
        </Button>
        <Button
          size="lg"
          rounded="$md"
          w="$24"
          h="$12"
          backgroundColor="$green700"
          $active-bg="$green500"
          onPress={handleFinishOrder}
          gap="$1"
        >
          <ButtonIcon as={Send} size="lg" />
          <Text color="$trueGray100" size="xs">
            Enviar
          </Text>
        </Button>
      </HStack>
    </VStack>
  );
}
