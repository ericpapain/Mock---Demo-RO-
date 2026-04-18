import { ReactNode } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker, Line } from "react-simple-maps";
import { ports, routes, riskZones, vessels, RiskZone } from "@/data/maritimeData";
import { useState } from "react";

type Props = {
  showRoutes?: boolean;
  showRisk?: boolean;
  showWeather?: boolean;
  showPiracy?: boolean;
  showVessels?: boolean;
  highlightedPort?: string | null;
  onPortClick?: (id: string) => void;
  children?: ReactNode;
};

const riskColor = (sev: RiskZone["severity"]) =>
  sev === "critical" ? "hsl(var(--destructive))"
  : sev === "high" ? "hsl(var(--risk-high))"
  : sev === "med" ? "hsl(var(--warning))"
  : "hsl(var(--success))";

export function WorldMap({
  showRoutes = true, showRisk = true, showWeather = true, showPiracy = true,
  showVessels = true, highlightedPort, onPortClick, children
}: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const filteredZones = riskZones.filter((z) =>
    (showWeather || z.type !== "Weather") &&
    (showPiracy || z.type !== "Piracy") &&
    (showRisk || (z.type !== "Geopolitical" && z.type !== "Sanctions" && z.type !== "Congestion"))
  );

  return (
    <div className="relative w-full h-full ocean-bg overflow-hidden rounded-md">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 175 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup center={[20, 20]} zoom={1.05} maxZoom={6}>
          <Geographies geography="/world-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="hsl(215 35% 12%)"
                  stroke="hsl(215 30% 18%)"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "hsl(215 35% 16%)", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Risk zones (radials) */}
          {filteredZones.map((z) => (
            <Marker key={z.id} coordinates={z.coords}>
              <circle r={z.radius * 2.5} fill={riskColor(z.severity)} fillOpacity={0.08} stroke={riskColor(z.severity)} strokeOpacity={0.35} strokeWidth={0.6} />
              <circle r={z.radius * 1.2} fill={riskColor(z.severity)} fillOpacity={0.15} />
              {z.severity === "critical" && (
                <circle r={4} fill="none" stroke={riskColor(z.severity)} strokeWidth={1.5} className="animate-radar" style={{ transformOrigin: "center" }} />
              )}
            </Marker>
          ))}

          {/* Routes */}
          {showRoutes && routes.map((r) => {
            const coords = r.ports.map((pid) => ports.find((p) => p.id === pid)!.coords);
            return coords.slice(0, -1).map((c, i) => (
              <Line
                key={`${r.id}-${i}`}
                from={c as [number, number]}
                to={coords[i + 1] as [number, number]}
                stroke={r.riskScore > 60 ? "hsl(var(--destructive))" : r.riskScore > 35 ? "hsl(var(--warning))" : "hsl(var(--primary))"}
                strokeWidth={r.riskScore > 60 ? 1.4 : 1}
                strokeOpacity={0.55}
                strokeLinecap="round"
                className="animate-flow-slow"
              />
            ));
          })}

          {/* Vessels (active at sea) */}
          {showVessels && vessels.filter((v) => v.position).map((v) => (
            <Marker key={v.id} coordinates={v.position!}>
              <g>
                <circle r={1.6} fill="hsl(var(--primary))" />
                <circle r={3.2} fill="none" stroke="hsl(var(--primary))" strokeWidth={0.4} strokeOpacity={0.6} />
              </g>
            </Marker>
          ))}

          {/* Ports */}
          {ports.map((p) => {
            const isActive = hover === p.id || highlightedPort === p.id;
            const sz = 2 + (p.throughput / 47) * 4;
            const congColor = p.congestion > 65 ? "hsl(var(--destructive))" : p.congestion > 45 ? "hsl(var(--warning))" : "hsl(var(--success))";
            return (
              <Marker
                key={p.id}
                coordinates={p.coords}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onPortClick?.(p.id)}
                style={{ default: { cursor: "pointer" } }}
              >
                <circle r={sz + 2} fill={congColor} fillOpacity={0.18} />
                <circle r={sz} fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth={0.5} />
                {isActive && (
                  <>
                    <circle r={sz + 4} fill="none" stroke="hsl(var(--primary))" strokeWidth={0.6} className="animate-ping" />
                    <text x={sz + 4} y={2} fontSize={6} fill="hsl(var(--foreground))" fontFamily="JetBrains Mono">
                      {p.code} · {p.name}
                    </text>
                    <text x={sz + 4} y={9} fontSize={4.5} fill="hsl(var(--muted-foreground))" fontFamily="JetBrains Mono">
                      {p.throughput}M TEU · cong {p.congestion}%
                    </text>
                  </>
                )}
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
      {children}
    </div>
  );
}
