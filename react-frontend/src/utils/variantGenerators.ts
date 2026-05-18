import type { ProductOption } from "../types/models/products/ProductOption";
import type { VariantRow, SkuContext, GenerateRowsParams } from "../types/models/products/variantTypes";

// ─── SKU helpers ──────────────────────────────────────────────────────────────

export function toSkuPart(str: string): string {
  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 8);
}

export function buildSku(context: SkuContext, attrValues: string[]): string {
  const cat = toSkuPart(context.categoryName).slice(0, 6) || "CAT";
  const prod = toSkuPart(context.productName).slice(0, 10) || "PROD";
  const attrs = attrValues.map(toSkuPart).filter(Boolean).join("").slice(0, 20);

  return `${cat}-${prod}-${attrs}`.slice(0, 99);
}

// ─── Combination helpers ──────────────────────────────────────────────────────

export function cartesian<T>(arrays: T[][]): T[][] {
  if (arrays.length === 0) return [[]];
  return arrays.reduce<T[][]>(
    (acc, arr) => acc.flatMap((combo) => arr.map((item) => [...combo, item])),
    [[]]
  );
}

export function groupByOption(selectedIds: number[], filters: ProductOption[]): number[][] {
  return filters
    .map((opt) =>
      opt.optionValues.map((v) => v.id).filter((id) => selectedIds.includes(id))
    )
    .filter((g) => g.length > 0);
}

export function buildLabel(optionValueIds: number[], filters: ProductOption[]): string {
  const parts: string[] = [];

  for (const opt of filters)
    for (const val of opt.optionValues)
      if (optionValueIds.includes(val.id)) parts.push(val.value);

  return parts.join(" / ") || "Variant";
}

export function buildAttrValues(optionValueIds: number[], filters: ProductOption[]): string[] {
  const parts: string[] = [];

  for (const opt of filters)
    for (const val of opt.optionValues)
      if (optionValueIds.includes(val.id)) parts.push(val.value);

  return parts;
}
// ─────────────────────────────────────────────────────────────────────────────
// GENERATE ROWS
// ─────────────────────────────────────────────────────────────────────────────

export function generateRows({
  selectedOptionValueIds,
  filters,
  existingRows,
  skuContext
}: GenerateRowsParams): VariantRow[] {

  const groups = groupByOption(selectedOptionValueIds, filters);
  const combos = cartesian(groups);

  const rows: VariantRow[] = combos.map((combo, index) => {
    const existing = existingRows.find(r =>
      r.optionValueIds.length === combo.length &&
      r.optionValueIds.every(id => combo.includes(id))
    );

    const variantName = buildLabel(combo, filters);
    const attrValues = buildAttrValues(combo, filters);
    const sku = buildSku(skuContext, attrValues);

    return (
      existing ?? {
        key: `variant-${index}-${Date.now()}`,
        variantName,
        sku,
        originalPrice: 0,
        price: 0,
        stock: 0,
        images: [],
        imageInput: "",
        open: false,
        optionValueIds: combo,
        serverId: 0
      }
    );
  });

  return rows;
}