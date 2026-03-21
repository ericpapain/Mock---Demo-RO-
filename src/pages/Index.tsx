import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Lightbulb, Palette, Ruler, Scissors, FileText, Sparkles, Lamp } from "lucide-react";
import Header from "@/components/Header";
import LampshadePreview from "@/components/LampshadePreview";
import ShapeSelector from "@/components/ShapeSelector";
import ColorSelector from "@/components/ColorSelector";
import DimensionSlider from "@/components/DimensionSlider";
import MaterialSelector from "@/components/MaterialSelector";
import BaseSelector from "@/components/BaseSelector";
import CustomProposal from "@/components/CustomProposal";
import QuoteForm from "@/components/QuoteForm";
import { shapes, colors, materials, dimensions, lampBases, baseColors } from "@/data/lampshadeOptions";

const steps = [
  { id: "shape", label: "Forme", icon: Lightbulb },
  { id: "base", label: "Pied", icon: Lamp },
  { id: "color", label: "Couleur", icon: Palette },
  { id: "material", label: "Matière", icon: Scissors },
  { id: "dimensions", label: "Dimensions", icon: Ruler },
  { id: "custom", label: "Sur mesure", icon: Sparkles },
  { id: "quote", label: "Devis", icon: FileText },
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [config, setConfig] = useState({
    shape: "cone",
    colorId: "blanc",
    colorHex: "#FAF5EF",
    material: "coton",
    diameterTop: 20,
    diameterBottom: 35,
    height: 25,
    baseType: "classic",
    baseColorId: "laiton",
    baseColorHex: "#B5935B",
    customProposal: { customShape: "", customColor: "", notes: "" },
  });

  const goNext = () => {
    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const goPrev = () => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 0));
  };
  const goTo = (i: number) => {
    setDirection(i > currentStep ? 1 : -1);
    setCurrentStep(i);
  };

  const summary = {
    shape: shapes.find((s) => s.id === config.shape)?.name || config.shape,
    color: colors.find((c) => c.id === config.colorId)?.name || config.colorId,
    material: materials.find((m) => m.id === config.material)?.name || config.material,
    dimensions: `${config.diameterTop}×${config.diameterBottom}×${config.height} cm`,
    base: lampBases.find((b) => b.id === config.baseType)?.name || "Sans pied",
    baseColor: baseColors.find((bc) => bc.id === config.baseColorId)?.name || "",
    customProposal: config.customProposal,
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case "shape":
        return <ShapeSelector selected={config.shape} onSelect={(id) => setConfig({ ...config, shape: id })} />;
      case "base":
        return (
          <BaseSelector
            selectedBase={config.baseType}
            selectedBaseColor={config.baseColorId}
            onSelectBase={(id) => setConfig({ ...config, baseType: id })}
            onSelectBaseColor={(id, hex) => setConfig({ ...config, baseColorId: id, baseColorHex: hex })}
          />
        );
      case "color":
        return <ColorSelector selected={config.colorId} onSelect={(id, hex) => setConfig({ ...config, colorId: id, colorHex: hex })} />;
      case "material":
        return <MaterialSelector selected={config.material} onSelect={(id) => setConfig({ ...config, material: id })} />;
      case "dimensions":
        return (
          <div className="space-y-6">
            <DimensionSlider label={dimensions.diameterTop.label} value={config.diameterTop} min={dimensions.diameterTop.min} max={dimensions.diameterTop.max} unit={dimensions.diameterTop.unit} onChange={(v) => setConfig({ ...config, diameterTop: v })} />
            <DimensionSlider label={dimensions.diameterBottom.label} value={config.diameterBottom} min={dimensions.diameterBottom.min} max={dimensions.diameterBottom.max} unit={dimensions.diameterBottom.unit} onChange={(v) => setConfig({ ...config, diameterBottom: v })} />
            <DimensionSlider label={dimensions.height.label} value={config.height} min={dimensions.height.min} max={dimensions.height.max} unit={dimensions.height.unit} onChange={(v) => setConfig({ ...config, height: v })} />
          </div>
        );
      case "custom":
        return <CustomProposal onUpdate={(p) => setConfig({ ...config, customProposal: p })} />;
      case "quote":
        return <QuoteForm summary={summary} />;
      default:
        return null;
    }
  };

  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="container mx-auto px-4 pt-12 pb-8 text-center" id="configurateur">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <motion.h2
            className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Créez votre abat-jour{" "}
            <motion.span
              className="text-primary inline-block"
              initial={{ rotate: -5, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
              unique
            </motion.span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Forme, couleur, matière, pied — personnalisez chaque détail. Fabrication artisanale sur mesure.
          </motion.p>
        </motion.div>
      </section>

      {/* Progress bar */}
      <div className="container mx-auto px-4 mb-2">
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stepper */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex items-center justify-center gap-1 md:gap-2 flex-wrap">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            return (
              <motion.button
                key={step.id}
                onClick={() => goTo(i)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-body transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20"
                    : isDone
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{step.label}</span>
                {i < steps.length - 1 && <ChevronRight className="w-3 h-3 ml-1 hidden md:inline text-muted-foreground" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 pb-16" id="devis">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Preview */}
          <motion.div
            className="configurator-section sticky top-24 order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-display text-lg font-semibold mb-4 text-center">Aperçu en direct</h3>
            <LampshadePreview
              shape={config.shape}
              color={config.colorHex}
              diameterTop={config.diameterTop}
              diameterBottom={config.diameterBottom}
              height={config.height}
              material={config.material}
              baseType={config.baseType}
              baseColor={config.baseColorHex}
            />
            {/* Info chips */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                { label: summary.shape, icon: "✦" },
                { label: summary.color, icon: "◉" },
                { label: summary.material, icon: "◈" },
                ...(config.baseType !== "none" ? [{ label: `${summary.base} — ${summary.baseColor}`, icon: "⧫" }] : []),
              ].map((chip, i) => (
                <motion.span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-xs bg-secondary px-3 py-1.5 rounded-full text-secondary-foreground"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-primary">{chip.icon}</span>
                  {chip.label}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Step content */}
          <motion.div
            className="configurator-section order-1 lg:order-2 overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                  {(() => { const Icon = steps[currentStep].icon; return <Icon className="w-5 h-5 text-primary" />; })()}
                  {steps[currentStep].label}
                  <span className="text-xs text-muted-foreground font-body ml-auto">
                    {currentStep + 1}/{steps.length}
                  </span>
                </h3>
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {steps[currentStep].id !== "quote" && (
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <motion.button
                  onClick={goPrev}
                  disabled={currentStep === 0}
                  className="px-5 py-2.5 rounded-xl text-sm font-body font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-30 transition-all flex items-center gap-2"
                  whileHover={{ x: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </motion.button>
                <motion.button
                  onClick={goNext}
                  className="btn-quote !py-2.5 !px-6 !text-sm flex items-center gap-2"
                  whileHover={{ x: 3, boxShadow: "0 12px 30px -8px hsl(32 80% 50% / 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        className="border-t border-border py-8 text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p>© 2026 Lumière & Création — Abat-jours artisanaux sur mesure</p>
      </motion.footer>
    </div>
  );
};

export default Index;
