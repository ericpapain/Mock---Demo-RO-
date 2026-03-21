import { motion } from "framer-motion";
import { shapes, type LampshadeShape } from "@/data/lampshadeOptions";

interface ShapeSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

const ShapeIcon = ({ shape, isActive }: { shape: LampshadeShape; isActive: boolean }) => {
  const color = isActive ? "hsl(32, 80%, 50%)" : "hsl(25, 10%, 50%)";
  
  const icons: Record<string, JSX.Element> = {
    cone: <polygon points="30,10 10,50 50,50" fill="none" stroke={color} strokeWidth="2" />,
    cylinder: <rect x="15" y="10" width="30" height="40" rx="2" fill="none" stroke={color} strokeWidth="2" />,
    dome: <path d="M10,50 Q10,10 30,10 Q50,10 50,50 Z" fill="none" stroke={color} strokeWidth="2" />,
    empire: <path d="M25,10 Q5,30 10,50 L50,50 Q55,30 35,10 Z" fill="none" stroke={color} strokeWidth="2" />,
    oval: <ellipse cx="30" cy="30" rx="20" ry="18" fill="none" stroke={color} strokeWidth="2" />,
    square: <rect x="12" y="12" width="36" height="36" fill="none" stroke={color} strokeWidth="2" />,
  };

  return (
    <svg viewBox="0 0 60 60" className="w-12 h-12">
      {icons[shape.icon]}
    </svg>
  );
};

const ShapeSelector = ({ selected, onSelect }: ShapeSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {shapes.map((shape) => {
        const isActive = selected === shape.id;
        return (
          <motion.button
            key={shape.id}
            onClick={() => onSelect(shape.id)}
            className={`shape-card flex flex-col items-center gap-2 ${isActive ? "shape-card-active" : ""}`}
            whileTap={{ scale: 0.97 }}
          >
            <ShapeIcon shape={shape} isActive={isActive} />
            <span className="font-display text-sm font-semibold">{shape.name}</span>
            <span className="text-xs text-muted-foreground">{shape.description}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ShapeSelector;
