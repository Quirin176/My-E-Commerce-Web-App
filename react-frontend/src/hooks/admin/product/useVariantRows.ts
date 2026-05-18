import { useState, useEffect } from "react";
import type { VariantRow, GenerateRowsParams } from "../../../types/models/products/variantTypes";
import {
  buildSku,
  buildLabel,
  buildAttrValues,
  cartesian,
  groupByOption,
} from "../../../utils/variantGenerators";

export function useVariantRows({
  filters,
  selectedOptionValueIds,
  skuContext,
  initialRows = [],
}: GenerateRowsParams & { initialRows?: VariantRow[] }) {
  const [rows, setRows] = useState<VariantRow[]>(initialRows);

  // Auto-generate variants
  useEffect(() => {
    const groups = groupByOption(selectedOptionValueIds, filters);
    const combos = cartesian(groups);

    const newRows: VariantRow[] = combos.map((combo) => {
      const optionValueIds = combo;
      const attrValues = buildAttrValues(combo, filters);
      const sku = buildSku(skuContext, attrValues);

      return {
        key: optionValueIds.join("-"),
        variantName: buildLabel(optionValueIds, filters),
        sku,
        originalPrice: 0,
        price: 0,
        stock: 0,
        images: [],
        imageInput: "",
        open: false,
        optionValueIds,
        serverId: 0,
      };
    });

    setRows(newRows);
  }, [selectedOptionValueIds, filters, skuContext]);

  return { rows, setRows };
}