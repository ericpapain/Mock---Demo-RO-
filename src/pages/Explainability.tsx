import { Panel } from "@/components/shared/Panel";
import { Lightbulb, GitBranch, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

export default function Explainability() {
  return (
    <div className="p-4 space-y-4">
      <Panel title="Decision Explanation · Latest Optimization" subtitle="Plan generated 2 min ago · MILP gap 0.02%">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-7 space-y-4">
            <div className="p-4 rounded bg-primary/10 border border-primary/30">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm font-mono font-bold text-primary uppercase tracking-wider">Why this plan?</div>
                  <p className="text-sm text-foreground mt-2 leading-relaxed">
                    The solver chose <span className="text-primary font-bold">Cape route (AE2)</span> over Suez (AE1) because the
                    risk-adjusted expected cost is <span className="text-success font-bold">$340k lower per voyage</span>, and the
                    insurance premium spike (+480% on Red Sea corridor) outweighs the 8-day transit penalty.
                    <span className="text-warning"> 3 vessels were re-sequenced</span> to maintain weekly Asia-Europe service.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">Decision tree · top contributors</div>
              {[
                { factor: "Red Sea geopolitical risk", impact: 88, dir: "neg", contribution: "Forced reroute via Cape" },
                { factor: "Bunker price (avg 612 $/T)", impact: 62, dir: "neg", contribution: "Speed reduced 18→15 kn" },
                { factor: "Empty container surplus USLAX", impact: 55, dir: "pos", contribution: "Backhaul slot booked TP1" },
                { factor: "Singapore port congestion", impact: 48, dir: "neg", contribution: "Skip option for 2 vessels" },
                { factor: "TP1 weather window", impact: 32, dir: "pos", contribution: "+0.8 kn allowed" },
              ].map((f, i) => (
                <div key={i} className="p-3 rounded bg-muted/30 border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-mono font-semibold text-foreground">{f.factor}</div>
                    <div className={`text-[10px] font-mono ${f.dir === "neg" ? "text-destructive" : "text-success"}`}>
                      {f.dir === "neg" ? "−" : "+"}{f.impact}%
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted/50 rounded overflow-hidden">
                    <div className={`h-full ${f.dir === "neg" ? "bg-destructive" : "bg-success"}`} style={{ width: `${f.impact}%` }} />
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-1.5 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    {f.contribution}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trade-offs + binding constraints */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            <Panel title="Trade-Offs Made">
              <div className="space-y-2 text-xs">
                {[
                  { lost: "8 days of transit time", gained: "$340k risk-adjusted savings" },
                  { lost: "+18% CO₂ vs Suez", gained: "0% war-zone exposure" },
                  { lost: "2 ports skipped", gained: "+3.4 pt fleet utilization" },
                ].map((t, i) => (
                  <div key={i} className="p-2 rounded bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 text-destructive">
                      <span className="text-[10px] font-mono uppercase">Lost</span>
                      <span className="text-foreground">{t.lost}</span>
                    </div>
                    <div className="flex items-center gap-2 text-success mt-1">
                      <span className="text-[10px] font-mono uppercase">Gained</span>
                      <span className="text-foreground">{t.gained}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Binding Constraints" subtitle="What limits the solution">
              <div className="space-y-2">
                {[
                  { c: "Reefer power slots V-1003", val: "8/8 used", crit: true },
                  { c: "Bunker tanks AE2", val: "92% capacity", crit: false },
                  { c: "Crew hours TP1", val: "82h/84h limit", crit: true },
                  { c: "Panama draft", val: "12.5m max", crit: false },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/30 border border-border">
                    {c.crit ? <AlertTriangle className="w-3.5 h-3.5 text-destructive" /> : <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
                    <div className="flex-1 text-xs font-mono">
                      <div className="text-foreground">{c.c}</div>
                      <div className={`text-[10px] ${c.crit ? "text-destructive" : "text-muted-foreground"}`}>{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Counterfactuals" subtitle="What if we relax…">
              <div className="space-y-1.5 text-xs font-mono">
                {[
                  { c: "Crew rest hours (+10%)", g: "−$84k cost", color: "success" },
                  { c: "Risk threshold to 80", g: "−2.4d transit", color: "warning" },
                  { c: "Bunker budget +5%", g: "+1.2 kn speed", color: "primary" },
                ].map((cf, i) => (
                  <div key={i} className="p-2 rounded bg-muted/30 border border-border flex items-center justify-between hover:border-primary/30 transition-colors">
                    <span className="text-muted-foreground">{cf.c}</span>
                    <span className={`text-${cf.color}`}>{cf.g}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </Panel>

      <Panel title="Container Placement Reasoning · V-1003" subtitle="Why containers were placed this way">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {[
            { rule: "Heavy first (bottom tiers)", desc: "Stability moment minimized · KG below 11.2m", color: "primary" },
            { rule: "POD grouping by bay", desc: "Cuts restows by 18% at intermediate ports", color: "success" },
            { rule: "Reefer near power panels", desc: "Bays 4, 8, 12 only · 8/8 slots filled", color: "info" },
            { rule: "Hazard segregation IMDG", desc: "Class 3 ≥ 3 bays from accommodation", color: "destructive" },
            { rule: "Priority access on top", desc: "Express POD on outer rows for fast discharge", color: "accent" },
            { rule: "Empty backhaul outer bays", desc: "Maximize export reload at next POL", color: "warning" },
          ].map((r, i) => (
            <div key={i} className={`p-3 rounded bg-muted/20 border-l-2 border-l-${r.color} border border-border`}>
              <div className={`text-xs font-mono font-bold text-${r.color}`}>{r.rule}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{r.desc}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
