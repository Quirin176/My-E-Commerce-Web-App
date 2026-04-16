export interface ProductOption {
  optionId: number;
  optionName: string;
  optionValues: Array<{ id: number; value: string; }>;
}

export interface ProductOptionFlat {
  optionName: string;
  value: string;
}
