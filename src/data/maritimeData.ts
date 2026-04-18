// MaritimeOps — Mock data for global container shipping OR demonstrator

export type Port = {
  id: string;
  name: string;
  country: string;
  code: string; // UN/LOCODE
  coords: [number, number]; // [lng, lat]
  throughput: number; // TEU/year (millions)
  congestion: number; // 0-100
  riskScore: number; // 0-100
  region: "Asia" | "Europe" | "N.America" | "S.America" | "Africa" | "Oceania" | "Middle-East";
};

export type Vessel = {
  id: string;
  name: string;
  imo: string;
  type: "ULCV" | "Neo-Panamax" | "Panamax" | "Feeder";
  capacityTEU: number;
  speed: number; // knots
  fuelTPD: number; // tons per day
  status: "At Sea" | "In Port" | "Anchored" | "Maintenance";
  currentPort?: string;
  utilization: number; // 0-100
  flag: string;
  routeId?: string;
  position?: [number, number];
};

export type Route = {
  id: string;
  name: string;
  ports: string[]; // port ids in order
  distanceNm: number;
  durationDays: number;
  riskScore: number;
  congestionScore: number;
  weatherRisk: number;
  geoRisk: number;
  piracyRisk: number;
  type: "Trans-Pacific" | "Asia-Europe" | "Trans-Atlantic" | "Intra-Asia" | "Polar" | "S.America";
};

export type ContainerFlow = {
  from: string; // port id
  to: string;
  full: number; // TEU
  empty: number;
  imbalance: number; // negative = surplus
};

export type RiskZone = {
  id: string;
  name: string;
  type: "Geopolitical" | "Weather" | "Piracy" | "Congestion" | "Sanctions";
  severity: "low" | "med" | "high" | "critical";
  coords: [number, number];
  radius: number; // in degrees
  description: string;
  trend: "rising" | "stable" | "falling";
};

export type StowageContainer = {
  id: string;
  bay: number; // 1-20
  row: number; // -5 to 5
  tier: number; // 1-8
  weight: number; // tons
  destination: string;
  category: "export" | "import" | "empty" | "hazard" | "reefer" | "priority";
  pol: string;
  pod: string;
};

// ============= PORTS (top global hubs) =============
export const ports: Port[] = [
  { id: "CNSHA", name: "Shanghai", country: "China", code: "CNSHA", coords: [121.5, 31.2], throughput: 47.3, congestion: 72, riskScore: 28, region: "Asia" },
  { id: "SGSIN", name: "Singapore", country: "Singapore", code: "SGSIN", coords: [103.8, 1.35], throughput: 37.2, congestion: 58, riskScore: 12, region: "Asia" },
  { id: "CNNGB", name: "Ningbo-Zhoushan", country: "China", code: "CNNGB", coords: [121.55, 29.87], throughput: 33.4, congestion: 65, riskScore: 26, region: "Asia" },
  { id: "CNSZX", name: "Shenzhen", country: "China", code: "CNSZX", coords: [113.92, 22.55], throughput: 30.0, congestion: 60, riskScore: 24, region: "Asia" },
  { id: "KRPUS", name: "Busan", country: "South Korea", code: "KRPUS", coords: [129.04, 35.1], throughput: 22.7, congestion: 45, riskScore: 35, region: "Asia" },
  { id: "HKHKG", name: "Hong Kong", country: "China", code: "HKHKG", coords: [114.16, 22.3], throughput: 17.8, congestion: 50, riskScore: 30, region: "Asia" },
  { id: "AEJEA", name: "Jebel Ali", country: "UAE", code: "AEJEA", coords: [55.05, 25.0], throughput: 14.0, congestion: 40, riskScore: 55, region: "Middle-East" },
  { id: "NLRTM", name: "Rotterdam", country: "Netherlands", code: "NLRTM", coords: [4.42, 51.95], throughput: 14.5, congestion: 55, riskScore: 18, region: "Europe" },
  { id: "DEHAM", name: "Hamburg", country: "Germany", code: "DEHAM", coords: [9.99, 53.55], throughput: 8.7, congestion: 48, riskScore: 16, region: "Europe" },
  { id: "BEANR", name: "Antwerp", country: "Belgium", code: "BEANR", coords: [4.4, 51.22], throughput: 12.0, congestion: 52, riskScore: 17, region: "Europe" },
  { id: "ESVLC", name: "Valencia", country: "Spain", code: "ESVLC", coords: [-0.32, 39.45], throughput: 5.6, congestion: 38, riskScore: 20, region: "Europe" },
  { id: "USLAX", name: "Los Angeles", country: "USA", code: "USLAX", coords: [-118.27, 33.74], throughput: 9.9, congestion: 68, riskScore: 22, region: "N.America" },
  { id: "USLGB", name: "Long Beach", country: "USA", code: "USLGB", coords: [-118.22, 33.76], throughput: 9.1, congestion: 70, riskScore: 22, region: "N.America" },
  { id: "USNYC", name: "New York/NJ", country: "USA", code: "USNYC", coords: [-74.04, 40.67], throughput: 9.5, congestion: 50, riskScore: 18, region: "N.America" },
  { id: "PAPTY", name: "Panama (Balboa)", country: "Panama", code: "PAPTY", coords: [-79.57, 8.95], throughput: 4.2, congestion: 75, riskScore: 40, region: "S.America" },
  { id: "EGSUZ", name: "Suez", country: "Egypt", code: "EGSUZ", coords: [32.55, 29.97], throughput: 5.8, congestion: 62, riskScore: 78, region: "Middle-East" },
  { id: "ZAJNB", name: "Durban", country: "South Africa", code: "ZAJNB", coords: [31.04, -29.87], throughput: 2.6, congestion: 55, riskScore: 45, region: "Africa" },
  { id: "BRSSZ", name: "Santos", country: "Brazil", code: "BRSSZ", coords: [-46.33, -23.95], throughput: 4.5, congestion: 48, riskScore: 32, region: "S.America" },
  { id: "AUSYD", name: "Sydney (Botany)", country: "Australia", code: "AUSYD", coords: [151.22, -33.97], throughput: 2.7, congestion: 35, riskScore: 12, region: "Oceania" },
  { id: "INNSA", name: "Nhava Sheva", country: "India", code: "INNSA", coords: [72.95, 18.95], throughput: 5.6, congestion: 58, riskScore: 38, region: "Asia" },
];

