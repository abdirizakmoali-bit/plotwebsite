export type House = "bungalow" | "framed";
export type Finish = "standard" | "high";

export const rates = {
  bungalow: 200, framed: 400, upper: 350,
  boundary: 150, landscaping: 20, servicesPercent: 10, septic: 3500,
  highFinishPercent: 15,
};

export function buildingRate(rate: number, finish: Finish) {
  return finish === "high" ? rate * (100 + rates.highFinishPercent) / 100 : rate;
}

// Areas are limited to two decimal places. Price each line in US cents.
export function parseArea(input: string) {
  const value = input.trim().replace(",", ".");
  if (!/^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(value)) return null;
  const area = Number(value);
  return Number.isFinite(area) ? area : null;
}

export function estimate(house: House, finish: Finish, ground: string, upper: string[], wall: string, landscape: string) {
  const floors = (house === "framed" ? [ground, ...upper] : [ground]).map(parseArea);
  const wallArea = parseArea(wall.trim() || "0");
  const landscapeArea = parseArea(landscape.trim() || "0");
  if (wallArea === null || landscapeArea === null || floors.some(area => area === null || area <= 0)) return null;
  function lineCost(area: number, rate: number) {
    return Math.round(Math.round(area * 100) * Math.round(rate * 100) / 100);
  }
  const floorCosts = floors.map((area, index) => lineCost(area!, buildingRate(index === 0 ? rates[house] : rates.upper, finish)));
  const building = floorCosts.reduce((sum, floor) => sum + floor, 0);
  const boundary = lineCost(wallArea, rates.boundary);
  const landscaping = lineCost(landscapeArea, rates.landscaping);
  const subtotal = building + boundary + landscaping;
  const services = Math.round(subtotal * rates.servicesPercent / 100);
  const total = subtotal + services + rates.septic * 100;
  if (!Number.isSafeInteger(total)) return null;
  return { building, boundary, landscaping, services, total };
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 });
export function dollars(cents: number) { return usd.format(cents / 100); }
