import { motion } from "framer-motion";
import { materials } from "@/data/lampshadeOptions";
import { Check } from "lucide-react";

interface MaterialSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, x: -15 },
  show: { opacity: 1, x: 0 },
};

const MaterialSelector = ({ selected, onSelect }: MaterialSelectorProps) => {
  return (
    <motion.div
      className="space-y-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {materials.map((mat) => {
        const isActive = selected === mat.id;
        return (
          <motion.button
            key={mat.id}
            onClick={() => onSelect(mat.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
              isActive
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border hover:border-primary/30 hover:shadow-md"
            }`}
            variants={item}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              isActive ? "border-primary bg-primary" : "border-border"
            }`}>
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}
            </div>
            <div className="flex-1">
              <span className="font-display text-sm font-semibold block">{mat.name}</span>
              <span className="text-xs text-muted-foreground">{mat.description}</span>
            </div>
            {mat.priceModifier > 1 && (
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                +{Math.round((mat.priceModifier - 1) * 100)}%
              </span>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default MaterialSelector;
