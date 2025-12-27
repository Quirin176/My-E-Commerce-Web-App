export interface Category {
  label: string;
  link: string;
  slug: string;
  icon?: React.ComponentType<{ size: number }>;
}
