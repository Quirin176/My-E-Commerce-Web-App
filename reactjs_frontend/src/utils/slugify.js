export function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")          // spaces → dash
    .replace(/[^\w-]+/g, "")       // remove non-word chars
    .replace(/--+/g, "-")          // collapse dashes
    .replace(/^-+|-+$/g, "");      // trim dashes
}