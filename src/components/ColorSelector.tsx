import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, type LampshadeColor } from "@/data/lampshadeOptions";

interface ColorSelectorProps {
  selected: string;
  onSelect: (id: string, hex: string) => void;
}

const categories = ["Neutres", "Chauds", "Froids", "Pastels"];

const ColorSelector = ({ selected, onSelect }: ColorSelectorProps) => {
  const [activeCategory, setActiveCategory] = useState("Neutres");

  const filtered = colors.filter((c) => c.category === activeCategory);

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-body transition-all duration-200 ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Color grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="flex flex-wrap gap-3"
        >
          {filtered.map((color) => (
            <motion.button
              key={color.id}
              onClick={() => onSelect(color.id, color.hex)}
              className={`color-swatch ${selected === color.id ? "color-swatch-active" : ""}`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Selected color name */}
      {selected && (
        <p className="text-sm text-muted-foreground">
          Couleur sélectionnée : <span className="font-semibold text-foreground">{colors.find((c) => c.id === selected)?.name}</span>
        </p>
      )}
    </div>
  );
};

export default ColorSelector;
