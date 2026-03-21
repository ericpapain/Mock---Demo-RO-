import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Palette, Shapes, Lamp as LampIcon, Scissors } from "lucide-react";
import Header from "@/components/Header";
import { colors, shapes, lampBases, baseColors, materials } from "@/data/lampshadeOptions";

type Tab = "tissus" | "formes" | "pieds" | "finitions";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "tissus", label: "Tissus & Couleurs", icon: Palette },
  { id: "formes", label: "Formes", icon: Shapes },
  { id: "pieds", label: "Pieds", icon: LampIcon },
  { id: "finitions", label: "Matières", icon: Scissors },
];

const categories = ["Neutres", "Chauds", "Froids", "Pastels"];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};
const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

const ShapeDisplay = ({ shape }: { shape: typeof shapes[0] }) => {
  const c = "hsl(32, 80%, 50%)";
  const icons: Record<string, JSX.Element> = {
    cone: <polygon points="50,15 15,85 85,85" fill="none" stroke={c} strokeWidth="2.5" />,
    cylinder: <rect x="20" y="15" width="60" height="70" rx="3" fill="none" stroke={c} strokeWidth="2.5" />,
    dome: <path d="M15,85 Q15,15 50,15 Q85,15 85,85 Z" fill="none" stroke={c} strokeWidth="2.5" />,
    empire: <path d="M35,15 Q5,50 15,85 L85,85 Q95,50 65,15 Z" fill="none" stroke={c} strokeWidth="2.5" />,
    oval: <ellipse cx="50" cy="50" rx="35" ry="30" fill="none" stroke={c} strokeWidth="2.5" />,
    square: <rect x="18" y="18" width="64" height="64" fill="none" stroke={c} strokeWidth="2.5" />,
  };

  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20">
      {icons[shape.icon]}
    </svg>
  );
};

const BaseDisplay = ({ base }: { base: typeof lampBases[0] }) => {
  const c = "hsl(32, 80%, 50%)";
  const icons: Record<string, JSX.Element> = {
    none: (
      <g>
        <line x1="50" y1="5" x2="50" y2="30" stroke={c} strokeWidth="2.5" />
        <polygon points="30,30 70,30 80,75 20,75" fill="none" stroke={c} strokeWidth="2.5" />
      </g>
    ),
    classic: (
      <g>
        <polygon points="33,10 67,10 75,35 25,35" fill="none" stroke={c} strokeWidth="2" />
        <rect x="46" y="35" width="8" height="40" fill="none" stroke={c} strokeWidth="2" />
        <ellipse cx="50" cy="80" rx="20" ry="6" fill="none" stroke={c} strokeWidth="2" />
      </g>
    ),
    curved: (
      <g>
        <polygon points="33,10 67,10 75,35 25,35" fill="none" stroke={c} strokeWidth="2" />
        <path d="M50,35 Q65,55 50,70 Q40,78 50,85" fill="none" stroke={c} strokeWidth="2.5" />
        <ellipse cx="50" cy="85" rx="16" ry="5" fill="none" stroke={c} strokeWidth="2" />
      </g>
    ),
    tripod: (
      <g>
        <polygon points="33,10 67,10 75,32 25,32" fill="none" stroke={c} strokeWidth="2" />
        <line x1="50" y1="38" x2="25" y2="85" stroke={c} strokeWidth="2.5" />
        <line x1="50" y1="38" x2="75" y2="85" stroke={c} strokeWidth="2.5" />
        <line x1="50" y1="38" x2="50" y2="85" stroke={c} strokeWidth="2.5" />
      </g>
    ),
    vase: (
      <g>
        <polygon points="35,10 65,10 72,30 28,30" fill="none" stroke={c} strokeWidth="2" />
        <path d="M38,30 Q30,50 33,65 Q38,82 50,82 Q62,82 67,65 Q70,50 62,30" fill="none" stroke={c} strokeWidth="2" />
      </g>
    ),
    slim: (
      <g>
        <polygon points="35,10 65,10 72,30 28,30" fill="none" stroke={c} strokeWidth="2" />
        <rect x="47" y="30" width="6" height="45" fill="none" stroke={c} strokeWidth="2" />
        <ellipse cx="50" cy="80" rx="14" ry="5" fill="none" stroke={c} strokeWidth="2" />
      </g>
    ),
  };

  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20">
      {icons[base.id] || icons.none}
    </svg>
  );
};

