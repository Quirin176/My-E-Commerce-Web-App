export interface ProductOption {
  optionId: number;
  optionName: string;
  optionValues: Array<{
    optionValueId: number;
    value: string;
  }>;
}
