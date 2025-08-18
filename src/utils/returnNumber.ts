function returnNumber(value: string): number {
  const valorStr = value.split('.').join('');
  const newValue = valorStr.replace(',', '.');
  const valorNumber = Number(newValue);
  return valorNumber;
}

export { returnNumber };
