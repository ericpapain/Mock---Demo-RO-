import { Panel } from "@/components/shared/Panel";
import { KpiCard } from "@/components/shared/KpiCard";
import { containerFlows, ports } from "@/data/maritimeData";
import { Container, ArrowLeftRight, AlertTriangle, DollarSign } from "lucide-react";
import { useMemo, useState } from "react";

export default function ContainerFlow() {
  const [hover, setHover] = useState<number | null>(null);

  const totalFull = containerFlows.reduce((s, f) => s + f.full, 0);
  const totalEmpty = containerFlows.reduce((s, f) => s + f.empty, 0);
  const imbalanceTotal = Math.abs(containerFlows.reduce((s, f) => s + f.imbalance, 0));

  // Sankey-like layout: lefts = origins, rights = destinations
  const sankey = useMemo(() => {
    const origins = Array.from(new Set(containerFlows.map((f) => f.from)));
    const dests = Array.from(new Set(containerFlows.map((f) => f.to)));
    const W = 900, H = 460, pad = 30;
    const colW = 110;

    const oTotals = origins.map((id) => containerFlows.filter((f) => f.from === id).reduce((s, f) => s + f.full + f.empty, 0));
    const dTotals = dests.map((id) => containerFlows.filter((f) => f.to === id).reduce((s, f) => s + f.full + f.empty, 0));
    const oMax = Math.max(...oTotals);
    const dMax = Math.max(...dTotals);

    const oNodes = origins.map((id, i) => {
      const h = 30 + (oTotals[i] / oMax) * 70;
      return { id, x: pad, y: pad + i * ((H - 2 * pad) / origins.length), h, total: oTotals[i] };
    });
    const dNodes = dests.map((id, i) => {
      const h = 30 + (dTotals[i] / dMax) * 70;
      return { id, x: W - pad - colW, y: pad + i * ((H - 2 * pad) / dests.length), h, total: dTotals[i] };
    });

    return { oNodes, dNodes, W, H, colW };
  }, []);

  const portName = (id: string) => ports.find((p) => p.id === id)?.code || id;

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Full TEU/wk" value={totalFull.toLocaleString()} icon={Container} tone="primary" />
        <KpiCard label="Empty TEU/wk" value={totalEmpty.toLocaleString()} icon={Container} tone="warning" />
        <KpiCard label="Imbalance" value={imbalanceTotal.toLocaleString()} unit="TEU" delta={8.2} icon={ArrowLeftRight} tone="destructive" />
        <KpiCard label="Reposition $" value="2.84" unit="M$/wk" icon={DollarSign} tone="warning" />
      </div>

      <Panel title="Container Flows · Origin → Destination" subtitle="Width = volume · Color: cyan=full · amber=empty">
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${sankey.W} ${sankey.H}`} className="w-full h-[480px]">
            {/* Flows */}
            {containerFlows.map((f, i) => {
              const o = sankey.oNodes.find((n) => n.id === f.from)!;
              const d = sankey.dNodes.find((n) => n.id === f.to)!;
              const x1 = o.x + sankey.colW;
              const x2 = d.x;
              const y1 = o.y + o.h / 2;
              const y2 = d.y + d.h / 2;
              const cx = (x1 + x2) / 2;
              const wFull = Math.max(2, Math.sqrt(f.full) / 1.4);
              const wEmpty = Math.max(1, Math.sqrt(f.empty) / 1.4);
              const isHover = hover === i;
              return (
                <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
                  {/* Full */}
                  <path d={`M ${x1} ${y1 - wFull/2} C ${cx} ${y1 - wFull/2}, ${cx} ${y2 - wFull/2}, ${x2} ${y2 - wFull/2} L ${x2} ${y2 + wFull/2} C ${cx} ${y2 + wFull/2}, ${cx} ${y1 + wFull/2}, ${x1} ${y1 + wFull/2} Z`}
                    fill="hsl(var(--primary))" fillOpacity={isHover ? 0.55 : 0.25} />
                  {/* Empty stacked */}
                  <path d={`M ${x1} ${y1 + wFull/2} C ${cx} ${y1 + wFull/2}, ${cx} ${y2 + wFull/2}, ${x2} ${y2 + wFull/2} L ${x2} ${y2 + wFull/2 + wEmpty} C ${cx} ${y2 + wFull/2 + wEmpty}, ${cx} ${y1 + wFull/2 + wEmpty}, ${x1} ${y1 + wFull/2 + wEmpty} Z`}
                    fill="hsl(var(--accent))" fillOpacity={isHover ? 0.55 : 0.2} />
                </g>
              );
            })}

            {/* Origin nodes */}
            {sankey.oNodes.map((n) => (
              <g key={n.id}>
                <rect x={n.x} y={n.y} width={sankey.colW} height={n.h} rx={4} fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth={1} />
                <text x={n.x + 8} y={n.y + 16} fontSize={11} fontFamily="JetBrains Mono" fill="hsl(var(--foreground))">{portName(n.id)}</text>
                <text x={n.x + 8} y={n.y + 30} fontSize={9} fontFamily="JetBrains Mono" fill="hsl(var(--muted-foreground))">{n.total.toLocaleString()} TEU</text>
              </g>
            ))}
            {/* Dest nodes */}
            {sankey.dNodes.map((n) => (
              <g key={n.id}>
                <rect x={n.x} y={n.y} width={sankey.colW} height={n.h} rx={4} fill="hsl(var(--card))" stroke="hsl(var(--accent))" strokeWidth={1} />
                <text x={n.x + 8} y={n.y + 16} fontSize={11} fontFamily="JetBrains Mono" fill="hsl(var(--foreground))">{portName(n.id)}</text>
                <text x={n.x + 8} y={n.y + 30} fontSize={9} fontFamily="JetBrains Mono" fill="hsl(var(--muted-foreground))">{n.total.toLocaleString()} TEU</text>
              </g>
            ))}
          </svg>
        </div>
        {hover !== null && (
          <div className="mt-3 p-3 rounded bg-muted/30 border border-primary/30 text-xs font-mono">
            <span className="text-primary font-bold">{portName(containerFlows[hover].from)} → {portName(containerFlows[hover].to)}</span>
            {" · "}Full: <span className="text-primary">{containerFlows[hover].full.toLocaleString()}</span>
            {" · "}Empty: <span className="text-accent">{containerFlows[hover].empty.toLocaleString()}</span>
            {" · "}Imbalance: <span className={containerFlows[hover].imbalance < 0 ? "text-destructive" : "text-warning"}>
              {containerFlows[hover].imbalance > 0 ? "+" : ""}{containerFlows[hover].imbalance.toLocaleString()} TEU
            </span>
          </div>
        )}
      </Panel>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7">
          <Panel title="Demand vs Supply Imbalance · By Region">
            <div className="space-y-2">
              {Array.from(new Set(ports.map((p) => p.region))).map((reg) => {
                const inflow = containerFlows.filter((f) => ports.find((p) => p.id === f.to)?.region === reg).reduce((s, f) => s + f.full, 0);
                const outflow = containerFlows.filter((f) => ports.find((p) => p.id === f.from)?.region === reg).reduce((s, f) => s + f.full, 0);
                const max = Math.max(inflow, outflow, 1);
                const imb = inflow - outflow;
                return (
                  <div key={reg} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-foreground">{reg}</span>
                      <span className={imb < 0 ? "text-destructive" : "text-success"}>{imb > 0 ? "+" : ""}{imb.toLocaleString()} TEU</span>
                    </div>
                    <div className="flex gap-1 h-5">
                      <div className="flex-1 bg-muted/30 rounded relative overflow-hidden">
                        <div className="absolute inset-y-0 right-0 bg-primary/60" style={{ width: `${(outflow / max) * 100}%` }} />
                        <span className="absolute inset-0 flex items-center justify-end pr-2 text-[9px] font-mono text-foreground">out {outflow.toLocaleString()}</span>
                      </div>
                      <div className="flex-1 bg-muted/30 rounded relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-accent/60" style={{ width: `${(inflow / max) * 100}%` }} />
                        <span className="absolute inset-0 flex items-center pl-2 text-[9px] font-mono text-foreground">in {inflow.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <Panel title="Repositioning Recommendations" subtitle="OR-Engine">
            <div className="space-y-2">
              {[
                { from: "USLAX", to: "CNSHA", qty: 1450, save: "$184k", reason: "Surplus + high CN demand" },
                { from: "NLRTM", to: "CNSHA", qty: 980, save: "$112k", reason: "Asia-Europe imbalance" },
                { from: "USNYC", to: "NLRTM", qty: 580, save: "$76k", reason: "TA1 backhaul slot" },
                { from: "AEJEA", to: "INNSA", qty: 220, save: "$28k", reason: "Sub-cont demand spike" },
              ].map((r, i) => (
                <div key={i} className="p-3 rounded bg-muted/30 border border-border hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-xs font-bold text-foreground">{r.from} → {r.to}</div>
                    <div className="text-xs font-mono text-success">{r.save}</div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-[10px] font-mono text-muted-foreground">{r.reason}</div>
                    <div className="text-[10px] font-mono text-primary">{r.qty} TEU</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Cost breakdown */}
      <Panel title="Cost Breakdown · Repositioning" subtitle="Monthly aggregate">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Transport", value: 1.84, color: "hsl(var(--primary))" },
            { label: "Storage", value: 0.62, color: "hsl(var(--info))" },
            { label: "Penalties", value: 0.28, color: "hsl(var(--warning))" },
            { label: "Demurrage", value: 0.10, color: "hsl(var(--destructive))" },
          ].map((c) => (
            <div key={c.label} className="p-3 rounded bg-muted/30 border border-border">
              <div className="text-[10px] font-mono uppercase text-muted-foreground">{c.label}</div>
              <div className="text-2xl font-mono font-bold tabular-nums" style={{ color: c.color }}>{c.value}<span className="text-xs text-muted-foreground"> M$</span></div>
              <div className="mt-2 h-1.5 bg-muted/50 rounded overflow-hidden">
                <div className="h-full" style={{ background: c.color, width: `${(c.value / 1.84) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
