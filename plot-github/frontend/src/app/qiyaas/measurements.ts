export type House = "bungalow" | "framed";
export type Finish = "standard" | "high";

export function parseArea(input: string) {
  const value = input.trim().replace(",", ".");
  if (!/^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(value)) return null;
  const area = Number(value);
  return area < 1e12 ? area : null;
}
