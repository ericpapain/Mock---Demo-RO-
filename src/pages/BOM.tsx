import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Package, Layers, Wrench, Boxes } from "lucide-react";
import { Panel } from "@/components/shared/Panel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { products, helpers } from "@/data/supplyData";

export default function BOM() {
  const [selectedId, setSelectedId] = useState(products[0].id);
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set([`${products[0].id}-job-0`]));

  const product = helpers.getProduct(selectedId)!;
  // Découpe BOM en "jobs" virtuels (assemblage / câblage / test)
  const jobs = [
    { id: "job-0", name: "Préparation châssis", components: product.bom.filter((b) => helpers.getComponent(b.componentId)?.category === "Châssis" || helpers.getComponent(b.componentId)?.category === "Mécanique") },
    { id: "job-1", name: "Intégration électronique", components: product.bom.filter((b) => helpers.getComponent(b.componentId)?.category === "Électronique") },
    { id: "job-2", name: "Module optique", components: product.bom.filter((b) => helpers.getComponent(b.componentId)?.category === "Optique") },
    { id: "job-3", name: "Finition & assemblage", components: product.bom.filter((b) => helpers.getComponent(b.componentId)?.category === "Consommable") },
  ].filter((j) => j.components.length > 0);

  const toggleJob = (id: string) => {
    const k = `${selectedId}-${id}`;
    const next = new Set(expandedJobs);
    next.has(k) ? next.delete(k) : next.add(k);
    setExpandedJobs(next);
  };

  const totalCost = product.bom.reduce((s, b) => {
    const c = helpers.getComponent(b.componentId);
    return s + (c?.unitCost ?? 0) * b.quantity;
  }, 0);

  return (
    <div className="p-4 md:p-6 space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Décomposition Produits — BOM</h1>
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Bill of Materials · Vue éclatée Produit → Jobs → Composants
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Selector */}
        <Panel title="Catalogue produits" className="lg:col-span-1">
          <div className="space-y-1.5">
            {products.map((p) => {
              const active = p.id === selectedId;
              return (
                <button key={p.id} onClick={() => setSelectedId(p.id)}
                  className={`w-full text-left p-2.5 rounded-md border transition-all ${
                    active ? "border-primary bg-primary/10 text-foreground" : "border-border bg-muted/20 hover:border-primary/40 text-muted-foreground"
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold">{p.id}</span>
                    {active && <ChevronRight className="w-3.5 h-3.5 text-primary" />}
                  </div>
                  <div className="text-sm font-medium mt-0.5">{p.name}</div>
                  <div className="text-[10px] text-muted-foreground/70 mt-0.5">{p.family}</div>
                </button>
              );
            })}
          </div>
        </Panel>

        {/* Tree */}
        <div className="lg:col-span-3 space-y-4">
          {/* Header card */}
          <Panel title={`Produit · ${product.id}`} subtitle={product.family}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <Stat label="Composants" value={`${product.bom.length}`} icon={Boxes} />
              <Stat label="Cycle" value={`${product.cycleTimeHours} h`} icon={Wrench} />
              <Stat label="Marge" value={`${product.marginPct}%`} icon={Layers} />
              <Stat label="Coût matière" value={`${totalCost.toFixed(0)} €`} icon={Package} />
            </div>
          </Panel>

          {/* Visual BOM tree */}
          <Panel title="Arbre BOM interactif" subtitle="Cliquez pour développer chaque job">
            <div className="relative">
              {/* Root product */}
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mb-6">
                <div className="px-5 py-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/40 shadow-[0_0_20px_hsl(var(--primary)/0.2)] text-center">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-primary">PRODUIT FINI</div>
                  <div className="text-base font-bold mt-0.5">{product.name}</div>
                </div>
              </motion.div>

              {/* Jobs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {jobs.map((job, i) => {
                  const k = `${selectedId}-${job.id}`;
                  const expanded = expandedJobs.has(k);
                  const jobCost = job.components.reduce((s, b) => {
                    const c = helpers.getComponent(b.componentId);
                    return s + (c?.unitCost ?? 0) * b.quantity;
                  }, 0);
                  return (
                    <motion.div key={job.id}
                      initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      className="rounded-lg border border-border bg-card overflow-hidden">
                      <button onClick={() => toggleJob(job.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors">
                        <div className="w-8 h-8 rounded-md bg-accent/15 text-accent flex items-center justify-center">
                          <Wrench className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">JOB · {job.id}</div>
                          <div className="text-sm font-semibold">{job.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-mono text-muted-foreground">{job.components.length} cmp</div>
                          <div className="text-xs font-mono font-semibold text-foreground">{jobCost.toFixed(0)}€</div>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {expanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="border-t border-border bg-muted/10">
                            <div className="p-3 space-y-1.5">
                              {job.components.map((b) => {
                                const c = helpers.getComponent(b.componentId)!;
                                const sup = helpers.getSupplier(c.supplierId);
                                const low = c.currentStock < c.stockMin;
                                return (
                                  <div key={c.id} className="flex items-center gap-2 p-2 rounded bg-background/50 border border-border/60">
                                    <div className={`w-1 h-8 rounded ${low ? "bg-destructive" : "bg-success"}`} />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-mono text-primary">{c.id}</span>
                                        <span className="text-xs font-medium truncate">{c.name}</span>
                                      </div>
                                      <div className="text-[10px] text-muted-foreground font-mono">
                                        {sup?.name} · stock {c.currentStock}/{c.stockTarget}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs font-mono font-bold text-accent">×{b.quantity}</div>
                                      <div className="text-[10px] text-muted-foreground font-mono">{(c.unitCost * b.quantity).toFixed(0)}€</div>
                                    </div>
                                    {low && <StatusBadge tone="danger">Bas</StatusBadge>}
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="p-2.5 rounded-md bg-muted/30 border border-border flex items-center gap-2">
      <Icon className="w-4 h-4 text-primary" />
      <div>
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">{label}</div>
        <div className="text-sm font-mono font-semibold">{value}</div>
      </div>
    </div>
  );
}
