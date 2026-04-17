// SupplyOR — Mock data riche
// Génère un univers complet : fournisseurs, composants, produits (BOM), commandes, jobs, stocks.

export type Supplier = {
  id: string;
  name: string;
  country: string;
  reliability: number; // 0-100
  leadTimeDays: number;
  category: string;
};

export type Component = {
  id: string;
  name: string;
  category: "Mécanique" | "Électronique" | "Châssis" | "Optique" | "Logiciel" | "Consommable";
  supplierId: string;
  unitCost: number;
  unit: string;
  stockMin: number;
  stockTarget: number;
  currentStock: number;
  pendingDeliveries: { date: string; quantity: number }[];
};

export type Product = {
  id: string;
  name: string;
  family: string;
  productionLine: string;
  bom: { componentId: string; quantity: number }[];
  cycleTimeHours: number;
  marginPct: number;
};

export type ProductionLine = {
  id: string;
  name: string;
  capacityHoursPerDay: number;
  efficiency: number;
};

export type OrderStatus = "draft" | "confirmed" | "in_production" | "ready" | "shipped" | "late";

export type Order = {
  id: string;
  customer: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  orderedAt: string; // ISO
  dueDate: string; // ISO
  status: OrderStatus;
  priority: "low" | "normal" | "high" | "critical";
};

export type Job = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  startDate: string;
  endDate: string;
  productionLine: string;
  progress: number; // 0-100
  status: "scheduled" | "running" | "blocked" | "done";
  blockedBy?: string[]; // component ids
};

// ----------- Données -----------
export const suppliers: Supplier[] = [
  { id: "SUP-01", name: "ArcelorTech", country: "🇫🇷 France", reliability: 96, leadTimeDays: 7, category: "Mécanique" },
  { id: "SUP-02", name: "Nordic Electronics", country: "🇩🇪 Allemagne", reliability: 92, leadTimeDays: 14, category: "Électronique" },
  { id: "SUP-03", name: "Shenzhen Optics", country: "🇨🇳 Chine", reliability: 84, leadTimeDays: 28, category: "Optique" },
  { id: "SUP-04", name: "Polymères Lyon", country: "🇫🇷 France", reliability: 98, leadTimeDays: 5, category: "Châssis" },
  { id: "SUP-05", name: "Iberian Cast", country: "🇪🇸 Espagne", reliability: 89, leadTimeDays: 10, category: "Mécanique" },
  { id: "SUP-06", name: "Tokyo Precision", country: "🇯🇵 Japon", reliability: 99, leadTimeDays: 21, category: "Électronique" },
  { id: "SUP-07", name: "MidWest Materials", country: "🇺🇸 USA", reliability: 87, leadTimeDays: 18, category: "Consommable" },
  { id: "SUP-08", name: "AlpenChimie", country: "🇨🇭 Suisse", reliability: 95, leadTimeDays: 8, category: "Consommable" },
];

const today = new Date("2026-04-17T00:00:00Z");
const addDays = (d: Date, days: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x.toISOString().slice(0, 10);
};

