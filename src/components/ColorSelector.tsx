import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "@/data/lampshadeOptions";

interface ColorSelectorProps {
  selected: string;
  onSelect: (id: string, hex: string) => void;
}

const categories = ["Neutres", "Chauds", "Froids", "Pastels"];

const ColorSelector = ({ selected, onSelect }: ColorSelectorProps) => {
  const [activeCategory, setActiveCategory] = useState("Neutres");
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const filtered = colors.filter((c) => c.category === activeCategory);
  const displayName = hoveredColor
    ? colors.find((c) => c.id === hoveredColor)?.name
    : colors.find((c) => c.id === selected)?.name;

  return (
    <div className="space-y-5">
      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-body transition-all duration-200 ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Color grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="flex flex-wrap gap-3"
        >
          {filtered.map((color, i) => (
            <motion.button
              key={color.id}
              onClick={() => onSelect(color.id, color.hex)}
              onMouseEnter={() => setHoveredColor(color.id)}
              onMouseLeave={() => setHoveredColor(null)}
              className={`color-swatch ${selected === color.id ? "color-swatch-active" : ""}`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.2, boxShadow: `0 4px 15px ${color.hex}80` }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Selected color name with transition */}
      <AnimatePresence mode="wait">
        {displayName && (
          <motion.p
            key={displayName}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="text-sm text-muted-foreground flex items-center gap-2"
          >
            <span
              className="inline-block w-4 h-4 rounded-full border border-border"
              style={{ backgroundColor: colors.find((c) => c.name === displayName)?.hex }}
            />
            <span className="font-semibold text-foreground">{displayName}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorSelector;
