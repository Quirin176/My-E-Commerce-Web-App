export interface ProductOption {
  optionId: string | number;
  name: string;
  optionValues: Array<{
    optionValueId: string | number;
    value: string;
  }>;
}
