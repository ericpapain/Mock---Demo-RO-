import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Panel } from "@/components/shared/Panel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { suppliers, components, productionLines, products, helpers } from "@/data/supplyData";

export default function ChainView() {
  const [hovered, setHovered] = useState<string | null>(null);

  // 3 colonnes : suppliers / components / lines
  const links = useMemo(() => {
    const out: { from: string; to: string; weight: number; type: "sup-cmp" | "cmp-line" }[] = [];
    components.forEach((c) => out.push({ from: c.supplierId, to: c.id, weight: c.stockTarget, type: "sup-cmp" }));
    products.forEach((p) => p.bom.forEach((b) => out.push({ from: b.componentId, to: p.productionLine, weight: b.quantity * 10, type: "cmp-line" })));
    return out;
  }, []);

  const isHighlighted = (id: string) => {
    if (!hovered) return true;
    if (hovered === id) return true;
    return links.some((l) =>
      (l.from === hovered && l.to === id) || (l.to === hovered && l.from === id) ||
      (l.from === id && l.to === hovered) || (l.to === id && l.from === hovered)
    );
  };

  // Layout positions
  const W = 1100, H = 720;
  const colX = { sup: 100, cmp: 550, line: 1000 };
  const supY = (i: number) => 60 + i * (H - 120) / Math.max(1, suppliers.length - 1);
  const cmpY = (i: number) => 40 + i * (H - 80) / Math.max(1, components.length - 1);
  const lineY = (i: number) => 120 + i * (H - 240) / Math.max(1, productionLines.length - 1);

  const supPos = (id: string) => ({ x: colX.sup, y: supY(suppliers.findIndex((s) => s.id === id)) });
  const cmpPos = (id: string) => ({ x: colX.cmp, y: cmpY(components.findIndex((c) => c.id === id)) });
  const linePos = (id: string) => ({ x: colX.line, y: lineY(productionLines.findIndex((l) => l.id === id)) });

  return (
    <div className="p-4 md:p-6 space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vue Chaîne d'Approvisionnement</h1>
        <p className="text-xs text-muted-foreground font-mono mt-1">
          {suppliers.length} fournisseurs · {components.length} composants · {productionLines.length} lignes
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-[10px] font-mono">
        <StatusBadge tone="primary"><span className="w-2 h-0.5 bg-primary" /> Approvisionnement</StatusBadge>
        <StatusBadge tone="warning"><span className="w-2 h-0.5 bg-accent" /> Consommation</StatusBadge>
        <span className="text-muted-foreground self-center ml-2">→ Survolez un nœud pour isoler les flux</span>
      </div>

      <Panel title="Graphe Sankey interactif" subtitle="Fournisseurs → Composants → Lignes de production">
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[900px]" style={{ height: H * 0.7 }}>
            {/* Column labels */}
            <text x={colX.sup} y={20} fill="hsl(var(--muted-foreground))" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">FOURNISSEURS</text>
            <text x={colX.cmp} y={20} fill="hsl(var(--muted-foreground))" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">COMPOSANTS</text>
            <text x={colX.line} y={20} fill="hsl(var(--muted-foreground))" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">LIGNES</text>

            {/* Links */}
            {links.map((l, i) => {
              let from, to, color;
              if (l.type === "sup-cmp") {
                from = supPos(l.from); to = cmpPos(l.to);
                color = "hsl(var(--primary))";
              } else {
                from = cmpPos(l.from); to = linePos(l.to);
                color = "hsl(var(--accent))";
              }
              const dim = hovered && !isHighlighted(l.from) && !isHighlighted(l.to);
              const active = hovered && (l.from === hovered || l.to === hovered);
              const cx1 = from.x + (to.x - from.x) * 0.5;
              const path = `M ${from.x + 12} ${from.y} C ${cx1} ${from.y}, ${cx1} ${to.y}, ${to.x - 12} ${to.y}`;
              return (
                <path
                  key={i} d={path} fill="none" stroke={color}
                  strokeWidth={active ? 2.5 : 1}
                  strokeOpacity={dim ? 0.05 : active ? 0.9 : 0.25}
                  className={active ? "animate-flow" : ""}
                />
              );
            })}

            {/* Suppliers nodes */}
            {suppliers.map((s, i) => {
              const y = supY(i);
              const dim = hovered && !isHighlighted(s.id);
              return (
                <g key={s.id} transform={`translate(${colX.sup},${y})`}
                   onMouseEnter={() => setHovered(s.id)} onMouseLeave={() => setHovered(null)}
                   style={{ cursor: "pointer", opacity: dim ? 0.3 : 1, transition: "opacity 0.2s" }}>
                  <rect x={-90} y={-14} width={180} height={28} rx={6}
                        fill="hsl(var(--card))" stroke={hovered === s.id ? "hsl(var(--primary))" : "hsl(var(--border))"} strokeWidth={hovered === s.id ? 2 : 1} />
                  <circle cx={-78} cy={0} r={4} fill={s.reliability > 95 ? "hsl(var(--success))" : s.reliability > 90 ? "hsl(var(--primary))" : "hsl(var(--warning))"} />
                  <text x={-68} y={3} fill="hsl(var(--foreground))" fontSize="10" fontFamily="JetBrains Mono">{s.name.slice(0, 16)}</text>
                  <text x={82} y={3} fill="hsl(var(--muted-foreground))" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">{s.reliability}%</text>
                </g>
              );
            })}

            {/* Components nodes */}
            {components.map((c, i) => {
              const y = cmpY(i);
              const dim = hovered && !isHighlighted(c.id);
              const lowStock = c.currentStock < c.stockMin;
              return (
                <g key={c.id} transform={`translate(${colX.cmp},${y})`}
                   onMouseEnter={() => setHovered(c.id)} onMouseLeave={() => setHovered(null)}
                   style={{ cursor: "pointer", opacity: dim ? 0.3 : 1, transition: "opacity 0.2s" }}>
                  <rect x={-90} y={-12} width={180} height={24} rx={4}
                        fill={lowStock ? "hsl(var(--destructive)/0.1)" : "hsl(var(--card))"}
                        stroke={hovered === c.id ? "hsl(var(--primary))" : lowStock ? "hsl(var(--destructive))" : "hsl(var(--border))"}
                        strokeWidth={hovered === c.id ? 2 : 1} />
                  <text x={-82} y={3} fill="hsl(var(--foreground))" fontSize="10" fontFamily="JetBrains Mono">{c.name.slice(0, 22)}</text>
                  <text x={82} y={3} fill={lowStock ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))"} fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">{c.currentStock}</text>
                </g>
              );
            })}

            {/* Production lines nodes */}
            {productionLines.map((l, i) => {
              const y = lineY(i);
              const dim = hovered && !isHighlighted(l.id);
              return (
                <g key={l.id} transform={`translate(${colX.line},${y})`}
                   onMouseEnter={() => setHovered(l.id)} onMouseLeave={() => setHovered(null)}
                   style={{ cursor: "pointer", opacity: dim ? 0.3 : 1, transition: "opacity 0.2s" }}>
                  <rect x={-100} y={-18} width={200} height={36} rx={6}
                        fill="hsl(var(--accent)/0.1)"
                        stroke={hovered === l.id ? "hsl(var(--accent))" : "hsl(var(--accent)/0.4)"} strokeWidth={hovered === l.id ? 2 : 1} />
                  <text x={-90} y={-2} fill="hsl(var(--foreground))" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">{l.name}</text>
                  <text x={-90} y={12} fill="hsl(var(--muted-foreground))" fontSize="9" fontFamily="JetBrains Mono">{l.capacityHoursPerDay}h/j · η={Math.round(l.efficiency*100)}%</text>
                </g>
              );
            })}
          </svg>
        </div>
      </Panel>

      {/* Detail card */}
      {hovered && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Panel title="Détail nœud" subtitle={hovered}>
            <DetailNode id={hovered} />
          </Panel>
        </motion.div>
      )}
    </div>
  );
}

function DetailNode({ id }: { id: string }) {
  const sup = helpers.getSupplier(id);
  const cmp = helpers.getComponent(id);
  const line = helpers.getLine(id);
  if (sup) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <Field label="Pays" value={sup.country} />
        <Field label="Catégorie" value={sup.category} />
        <Field label="Fiabilité" value={`${sup.reliability}%`} />
        <Field label="Lead time" value={`${sup.leadTimeDays} j`} />
      </div>
    );
  }
  if (cmp) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <Field label="Nom" value={cmp.name} />
        <Field label="Stock" value={`${cmp.currentStock} / ${cmp.stockTarget}`} />
        <Field label="Seuil min" value={`${cmp.stockMin}`} />
        <Field label="Coût unitaire" value={`${cmp.unitCost} €`} />
      </div>
    );
  }
  if (line) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <Field label="Capacité" value={`${line.capacityHoursPerDay} h/j`} />
        <Field label="Efficience" value={`${Math.round(line.efficiency*100)}%`} />
      </div>
    );
  }
  return null;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 rounded bg-muted/30 border border-border">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">{label}</div>
      <div className="text-sm font-mono font-semibold text-foreground mt-0.5">{value}</div>
    </div>
  );
}
