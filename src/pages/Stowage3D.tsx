import { useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { Panel } from "@/components/shared/Panel";
import { generateStowage, StowageContainer } from "@/data/maritimeData";
import { Boxes, AlertTriangle, Zap, Layers, RotateCw } from "lucide-react";
import { toast } from "sonner";

const catColors: Record<StowageContainer["category"], string> = {
  export: "#06d6c8",
  import: "#a78bfa",
  empty: "#6b7d8c",
  hazard: "#ef4444",
  reefer: "#3b9eff",
  priority: "#ffae42",
};

function ContainerBox({ c, selected, onClick, hidden }: { c: StowageContainer; selected: boolean; onClick: () => void; hidden: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current && selected) ref.current.rotation.y += 0.005;
  });
  if (hidden) return null;
  // bay along z, row along x, tier along y
  const x = c.row * 1.05;
  const y = c.tier * 1.05 + 0.5;
  const z = (c.bay - 10.5) * 2.4;
  return (
    <mesh ref={ref} position={[x, y, z]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <boxGeometry args={[1, 1, 2.2]} />
      <meshStandardMaterial
        color={catColors[c.category]}
        emissive={catColors[c.category]}
        emissiveIntensity={selected ? 0.6 : 0.15}
        metalness={0.4}
        roughness={0.6}
      />
    </mesh>
  );
}

