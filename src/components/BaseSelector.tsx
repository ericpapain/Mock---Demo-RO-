import { motion } from "framer-motion";
import { lampBases, baseColors, type LampBase } from "@/data/lampshadeOptions";

interface BaseSelectorProps {
  selectedBase: string;
  selectedBaseColor: string;
  onSelectBase: (id: string) => void;
  onSelectBaseColor: (id: string, hex: string) => void;
}

const BaseIcon = ({ base, isActive }: { base: LampBase; isActive: boolean }) => {
  const c = isActive ? "hsl(32, 80%, 50%)" : "hsl(25, 10%, 55%)";

  const icons: Record<string, JSX.Element> = {
    none: (
      <g>
        <line x1="30" y1="5" x2="30" y2="20" stroke={c} strokeWidth="2" />
        <polygon points="20,20 40,20 45,45 15,45" fill="none" stroke={c} strokeWidth="2" />
      </g>
    ),
    classic: (
      <g>
        <polygon points="22,10 38,10 42,25 18,25" fill="none" stroke={c} strokeWidth="1.5" />
        <rect x="28" y="25" width="4" height="20" fill="none" stroke={c} strokeWidth="1.5" />
        <ellipse cx="30" cy="48" rx="12" ry="4" fill="none" stroke={c} strokeWidth="1.5" />
      </g>
    ),
    curved: (
      <g>
        <polygon points="22,10 38,10 42,25 18,25" fill="none" stroke={c} strokeWidth="1.5" />
        <path d="M30,25 Q38,35 30,42 Q25,46 30,50" fill="none" stroke={c} strokeWidth="2" />
        <ellipse cx="30" cy="50" rx="10" ry="3" fill="none" stroke={c} strokeWidth="1.5" />
      </g>
    ),
    tripod: (
      <g>
        <polygon points="22,10 38,10 42,22 18,22" fill="none" stroke={c} strokeWidth="1.5" />
        <line x1="30" y1="25" x2="18" y2="50" stroke={c} strokeWidth="2" />
        <line x1="30" y1="25" x2="42" y2="50" stroke={c} strokeWidth="2" />
        <line x1="30" y1="25" x2="30" y2="50" stroke={c} strokeWidth="2" />
      </g>
    ),
    vase: (
      <g>
        <polygon points="23,10 37,10 40,22 20,22" fill="none" stroke={c} strokeWidth="1.5" />
        <path d="M25,22 Q20,32 22,42 Q25,50 30,50 Q35,50 38,42 Q40,32 35,22" fill="none" stroke={c} strokeWidth="1.5" />
      </g>
    ),
    slim: (
      <g>
        <polygon points="23,10 37,10 40,22 20,22" fill="none" stroke={c} strokeWidth="1.5" />
        <rect x="29" y="22" width="2" height="24" fill="none" stroke={c} strokeWidth="1.5" />
        <ellipse cx="30" cy="48" rx="8" ry="3" fill="none" stroke={c} strokeWidth="1.5" />
      </g>
    ),
  };

  return (
    <svg viewBox="0 0 60 56" className="w-14 h-14">
      {icons[base.id] || icons.none}
    </svg>
  );
};

const BaseSelector = ({ selectedBase, selectedBaseColor, onSelectBase, onSelectBaseColor }: BaseSelectorProps) => {
  return (
    <div className="space-y-6">
      {/* Base shape */}
      <div>
        <p className="text-sm font-medium text-foreground mb-3">Type de pied</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {lampBases.map((base) => {
            const isActive = selectedBase === base.id;
            return (
              <motion.button
                key={base.id}
                onClick={() => onSelectBase(base.id)}
                className={`shape-card flex flex-col items-center gap-1 ${isActive ? "shape-card-active" : ""}`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <BaseIcon base={base} isActive={isActive} />
                <span className="font-display text-xs font-semibold">{base.name}</span>
                <span className="text-[10px] text-muted-foreground">{base.description}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Base color - only show if a base is selected */}
      {selectedBase !== "none" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm font-medium text-foreground mb-3">Couleur du pied</p>
          <div className="flex flex-wrap gap-3">
            {baseColors.map((bc) => (
              <motion.button
                key={bc.id}
                onClick={() => onSelectBaseColor(bc.id, bc.hex)}
                className={`group flex flex-col items-center gap-1.5`}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                    selectedBaseColor === bc.id
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110 border-transparent"
                      : "border-border group-hover:border-primary/40"
                  }`}
                  style={{ backgroundColor: bc.hex }}
                />
                <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">{bc.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BaseSelector;