export const components: Component[] = [
  { id: "CMP-A1", name: "Châssis aluminium V2", category: "Châssis", supplierId: "SUP-01", unitCost: 42, unit: "u", stockMin: 50, stockTarget: 200, currentStock: 87, pendingDeliveries: [{ date: addDays(today, 4), quantity: 120 }] },
  { id: "CMP-A2", name: "Plaque acier 3mm", category: "Mécanique", supplierId: "SUP-05", unitCost: 18, unit: "u", stockMin: 100, stockTarget: 400, currentStock: 312, pendingDeliveries: [{ date: addDays(today, 2), quantity: 200 }] },
  { id: "CMP-B1", name: "Carte mère X7", category: "Électronique", supplierId: "SUP-02", unitCost: 145, unit: "u", stockMin: 30, stockTarget: 120, currentStock: 22, pendingDeliveries: [{ date: addDays(today, 9), quantity: 80 }] },
  { id: "CMP-B2", name: "Module Wi-Fi 6E", category: "Électronique", supplierId: "SUP-06", unitCost: 38, unit: "u", stockMin: 80, stockTarget: 300, currentStock: 156, pendingDeliveries: [{ date: addDays(today, 12), quantity: 200 }] },
  { id: "CMP-B3", name: "Capteur LIDAR mini", category: "Optique", supplierId: "SUP-03", unitCost: 220, unit: "u", stockMin: 20, stockTarget: 80, currentStock: 41, pendingDeliveries: [{ date: addDays(today, 18), quantity: 60 }] },
  { id: "CMP-C1", name: "Carter polymère renforcé", category: "Châssis", supplierId: "SUP-04", unitCost: 28, unit: "u", stockMin: 60, stockTarget: 240, currentStock: 198, pendingDeliveries: [{ date: addDays(today, 3), quantity: 100 }] },
  { id: "CMP-C2", name: "Joint silicone HT", category: "Consommable", supplierId: "SUP-08", unitCost: 4, unit: "u", stockMin: 200, stockTarget: 800, currentStock: 612, pendingDeliveries: [] },
  { id: "CMP-D1", name: "Lentille asphérique", category: "Optique", supplierId: "SUP-03", unitCost: 92, unit: "u", stockMin: 40, stockTarget: 160, currentStock: 28, pendingDeliveries: [{ date: addDays(today, 22), quantity: 100 }] },
  { id: "CMP-D2", name: "Vis inox M4 (lot 100)", category: "Consommable", supplierId: "SUP-07", unitCost: 12, unit: "lot", stockMin: 50, stockTarget: 200, currentStock: 174, pendingDeliveries: [] },
  { id: "CMP-E1", name: "Batterie Li-Ion 5Ah", category: "Électronique", supplierId: "SUP-06", unitCost: 78, unit: "u", stockMin: 40, stockTarget: 180, currentStock: 95, pendingDeliveries: [{ date: addDays(today, 11), quantity: 120 }] },
  { id: "CMP-E2", name: "Connecteur USB-C", category: "Électronique", supplierId: "SUP-02", unitCost: 6, unit: "u", stockMin: 150, stockTarget: 600, currentStock: 488, pendingDeliveries: [] },
  { id: "CMP-F1", name: "Écran OLED 5\"", category: "Optique", supplierId: "SUP-03", unitCost: 165, unit: "u", stockMin: 25, stockTarget: 100, currentStock: 14, pendingDeliveries: [{ date: addDays(today, 16), quantity: 80 }] },
];

export const productionLines: ProductionLine[] = [
  { id: "L-ASM1", name: "Ligne Assemblage A", capacityHoursPerDay: 16, efficiency: 0.92 },
  { id: "L-ASM2", name: "Ligne Assemblage B", capacityHoursPerDay: 16, efficiency: 0.88 },
  { id: "L-PRC1", name: "Ligne Précision", capacityHoursPerDay: 8, efficiency: 0.95 },
  { id: "L-PKG1", name: "Ligne Conditionnement", capacityHoursPerDay: 24, efficiency: 0.85 },
];

export const products: Product[] = [
  {
    id: "PRD-ATLAS", name: "Atlas-300", family: "Drones industriels", productionLine: "L-ASM1",
    bom: [
      { componentId: "CMP-A1", quantity: 1 }, { componentId: "CMP-B1", quantity: 1 },
      { componentId: "CMP-B2", quantity: 1 }, { componentId: "CMP-B3", quantity: 2 },
      { componentId: "CMP-E1", quantity: 2 }, { componentId: "CMP-D2", quantity: 4 },
    ], cycleTimeHours: 4.5, marginPct: 32,
  },
  {
    id: "PRD-NOVA", name: "Nova-Vision", family: "Caméras intelligentes", productionLine: "L-PRC1",
    bom: [
      { componentId: "CMP-C1", quantity: 1 }, { componentId: "CMP-D1", quantity: 1 },
      { componentId: "CMP-F1", quantity: 1 }, { componentId: "CMP-B1", quantity: 1 },
      { componentId: "CMP-C2", quantity: 3 }, { componentId: "CMP-E2", quantity: 2 },
    ], cycleTimeHours: 2.8, marginPct: 41,
  },
  {
    id: "PRD-FORGE", name: "Forge-X", family: "Robots industriels", productionLine: "L-ASM2",
    bom: [
      { componentId: "CMP-A1", quantity: 2 }, { componentId: "CMP-A2", quantity: 4 },
      { componentId: "CMP-B1", quantity: 1 }, { componentId: "CMP-E1", quantity: 1 },
      { componentId: "CMP-D2", quantity: 8 },
    ], cycleTimeHours: 6.2, marginPct: 28,
  },
  {
    id: "PRD-ECHO", name: "Echo-Sense", family: "Capteurs IoT", productionLine: "L-ASM1",
    bom: [
      { componentId: "CMP-C1", quantity: 1 }, { componentId: "CMP-B2", quantity: 1 },
      { componentId: "CMP-E2", quantity: 1 }, { componentId: "CMP-C2", quantity: 2 },
    ], cycleTimeHours: 1.4, marginPct: 48,
  },
  {
    id: "PRD-PULSE", name: "Pulse-Med", family: "Médical", productionLine: "L-PRC1",
    bom: [
      { componentId: "CMP-C1", quantity: 1 }, { componentId: "CMP-F1", quantity: 1 },
      { componentId: "CMP-B1", quantity: 1 }, { componentId: "CMP-E1", quantity: 1 },
    ], cycleTimeHours: 3.6, marginPct: 52,
  },
  {
    id: "PRD-TITAN", name: "Titan-Cargo", family: "Robots industriels", productionLine: "L-ASM2",
    bom: [
      { componentId: "CMP-A1", quantity: 3 }, { componentId: "CMP-A2", quantity: 6 },
      { componentId: "CMP-B1", quantity: 2 }, { componentId: "CMP-B3", quantity: 1 },
      { componentId: "CMP-E1", quantity: 4 }, { componentId: "CMP-D2", quantity: 12 },
    ], cycleTimeHours: 9.5, marginPct: 24,
  },
];