function VesselHull() {
  // Shape the hull
  const hullShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-26, -3);
    s.lineTo(22, -3);
    s.quadraticCurveTo(28, -3, 28, 0);
    s.lineTo(22, 0);
    s.lineTo(-26, 0);
    s.lineTo(-26, -3);
    return s;
  }, []);
  return (
    <group>
      {/* Hull base */}
      <mesh position={[0, -1.6, 0]}>
        <boxGeometry args={[52, 1.6, 14]} />
        <meshStandardMaterial color="#0a1f33" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Bridge */}
      <mesh position={[20, 5, 0]}>
        <boxGeometry args={[6, 6, 12]} />
        <meshStandardMaterial color="#1a3a55" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[20, 9, 0]}>
        <boxGeometry args={[3, 2, 8]} />
        <meshStandardMaterial color="#06d6c8" emissive="#06d6c8" emissiveIntensity={0.15} />
      </mesh>
      {/* Bow */}
      <mesh position={[-26, -1, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[3, 1.6, 14]} />
        <meshStandardMaterial color="#0a1f33" />
      </mesh>
      {/* Sea plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, 0]}>
        <planeGeometry args={[120, 80]} />
        <meshStandardMaterial color="#041a2b" metalness={0.7} roughness={0.2} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

export default function Stowage3D() {
  const [containers, setContainers] = useState<StowageContainer[]>(() => generateStowage("V-1003", 220));
  const [selected, setSelected] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<Set<StowageContainer["category"]>>(new Set(["export","import","empty","hazard","reefer","priority"]));
  const [view, setView] = useState<"3D" | "TOP" | "SIDE">("3D");

  const sel = containers.find((c) => c.id === selected);
  // mock conflicts: reefer above non-power tier or hazard near bridge
  const conflicts = containers.filter((c) => (c.category === "hazard" && c.bay > 16) || (c.category === "reefer" && c.tier > 4));

  const runOptim = () => {
    toast.info("Stowage optimization running…", { description: "Solving CSP · 220 containers · stability + access" });
    setTimeout(() => {
      toast.success("New stowage proposal", { description: "−18% restows · 0 conflicts · stability ✓" });
    }, 1800);
  };

  const stats = {
    total: containers.length,
    weight: containers.reduce((s, c) => s + c.weight, 0).toFixed(0),
    conflicts: conflicts.length,
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-12 gap-4">
        {/* 3D View */}
        <div className="col-span-12 lg:col-span-9">
          <Panel
            title="Stowage Plan · V-1003 Cosco Universe"
            subtitle="20 bays × 11 rows × 6 tiers · click container to inspect"
            actions={
              <div className="flex items-center gap-2">
                <div className="flex gap-1 p-0.5 bg-muted/40 rounded">
                  {(["3D","TOP","SIDE"] as const).map((v) => (
                    <button key={v} onClick={() => setView(v)}
                      className={`px-2 py-1 text-[10px] font-mono uppercase rounded ${view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{v}</button>
                  ))}
                </div>
                <button onClick={runOptim}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary/15 border border-primary/40 hover:bg-primary/25 transition-colors text-primary text-[11px] font-mono uppercase">
                  <Zap className="w-3 h-3" />
                  Optimize
                </button>
              </div>
            }
          >
            <div className="h-[560px] rounded bg-gradient-to-b from-[hsl(215_55%_5%)] to-[hsl(210_50%_10%)] overflow-hidden relative">
              <Canvas camera={{ position: view === "TOP" ? [0, 50, 0.1] : view === "SIDE" ? [0, 8, 80] : [40, 30, 50], fov: 35 }}>
                <ambientLight intensity={0.35} />
                <directionalLight position={[40, 40, 20]} intensity={0.8} color="#06d6c8" />
                <directionalLight position={[-30, 20, -20]} intensity={0.4} color="#ffae42" />
                <pointLight position={[0, 20, 0]} intensity={0.5} color="#a78bfa" />
                <Suspense fallback={null}>
                  <VesselHull />
                  {containers.map((c) => (
                    <ContainerBox
                      key={c.id} c={c}
                      selected={c.id === selected}
                      onClick={() => setSelected(c.id)}
                      hidden={!filterCat.has(c.category)}
                    />
                  ))}
                </Suspense>
                <OrbitControls enablePan enableZoom enableRotate
                  enabled={view === "3D"}
                  minDistance={20} maxDistance={150}
                />
              </Canvas>
              {/* Overlay legend */}
              <div className="absolute bottom-3 left-3 panel p-2 space-y-1">
                <div className="text-[9px] font-mono uppercase text-muted-foreground">Categories (toggle)</div>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(catColors).map(([k, color]) => {
                    const on = filterCat.has(k as StowageContainer["category"]);
                    return (
                      <button key={k} onClick={() => {
                        const s = new Set(filterCat);
                        if (on) s.delete(k as StowageContainer["category"]); else s.add(k as StowageContainer["category"]);
                        setFilterCat(s);
                      }}
                        className={`flex items-center gap-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded ${on ? "" : "opacity-30"}`}>
                        <span className="w-2 h-2 rounded-sm" style={{ background: color }} />
                        {k}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Top-right rotate hint */}
              {view === "3D" && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-mono text-muted-foreground bg-card/70 backdrop-blur px-2 py-1 rounded border border-border">
                  <RotateCw className="w-3 h-3" /> drag · scroll = zoom
                </div>
              )}
            </div>
          </Panel>
        </div>

        {/* Right inspector */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Panel title="Stats">
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-mono uppercase text-muted-foreground">Containers</div>
                <div className="text-2xl font-mono font-bold text-primary">{stats.total}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-muted-foreground">Total Weight</div>
                <div className="text-2xl font-mono font-bold text-foreground">{stats.weight} <span className="text-xs text-muted-foreground">T</span></div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-muted-foreground">Stability</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded overflow-hidden">
                    <div className="h-full bg-success" style={{ width: "82%" }} />
                  </div>
                  <span className="text-xs font-mono text-success">82%</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-muted-foreground">Conflicts</div>
                <div className={`text-2xl font-mono font-bold ${stats.conflicts > 0 ? "text-destructive" : "text-success"}`}>{stats.conflicts}</div>
              </div>
            </div>
          </Panel>

          <Panel title={sel ? `Container ${sel.id.slice(-5)}` : "Inspector"} subtitle={sel ? "Click to select another" : "Click a container"}>
            {sel ? (
              <div className="space-y-2 text-xs font-mono">
                <Row k="Bay" v={sel.bay.toString()} />
                <Row k="Row" v={sel.row.toString()} />
                <Row k="Tier" v={sel.tier.toString()} />
                <Row k="Weight" v={`${sel.weight.toFixed(1)} T`} />
                <Row k="Category" v={<span style={{ color: catColors[sel.category] }}>{sel.category}</span>} />
                <Row k="POL" v={sel.pol} />
                <Row k="POD" v={sel.pod} />
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">Select a container in the 3D view to inspect.</div>
            )}
          </Panel>

          {conflicts.length > 0 && (
            <Panel title="Conflicts" subtitle={`${conflicts.length} detected`}>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {conflicts.slice(0, 8).map((c) => (
                  <div key={c.id} className="p-2 rounded bg-destructive/10 border border-destructive/30 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 text-destructive">
                      <AlertTriangle className="w-3 h-3" />
                      {c.id.slice(-5)} · {c.category}
                    </div>
                    <div className="text-muted-foreground">Bay {c.bay} · Tier {c.tier} — {c.category === "hazard" ? "near bridge" : "no power slot"}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b border-border/50 py-1">
      <span className="text-muted-foreground uppercase text-[10px]">{k}</span>
      <span className="text-foreground">{v}</span>
    </div>
  );
}
