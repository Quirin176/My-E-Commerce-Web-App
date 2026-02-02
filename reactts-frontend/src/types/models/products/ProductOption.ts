export interface ProductOption {
  optionId: number;
  name: string;
  optionValues: Array<{
    optionValueId: number;
    value: string;
  }>;
}
