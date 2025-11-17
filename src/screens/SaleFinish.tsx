import { Text } from '@ui/text';
import { HStack } from '@ui/hstack';
import { VStack } from '@ui/vstack';
import { Heading } from '@ui/heading';
import { Button, ButtonIcon } from '@ui/button';
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
import { FlatList } from 'react-native';
import { type TravelClientOrdersPaymentFormModel } from '@models/TravelClientOrdersPaymentFormModel';
import { SelectPicker } from '@components/SelectPicker';
import { type TravelClientOrdersModel } from '@models/TravelClientOrdersModel';
import { type TravelClientOrdersItemsModel } from '@models/TravelClientOrdersItemsModel';
import { api } from '@services/api';
import { type TravelModel } from '@models/TravelModel';
import { type TravelClientsModel } from '@models/TravelClientsModel';
import { updateTravelEdit } from '@store/slice/travel/travelEditSlice';
import { CreateTravel } from '@storage/travel/createTravelRoute';
import { updateClientList } from '@store/slice/client/clientListSlice';
import { Input } from '@/components/Input';

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
        isComposed: item.isComposed,
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

      // Verificar tanto no clientEdit quanto no travelClientEdit
      if (
        clientEdit.dataFrom === 'ad_hoc' ||
        travelClientEdit.dataFrom === 'ad_hoc'
      ) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'SaleRouteDrive' }],
        });
        return;
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'SaleRouteDrive' }],
      });
    } catch (error) {
      console.error('Erro ao enviar o pedido:', error);
      // Aqui você pode tratar o erro, exibir uma mensagem ao usuário, etc.
    }
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
    <VStack className="flex-1">
      <CustomerHeader data={clientEdit} showBackButton={false} />
      <Heading size="sm" className="mx-1 mt-1 text-typography-700">
        {`Fechamento pedido - Itens: ${travelClientOrderEdit.TravelClientOrdersItems?.length}`}
      </Heading>
      <VStack className="p-2 rounded-md mb-8">
        <Text size="sm" className="text-typography-100 w-full mb-2">
          Observações:
        </Text>
        <Input
          placeholder="Observações sobre o pedido..."
          keyboardType="default"
          autoCapitalize="none"
          onChangeText={setObservations}
          value={observations}
          // error={errors.email?.message}
        />
      </VStack>

      <HStack className="justify-between w-full mt-2 items-end">
        <Text size="xs" className="mx-1 mt-1 text-error-500 font-bold">
          {`Total: ${travelOrderTotal?.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}`}
        </Text>
        <Text size="xs" className="mx-1 mt-1 text-success-500 font-bold">
          {`Total pago: ${totalPago?.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}`}
        </Text>
        <Text size="xs" className="mx-1 mt-1 text-info-500 font-bold">
          {`Saldo: ${totalRestante?.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}`}
        </Text>
      </HStack>
      <VStack space="md" className="mt-4 p-2 rounded-md h-[70%] justify-start">
        <VStack className="mb-2">
          <Heading size="sm" className="text-typography-700 mb-2">
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
        <HStack className="w-full justify-between gap-2 items-end">
          <VStack className="w-full flex-1">
            <Heading size="sm" className="text-typography-700 mb-2">
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
              <Text size="xs" className="text-error-500 mt-1">
                {errors.amount.message}
              </Text>
            )}
          </VStack>
          <Button
            onPress={handleImportValueFromOrder}
            className="w-12 h-12 rounded-md bg-info-300  active:bg-info-400"
          >
            <ButtonIcon
              as={CornerDownLeft}
              size="xl"
              className="text-typography-700"
            />
          </Button>
          <Button
            onPress={handleIncludePaymentForm}
            className="w-12 h-12 rounded-md bg-success-300  active:bg-success-400"
          >
            <ButtonIcon as={Check} size="xl" className="text-typography-700" />
          </Button>
        </HStack>
        <FlatList
          data={travelClientOrdersPaymentFormList}
          keyExtractor={paymentForm =>
            paymentForm.id?.toString() ?? Math.random().toString()
          }
          renderItem={({ item }) => (
            <HStack className="justify-between items-center p-2 rounded-md bg-background-0 mb-1">
              <HStack className="flex-1 gap-10">
                <Text size="sm" className="text-typography-700 w-3/5">
                  {item.description}
                </Text>
                <Text size="xs" className="text-typography-700">
                  {item.amount.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Text>
              </HStack>
              <Button
                onPress={() => {
                  handleRemovePaymentForm(item);
                }}
                className="w-12 h-12 rounded-md bg-error-300  active:bg-error-400"
              >
                <ButtonIcon as={Trash} size="lg" />
              </Button>
            </HStack>
          )}
          ListEmptyComponent={
            <Text size="sm" className="text-typography-400 text-center">
              Nenhuma forma de pagamento adicionada.
            </Text>
          }
        />
      </VStack>
      {/* </VStack> */}
      <HStack className="justify-between absolute bottom-0 left-0 bg-background-200 w-[100%] h-24 p-2">
        <Button
          size="lg"
          onPress={() => {
            navigation.goBack();
          }}
          className="rounded-md w-24 h-12 bg-info-300  active:bg-info-400 gap-1"
        >
          <ButtonIcon
            as={ChevronLeft}
            size="xl"
            className="text-typography-700"
          />
          <Text size="xs" className="text-typography-700">
            Voltar
          </Text>
        </Button>
        <Button
          size="lg"
          onPress={handleFinishOrder}
          className="rounded-md w-24 h-12 bg-success-300  active:bg-success-400 gap-1"
        >
          <ButtonIcon as={Send} size="lg" className="text-typography-700" />
          <Text size="xs" className="text-typography-700">
            Enviar
          </Text>
        </Button>
      </HStack>
    </VStack>
  );
}
