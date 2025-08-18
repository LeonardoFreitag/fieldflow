function maskCurrency(value: string): string {
  const str = value.substring(0, 1);
  let valor: string = value.replace(/\D/g, '');
  valor = valor.replace(/^(0+)(\d{3})/g, '$2');
  valor = valor.replace(/(\d)(\d{2})$/, '$1,$2');
  valor = valor.replace(/(?=(\d{3})+(\D))\B/g, '.');
  if (str === '-') {
    valor = `${str}${valor}`;
  }
  if (
    valor === '0' ||
    valor === '0,0' ||
    valor === '0,00' ||
    valor === '' ||
    valor === '00'
  ) {
    valor = '0,00';
  }
  return valor;
}

function maskInteger(value: string): string {
  let valor: string = value.replace(/\D/g, '');
  valor = valor.replace(/(?=(\d{3})+(\D))\B/g, '.');
  return valor;
}

function maskCep(value: string): string {
  const valor: string = value.replace(/\D/g, '');
  let maxValue = valor.substring(0, 8);
  maxValue = maxValue.replace(/^(\d{5})(\d)/, '$1-$2');
  return maxValue;
}

function maskDoc(value: string): string {
  const valor: string = value.replace(/\D/g, '');
  let maxValue = valor.substring(0, 14);
  if (maxValue.length <= 11) {
    maxValue = maxValue.replace(/^(\d{3})(\d{3})(\d{3})(\d)/, '$1.$2.$3-$4');
  } else {
    maxValue = maxValue.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d)/,
      '$1.$2.$3/$4-$5',
    );
  }
  return maxValue;
}

function maskCellPhone(value: string): string {
  const valor: string = value.replace(/\D/g, '');
  let maxValue = valor.substring(0, 11);
  maxValue = maxValue.replace(/^(\d{2})(\d{5})(\d)/, '($1)$2-$3');
  return maxValue;
}

function maskPhone(value: string): string {
  const valor: string = value.replace(/\D/g, '');
  let maxValue = valor.substring(0, 10);
  maxValue = maxValue.replace(/^(\d{2})(\d{4})(\d)/, '($1)$2-$3');
  return maxValue;
}

function maskDate(value: string): string {
  const valor: string = value.replace(/\D/g, '');
  let maxValue = valor.substring(0, 8);
  maxValue = maxValue.replace(/^(\d{2})(\d{2})(\d)/, '$2/$2/$4');
  return maxValue;
}
export {
  maskCurrency,
  maskInteger,
  maskCep,
  maskDoc,
  maskCellPhone,
  maskPhone,
  maskDate,
};