const Catalogue = () => {
  const [activeTab, setActiveTab] = useState<Tab>("tissus");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Retour au configurateur
          </Link>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            Notre <span className="text-primary">catalogue</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-lg">
            Découvrez toutes les options disponibles pour personnaliser votre abat-jour sur mesure.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-10 border-b border-border pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* TISSUS */}
          {activeTab === "tissus" && (
            <motion.div
              key="tissus"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-10"
            >
              {categories.map((cat) => {
                const catColors = colors.filter((c) => c.category === cat);
                return (
                  <div key={cat}>
                    <h3 className="font-display text-xl font-semibold mb-4">{cat}</h3>
                    <motion.div
                      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      {catColors.map((color) => (
                        <motion.div
                          key={color.id}
                          variants={item}
                          className="flex flex-col items-center gap-2 group cursor-pointer"
                          whileHover={{ y: -5 }}
                        >
                          <div
                            className="w-14 h-14 rounded-xl border border-border shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all duration-300"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-[11px] text-center text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                            {color.name}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                );
              })}

              {/* Base colors */}
              <div>
                <h3 className="font-display text-xl font-semibold mb-4">Finitions de pied</h3>
                <motion.div
                  className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {baseColors.map((bc) => (
                    <motion.div
                      key={bc.id}
                      variants={item}
                      className="flex flex-col items-center gap-2 group cursor-pointer"
                      whileHover={{ y: -5 }}
                    >
                      <div
                        className="w-14 h-14 rounded-full border border-border shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all duration-300"
                        style={{ backgroundColor: bc.hex }}
                      />
                      <span className="text-[11px] text-center text-muted-foreground group-hover:text-foreground transition-colors">
                        {bc.name}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* FORMES */}
          {activeTab === "formes" && (
            <motion.div
              key="formes"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {shapes.map((shape) => (
                  <motion.div
                    key={shape.id}
                    variants={item}
                    className="configurator-section flex flex-col items-center gap-3 hover:shadow-lg transition-shadow duration-300"
                    whileHover={{ y: -6, scale: 1.02 }}
                  >
                    <ShapeDisplay shape={shape} />
                    <h4 className="font-display font-semibold text-lg">{shape.name}</h4>
                    <p className="text-xs text-muted-foreground text-center">{shape.description}</p>
                    <span className="text-[10px] text-primary bg-primary/10 px-3 py-1 rounded-full">Disponible</span>
                  </motion.div>
                ))}
              </motion.div>
              <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20">
                <h4 className="font-display font-semibold mb-2">Forme sur mesure</h4>
                <p className="text-sm text-muted-foreground">
                  Vous avez une forme en tête qui n'est pas dans notre catalogue ? Contactez-nous via le configurateur et décrivez votre forme idéale. Nos artisans peuvent réaliser quasiment n'importe quelle forme.
                </p>
              </div>
            </motion.div>
          )}

          {/* PIEDS */}
          {activeTab === "pieds" && (
            <motion.div
              key="pieds"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {lampBases.map((base) => (
                  <motion.div
                    key={base.id}
                    variants={item}
                    className="configurator-section flex flex-col items-center gap-3 hover:shadow-lg transition-shadow duration-300"
                    whileHover={{ y: -6, scale: 1.02 }}
                  >
                    <BaseDisplay base={base} />
                    <h4 className="font-display font-semibold text-lg">{base.name}</h4>
                    <p className="text-xs text-muted-foreground text-center">{base.description}</p>
                    <span className="text-[10px] text-primary bg-primary/10 px-3 py-1 rounded-full">Disponible</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* MATIÈRES */}
          {activeTab === "finitions" && (
            <motion.div
              key="finitions"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
            >
              {materials.map((mat, i) => (
                <motion.div
                  key={mat.id}
                  className="configurator-section flex items-center gap-6 hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl font-display text-primary font-bold">
                    {mat.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display font-semibold text-lg">{mat.name}</h4>
                    <p className="text-sm text-muted-foreground">{mat.description}</p>
                  </div>
                  {mat.priceModifier > 1 && (
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                      +{Math.round((mat.priceModifier - 1) * 100)}%
                    </span>
                  )}
                  <span className="text-[10px] text-primary bg-primary/5 px-3 py-1 rounded-full hidden sm:block">Disponible</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Lumière & Création — Abat-jours artisanaux sur mesure</p>
      </footer>
    </div>
  );
};

export default Catalogue;
