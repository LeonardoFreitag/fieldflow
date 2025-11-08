import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectInput as BaseSelectInput,
} from '@ui/select';
import { type SelectOptionsModel } from '@models/SelectOptionsModel';
import { ChevronDownIcon } from 'lucide-react-native';

interface SelectInputProps {
  selectOptions: SelectOptionsModel[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export function SelectInput({
  selectOptions,
  value,
  onValueChange,
  placeholder = 'Selecione uma opção',
}: SelectInputProps) {
  return (
    <Select selectedValue={value ?? ''} onValueChange={onValueChange}>
      <SelectTrigger variant="outline" size="md">
        <BaseSelectInput placeholder={placeholder} className="color-white" />
        <SelectIcon as={ChevronDownIcon} size="lg" className="mr-2" />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {selectOptions?.map((option, index) => (
            <SelectItem key={index} label={option.label} value={option.value} />
          ))}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}
