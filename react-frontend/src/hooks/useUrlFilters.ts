import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function useUrlFilters<T extends Record<string, any>>(defaults: T) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Parse URL query parameters
  const state = {} as T;

  for (const key in defaults) {
    const defaultValue = defaults[key];
    const raw = searchParams.get(key);

    if (raw === null) {
      state[key] = defaultValue;
    } else if (Array.isArray(defaultValue)) {         // Array Type
      const items = raw.split(",").filter(Boolean);
      const defaultIsNumeric = defaultValue.length === 0 || typeof defaultValue[0] === "number";
      state[key] = (
        defaultIsNumeric
          ? items.map((v) => {
            const n = Number(v);
            return isNaN(n) ? v : n;
          })
          : items
      ) as any;
    } else if (typeof defaultValue === "number") {         // Number Type
      state[key] = (Number(raw) || defaultValue) as any;
    } else {
      state[key] = raw as any;         // String Type
    }
  }

  // Update URL
  const updateUrl = useCallback(
    (overrides: Partial<T>) => {
      const current = {} as T;
      for (const key in defaults) {
        const defaultValue = defaults[key];
        const raw = searchParams.get(key);
 
        if (raw === null) {
          current[key] = defaultValue;
        } else if (Array.isArray(defaultValue)) {
          const items = raw.split(",").filter(Boolean);
          const defaultIsNumeric =
            defaultValue.length === 0 || typeof defaultValue[0] === "number";
          current[key] = (
            defaultIsNumeric
              ? items.map((v) => {
                  const n = Number(v);
                  return isNaN(n) ? v : n;
                })
              : items
          ) as any;
        } else if (typeof defaultValue === "number") {
          current[key] = (Number(raw) || defaultValue) as any;
        } else {
          current[key] = raw as any;
        }
      }
 
      const next = { ...current, ...overrides };
      const params = new URLSearchParams();
 
      for (const key in next) {
        const value = next[key];
        const defaultValue = defaults[key];
 
        if (value === undefined || value === null) continue;
        if (Array.isArray(value) && value.length === 0) continue;
        if (value === "") continue;
        // Skip default scalar values to keep URLs clean
        if (!Array.isArray(value) && value === defaultValue) continue;
 
        params.set(
          key,
          Array.isArray(value) ? value.join(",") : String(value)
        );
      }
 
      navigate({ search: params.toString() }, { replace: true });
    },
    [navigate, searchParams]
  );

  return { ...state, updateUrl };
}