const customers = [
  "Airbus Defense", "Renault Group", "Schneider Electric", "Thales", "EDF Industrie",
  "Stellantis", "Saint-Gobain", "L'Oréal Tech", "Dassault", "Total Energies",
];

const statuses: OrderStatus[] = ["confirmed", "in_production", "ready", "late", "draft"];
const priorities: Order["priority"][] = ["normal", "high", "critical", "low"];

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const r = rand(42);

export const orders: Order[] = Array.from({ length: 32 }).map((_, i) => {
  const product = products[Math.floor(r() * products.length)];
  const orderedDaysAgo = Math.floor(r() * 30) + 1;
  const dueIn = Math.floor(r() * 45) - 5;
  return {
    id: `ORD-${String(2026000 + i).padStart(7, "0")}`,
    customer: customers[Math.floor(r() * customers.length)],
    productId: product.id,
    quantity: Math.floor(r() * 80) + 5,
    unitPrice: Math.floor(r() * 8000) + 1500,
    orderedAt: addDays(today, -orderedDaysAgo),
    dueDate: addDays(today, dueIn),
    status: dueIn < 0 ? "late" : statuses[Math.floor(r() * statuses.length)],
    priority: priorities[Math.floor(r() * priorities.length)],
  };
});

export const jobs: Job[] = orders
  .filter((o) => o.status !== "draft")
  .slice(0, 18)
  .map((o, i) => {
    const product = products.find((p) => p.id === o.productId)!;
    const startOffset = Math.floor(r() * 25) - 5;
    const duration = Math.ceil((product.cycleTimeHours * o.quantity) / 16);
    const progress = o.status === "ready" ? 100 : o.status === "in_production" ? Math.floor(r() * 80) + 10 : 0;
    return {
      id: `JOB-${String(i + 1).padStart(4, "0")}`,
      orderId: o.id,
      productId: o.productId,
      quantity: o.quantity,
      startDate: addDays(today, startOffset),
      endDate: addDays(today, startOffset + duration),
      productionLine: product.productionLine,
      progress,
      status: progress === 100 ? "done" : progress > 0 ? "running" : r() > 0.85 ? "blocked" : "scheduled",
      blockedBy: r() > 0.8 ? [product.bom[0].componentId] : undefined,
    };
  });

// Génère l'historique de stock sur 30 jours passés + projection 30 jours futurs
export function generateStockHistory(componentId: string) {
  const cmp = components.find((c) => c.id === componentId);
  if (!cmp) return [];
  const points: { date: string; stock: number; min: number; target: number; type: "history" | "projection" }[] = [];
  let stock = cmp.currentStock + Math.floor(r() * 80);
  for (let d = -30; d <= 30; d++) {
    const consumption = Math.floor(r() * 12) + 3;
    const delivery = cmp.pendingDeliveries.find((p) => p.date === addDays(today, d))?.quantity ?? 0;
    if (d <= 0) {
      stock = Math.max(0, stock - consumption + (d % 7 === 0 ? Math.floor(r() * 60) : 0));
    } else {
      stock = Math.max(0, stock - consumption + delivery);
    }
    points.push({
      date: addDays(today, d),
      stock,
      min: cmp.stockMin,
      target: cmp.stockTarget,
      type: d <= 0 ? "history" : "projection",
    });
  }
  return points;
}

export const helpers = {
  getSupplier: (id: string) => suppliers.find((s) => s.id === id),
  getComponent: (id: string) => components.find((c) => c.id === id),
  getProduct: (id: string) => products.find((p) => p.id === id),
  getLine: (id: string) => productionLines.find((l) => l.id === id),
};
