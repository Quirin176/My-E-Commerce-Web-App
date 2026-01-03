export function slugify(text: string): string {
  return text
    .normalize("NFKD")                     // Normalize accents (ê → e)
    .replace(/[\u0300-\u036f]/g, "")       // Remove accent marks
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")         // Remove invalid chars
    .replace(/\s+/g, "-")                  // Replace spaces with -
    .replace(/-+/g, "-")                   // Collapse multiple -
    .replace(/^-+|-+$/g, "");              // Trim starting/ending -
}
