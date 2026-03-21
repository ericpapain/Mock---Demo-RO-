import { motion } from "framer-motion";
import { materials } from "@/data/lampshadeOptions";

interface MaterialSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

const MaterialSelector = ({ selected, onSelect }: MaterialSelectorProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {materials.map((mat) => {
        const isActive = selected === mat.id;
        return (
          <motion.button
            key={mat.id}
            onClick={() => onSelect(mat.id)}
            className={`shape-card text-left ${isActive ? "shape-card-active" : ""}`}
            whileTap={{ scale: 0.97 }}
          >
            <span className="font-display text-sm font-semibold block">{mat.name}</span>
            <span className="text-xs text-muted-foreground">{mat.description}</span>
            {mat.priceModifier > 1 && (
              <span className="text-xs text-primary mt-1 block">+{Math.round((mat.priceModifier - 1) * 100)}%</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default MaterialSelector;
