import { useState } from "react";
import { Panel } from "@/components/shared/Panel";
import { KpiCard } from "@/components/shared/KpiCard";
import { WorldMap } from "@/components/maritime/WorldMap";
import { Ship, Container, Clock, AlertTriangle, TrendingUp, Anchor, DollarSign, Gauge } from "lucide-react";
import { globalKpis, alerts, ports, riskZones, vessels } from "@/data/maritimeData";
import { Switch } from "@/components/ui/switch";

export default function GlobalNetwork() {
  const [layers, setLayers] = useState({ routes: true, risk: true, weather: true, piracy: true, vessels: true });
  const [selectedPort, setSelectedPort] = useState<string | null>(null);

  const port = selectedPort ? ports.find((p) => p.id === selectedPort) : null;

  return (
    <div className="p-4 space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <KpiCard label="Fleet Util" value={globalKpis.fleetUtilization.toFixed(1)} unit="%" delta={globalKpis.fleetUtilizationDelta} icon={Gauge} tone="primary" sparkline={[68,71,74,73,76,77,78]} />
        <KpiCard label="Vessels At Sea" value={globalKpis.activeVessels} icon={Ship} tone="primary" sparkline={[12,13,14,12,15,14,15]} />
        <KpiCard label="In-Transit TEU" value={(globalKpis.inTransitTEU/1000).toFixed(1)} unit="k" icon={Container} tone="default" />
        <KpiCard label="On-Time Arr." value={globalKpis.onTimeArrival.toFixed(1)} unit="%" delta={globalKpis.onTimeArrivalDelta} icon={Clock} tone="success" />
        <KpiCard label="Risk Exposure" value={globalKpis.riskExposure.toFixed(1)} delta={globalKpis.riskExposureDelta} icon={AlertTriangle} tone="warning" sparkline={[35,38,40,42,41,43,42]} />
        <KpiCard label="Bunker $" value={globalKpis.avgFuelCost} unit="$/T" icon={DollarSign} tone="default" />
        <KpiCard label="Revenue" value={globalKpis.totalRevenueDay} unit="M$/d" delta={3.2} icon={TrendingUp} tone="success" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Map */}
        <div className="col-span-12 lg:col-span-9">
          <Panel
            title="Global Network · Live"
            subtitle="Ports · routes · risk overlays · vessels (AIS)"
            actions={
              <div className="flex items-center gap-3 text-[10px] font-mono">
                {Object.entries(layers).map(([k, v]) => (
                  <label key={k} className="flex items-center gap-1.5 cursor-pointer">
                    <Switch checked={v} onCheckedChange={(c) => setLayers((l) => ({ ...l, [k]: c }))} className="scale-75" />
                    <span className="uppercase tracking-wider text-muted-foreground">{k}</span>
                  </label>
                ))}
              </div>
            }
          >
            <div className="h-[560px]">
              <WorldMap
                showRoutes={layers.routes} showRisk={layers.risk}
                showWeather={layers.weather} showPiracy={layers.piracy}
                showVessels={layers.vessels} highlightedPort={selectedPort}
                onPortClick={setSelectedPort}
              />
            </div>
            {/* Legend */}
            <div className="mt-3 flex flex-wrap gap-4 text-[10px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-primary" /> Route normal</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-warning" /> Risk medium</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-destructive" /> Risk high</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success" /> Port low cong.</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning" /> Port congested</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-destructive" /> Port critical</span>
            </div>
          </Panel>
        </div>

        {/* Right insights */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Panel title="Active Risk Zones" subtitle={`${riskZones.length} monitored`}>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {riskZones.map((z) => (
                <div key={z.id} className="p-2 rounded bg-muted/30 border border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono font-semibold text-foreground truncate">{z.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{z.description}</div>
                    </div>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase shrink-0 ${
                      z.severity === "critical" ? "bg-destructive/20 text-destructive" :
                      z.severity === "high" ? "bg-risk-high/20 text-risk-high" :
                      z.severity === "med" ? "bg-warning/20 text-warning" : "bg-success/20 text-success"
                    }`}>{z.severity}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-[9px] font-mono text-muted-foreground">
                    <span>{z.type}</span>
                    <span className={z.trend === "rising" ? "text-destructive" : z.trend === "falling" ? "text-success" : "text-muted-foreground"}>
                      {z.trend === "rising" ? "↑" : z.trend === "falling" ? "↓" : "→"} {z.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Live Alerts" subtitle="OR-Engine">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {alerts.map((a) => (
                <div key={a.id} className="p-2 rounded bg-muted/30 border-l-2 border-l-transparent hover:bg-muted/50 transition-colors"
                  style={{ borderLeftColor: a.severity === "critical" ? "hsl(var(--destructive))" : a.severity === "warning" ? "hsl(var(--warning))" : "hsl(var(--info))" }}>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: a.severity === "critical" ? "hsl(var(--destructive))" : a.severity === "warning" ? "hsl(var(--warning))" : "hsl(var(--info))" }}>
                      {a.severity} · {a.module}
                    </div>
                    <span className="text-[9px] font-mono text-muted-foreground">{a.ts}</span>
                  </div>
                  <div className="text-xs font-semibold text-foreground mt-0.5">{a.title}</div>
                  <div className="text-[10px] text-muted-foreground">{a.detail}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Port details */}
      {port && (
        <Panel title={`Port · ${port.name} (${port.code})`} subtitle={`${port.country} · ${port.region}`}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase text-muted-foreground">Throughput</div>
              <div className="text-xl font-mono font-bold text-primary">{port.throughput}<span className="text-xs text-muted-foreground"> M TEU/y</span></div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-muted-foreground">Congestion</div>
              <div className="text-xl font-mono font-bold" style={{ color: port.congestion > 65 ? "hsl(var(--destructive))" : port.congestion > 45 ? "hsl(var(--warning))" : "hsl(var(--success))" }}>{port.congestion}%</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-muted-foreground">Risk Score</div>
              <div className="text-xl font-mono font-bold text-foreground">{port.riskScore}<span className="text-xs text-muted-foreground">/100</span></div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-muted-foreground">Vessels Now</div>
              <div className="text-xl font-mono font-bold text-foreground">{vessels.filter((v) => v.currentPort === port.id).length}</div>
            </div>
            <div className="flex items-end">
              <button onClick={() => setSelectedPort(null)} className="text-[10px] font-mono uppercase text-muted-foreground hover:text-foreground">close ✕</button>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
