export interface Category {
  label: string;
  slug: string;
  link: string;
  icon?: React.ComponentType<{ size: number }>;
}
