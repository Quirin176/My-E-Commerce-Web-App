import {
  Laptop,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  Cable,
  LayoutGrid,
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  "laptop": Laptop,
  "monitor": Monitor,
  "keyboard": Keyboard,
  "mouse": Mouse,
  "audio-devices": Headphones,
  "accessories": Cable
};

export const getCategoryIcon = (slug: string, size: number) => {
  const Icon = categoryIcons[slug.toLowerCase()] ?? LayoutGrid;
  return <Icon size={size} />;
};