// ============= ROUTES =============
export const routes: Route[] = [
  { id: "R-AE1", name: "AE1 Asia↔Europe (Suez)", ports: ["CNSHA", "CNNGB", "SGSIN", "EGSUZ", "NLRTM", "DEHAM"], distanceNm: 11900, durationDays: 38, riskScore: 72, congestionScore: 65, weatherRisk: 35, geoRisk: 88, piracyRisk: 55, type: "Asia-Europe" },
  { id: "R-AE2", name: "AE2 Asia↔Europe (Cape)", ports: ["SGSIN", "ZAJNB", "ESVLC", "NLRTM"], distanceNm: 14200, durationDays: 46, riskScore: 38, congestionScore: 30, weatherRisk: 50, geoRisk: 18, piracyRisk: 35, type: "Asia-Europe" },
  { id: "R-TP1", name: "TP1 Trans-Pacific East", ports: ["CNSHA", "KRPUS", "USLAX", "USLGB"], distanceNm: 6400, durationDays: 18, riskScore: 32, congestionScore: 68, weatherRisk: 42, geoRisk: 22, piracyRisk: 5, type: "Trans-Pacific" },
  { id: "R-TP2", name: "TP2 Trans-Pacific NE", ports: ["CNNGB", "USNYC"], distanceNm: 10800, durationDays: 32, riskScore: 45, congestionScore: 50, weatherRisk: 55, geoRisk: 20, piracyRisk: 10, type: "Trans-Pacific" },
  { id: "R-TA1", name: "TA1 Trans-Atlantic", ports: ["NLRTM", "USNYC"], distanceNm: 3300, durationDays: 9, riskScore: 22, congestionScore: 35, weatherRisk: 40, geoRisk: 8, piracyRisk: 0, type: "Trans-Atlantic" },
  { id: "R-IA1", name: "IA1 Intra-Asia", ports: ["CNSHA", "HKHKG", "SGSIN"], distanceNm: 2400, durationDays: 7, riskScore: 18, congestionScore: 55, weatherRisk: 30, geoRisk: 25, piracyRisk: 12, type: "Intra-Asia" },
  { id: "R-SA1", name: "SA1 South America East", ports: ["BRSSZ", "ESVLC", "NLRTM"], distanceNm: 5500, durationDays: 16, riskScore: 28, congestionScore: 30, weatherRisk: 38, geoRisk: 15, piracyRisk: 10, type: "S.America" },
  { id: "R-PL1", name: "PL1 Polar (NSR)", ports: ["KRPUS", "NLRTM"], distanceNm: 7400, durationDays: 22, riskScore: 68, congestionScore: 8, weatherRisk: 92, geoRisk: 60, piracyRisk: 0, type: "Polar" },
];

