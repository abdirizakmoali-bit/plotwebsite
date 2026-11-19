export type SaleCategory = "all" | "property" | "land";

export function whatsApp(message: string) {
  return "https://wa.me/252638339599?text=" + encodeURIComponent(message);
}