// ============= VESSELS =============
const vesselNames = [
  "MSC Gülsün", "Ever Ace", "HMM Algeciras", "OOCL Hong Kong", "Cosco Universe",
  "Madrid Maersk", "CMA CGM Jacques Saadé", "MSC Isabella", "Ever Globe", "ONE Innovation",
  "Maersk Hangzhou", "Yang Ming Wisdom", "Hapag Berlin", "ZIM Mount Everest", "Evergreen Triton",
  "MSC Loreto", "OOCL Spain", "Cosco Pisces", "CMA CGM Antoine", "Maersk Sentosa",
];

export const vessels: Vessel[] = vesselNames.map((name, i) => {
  const types: Vessel["type"][] = ["ULCV", "Neo-Panamax", "Panamax", "Feeder"];
  const statuses: Vessel["status"][] = ["At Sea", "At Sea", "At Sea", "In Port", "Anchored", "Maintenance"];
  const flags = ["Liberia", "Marshall Is.", "Panama", "HK", "Singapore", "Malta", "Denmark"];
  const type = types[i % 4];
  const cap = type === "ULCV" ? 22000 + (i * 137) % 2000 : type === "Neo-Panamax" ? 14000 : type === "Panamax" ? 9000 : 4500;
  const status = statuses[i % statuses.length];
  const route = routes[i % routes.length];
  // approx position interpolated between two route ports
  const p1 = ports.find((p) => p.id === route.ports[0])!;
  const p2 = ports.find((p) => p.id === route.ports[Math.min(1, route.ports.length - 1)])!;
  const t = (i * 0.137) % 1;
  return {
    id: `V-${1000 + i}`,
    name,
    imo: `IMO ${9700000 + i * 1373}`,
    type,
    capacityTEU: cap,
    speed: 14 + ((i * 7) % 10),
    fuelTPD: 80 + ((i * 13) % 90),
    status,
    currentPort: status !== "At Sea" ? route.ports[i % route.ports.length] : undefined,
    utilization: 60 + ((i * 19) % 38),
    flag: flags[i % flags.length],
    routeId: route.id,
    position: status === "At Sea" ? [p1.coords[0] + (p2.coords[0] - p1.coords[0]) * t, p1.coords[1] + (p2.coords[1] - p1.coords[1]) * t] : undefined,
  };
});

// ============= CONTAINER FLOWS =============
export const containerFlows: ContainerFlow[] = [
  { from: "CNSHA", to: "USLAX", full: 1850, empty: 120, imbalance: -1730 },
  { from: "CNSHA", to: "NLRTM", full: 1420, empty: 80, imbalance: -1340 },
  { from: "USLAX", to: "CNSHA", full: 380, empty: 1450, imbalance: 1070 },
  { from: "NLRTM", to: "CNSHA", full: 290, empty: 980, imbalance: 690 },
  { from: "SGSIN", to: "NLRTM", full: 1100, empty: 90, imbalance: -1010 },
  { from: "NLRTM", to: "USNYC", full: 720, empty: 220, imbalance: -500 },
  { from: "USNYC", to: "NLRTM", full: 410, empty: 580, imbalance: 170 },
  { from: "KRPUS", to: "USLGB", full: 980, empty: 110, imbalance: -870 },
  { from: "AEJEA", to: "NLRTM", full: 540, empty: 180, imbalance: -360 },
  { from: "INNSA", to: "NLRTM", full: 620, empty: 95, imbalance: -525 },
];

// ============= RISK ZONES =============
export const riskZones: RiskZone[] = [
  { id: "RZ-1", name: "Red Sea Crisis", type: "Geopolitical", severity: "critical", coords: [40, 18], radius: 8, description: "Houthi attacks; insurance +480%", trend: "rising" },
  { id: "RZ-2", name: "Strait of Hormuz", type: "Geopolitical", severity: "high", coords: [56, 26.5], radius: 4, description: "Iran tensions, GPS jamming", trend: "stable" },
  { id: "RZ-3", name: "Gulf of Aden", type: "Piracy", severity: "high", coords: [48, 13], radius: 6, description: "Piracy resurgence Q3", trend: "rising" },
  { id: "RZ-4", name: "Singapore Strait", type: "Piracy", severity: "med", coords: [104, 1.2], radius: 3, description: "Petty boardings (+34% YoY)", trend: "rising" },
  { id: "RZ-5", name: "N. Pacific Storm Belt", type: "Weather", severity: "med", coords: [-160, 40], radius: 18, description: "Typhoon corridor active", trend: "stable" },
  { id: "RZ-6", name: "Panama Drought", type: "Congestion", severity: "high", coords: [-79.5, 9], radius: 4, description: "Canal draft restrictions, 36 ships waiting", trend: "stable" },
  { id: "RZ-7", name: "Black Sea", type: "Sanctions", severity: "critical", coords: [33, 44], radius: 6, description: "War risk, port closures", trend: "stable" },
  { id: "RZ-8", name: "Cape of Good Hope", type: "Weather", severity: "med", coords: [19, -35], radius: 5, description: "Southern swell, +15% transit time", trend: "falling" },
  { id: "RZ-9", name: "LA/LB Anchorage", type: "Congestion", severity: "med", coords: [-118.4, 33.6], radius: 2, description: "Berth wait avg 4.2d", trend: "falling" },
  { id: "RZ-10", name: "Arctic Ice Edge", type: "Weather", severity: "high", coords: [80, 78], radius: 12, description: "NSR navigability window closing", trend: "rising" },
];

// ============= STOWAGE (mock vessel bay layout) =============
export function generateStowage(vesselId: string, count = 240): StowageContainer[] {
  const cats: StowageContainer["category"][] = ["export", "export", "export", "import", "empty", "hazard", "reefer", "priority"];
  const dests = ["USLAX", "NLRTM", "USNYC", "DEHAM", "AEJEA", "BRSSZ"];
  const arr: StowageContainer[] = [];
  let id = 0;
  for (let bay = 1; bay <= 20; bay++) {
    for (let row = -5; row <= 5; row++) {
      for (let tier = 1; tier <= 6; tier++) {
        // sparse fill
        if ((bay * 7 + row * 3 + tier * 13 + id) % 5 === 0) continue;
        if (arr.length >= count) break;
        const cat = cats[(bay + row + tier + id) % cats.length];
        arr.push({
          id: `${vesselId}-C${id.toString().padStart(4, "0")}`,
          bay, row, tier,
          weight: 8 + ((bay * row + tier) * 1.7) % 22,
          destination: dests[(bay + tier) % dests.length],
          category: cat,
          pol: "CNSHA",
          pod: dests[(bay + tier) % dests.length],
        });
        id++;
      }
    }
  }
  return arr;
}

// ============= KPIs =============
export const globalKpis = {
  fleetUtilization: 78.4,
  fleetUtilizationDelta: 2.3,
  activeVessels: vessels.filter((v) => v.status === "At Sea").length,
  totalTEU: vessels.reduce((s, v) => s + v.capacityTEU, 0),
  inTransitTEU: Math.round(vessels.filter((v) => v.status === "At Sea").reduce((s, v) => s + v.capacityTEU * v.utilization / 100, 0)),
  avgTransitDays: 21.4,
  onTimeArrival: 84.2,
  onTimeArrivalDelta: -1.8,
  avgFuelCost: 612, // USD/T
  carbonIntensity: 7.8, // g CO2/TEU·nm
  riskExposure: 42.6,
  riskExposureDelta: 5.4,
  congestionIndex: 58.2,
  totalRevenueDay: 4.82, // M$/day
};

// ============= ALERTS =============
export type Alert = {
  id: string;
  ts: string;
  severity: "info" | "warning" | "critical";
  title: string;
  detail: string;
  module: string;
};
export const alerts: Alert[] = [
  { id: "A1", ts: "2m ago", severity: "critical", title: "Red Sea risk escalation", detail: "3 vessels rerouting via Cape (+12d)", module: "Risk" },
  { id: "A2", ts: "8m ago", severity: "warning", title: "Panama wait time +18%", detail: "Recommend slot booking 7 days ahead", module: "Network" },
  { id: "A3", ts: "21m ago", severity: "info", title: "Optim: TP1 saved 4.2% fuel", detail: "Speed reduced 18→15 kn on Pacific leg", module: "Optim" },
  { id: "A4", ts: "44m ago", severity: "warning", title: "Empty container imbalance USLAX", detail: "+1,450 TEU surplus, repositioning suggested", module: "Container" },
  { id: "A5", ts: "1h ago", severity: "critical", title: "Stowage conflict V-1003", detail: "2 reefer slots without power on bay 14", module: "Stowage" },
  { id: "A6", ts: "2h ago", severity: "info", title: "Weather window opening N.Atlantic", detail: "TA1 may speed up by 0.8 kn", module: "Risk" },
];

// Scenarios
export const scenarios = [
  { id: "baseline", name: "Baseline (live)", desc: "Current operational plan" },
  { id: "optim-cost", name: "Cost-Optimal", desc: "Min total $ cost" },
  { id: "optim-time", name: "Time-Optimal", desc: "Min transit days" },
  { id: "optim-risk", name: "Risk-Adjusted", desc: "Avoid high-risk corridors" },
  { id: "what-if-suez", name: "What-if: Suez closure", desc: "100% reroute via Cape" },
];
