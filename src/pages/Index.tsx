import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Lightbulb, Palette, Ruler, Scissors, FileText, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import LampshadePreview from "@/components/LampshadePreview";
import ShapeSelector from "@/components/ShapeSelector";
import ColorSelector from "@/components/ColorSelector";
import DimensionSlider from "@/components/DimensionSlider";
import MaterialSelector from "@/components/MaterialSelector";
import CustomProposal from "@/components/CustomProposal";
import QuoteForm from "@/components/QuoteForm";
import { shapes, colors, materials, dimensions } from "@/data/lampshadeOptions";

const steps = [
  { id: "shape", label: "Forme", icon: Lightbulb },
  { id: "color", label: "Couleur", icon: Palette },
  { id: "material", label: "Matière", icon: Scissors },
  { id: "dimensions", label: "Dimensions", icon: Ruler },
  { id: "custom", label: "Sur mesure", icon: Sparkles },
  { id: "quote", label: "Devis", icon: FileText },
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState({
    shape: "cone",
    colorId: "blanc",
    colorHex: "#FAF5EF",
    material: "coton",
    diameterTop: 20,
    diameterBottom: 35,
    height: 25,
    customProposal: { customShape: "", customColor: "", notes: "" },
  });

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const summary = {
    shape: shapes.find((s) => s.id === config.shape)?.name || config.shape,
    color: colors.find((c) => c.id === config.colorId)?.name || config.colorId,
    material: materials.find((m) => m.id === config.material)?.name || config.material,
    dimensions: `${config.diameterTop}×${config.diameterBottom}×${config.height} cm`,
    customProposal: config.customProposal,
  };

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case "shape":
        return <ShapeSelector selected={config.shape} onSelect={(id) => setConfig({ ...config, shape: id })} />;
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 text-center" id="configurateur">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Créez votre abat-jour <span className="text-primary">unique</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Choisissez la forme, la couleur, la matière et les dimensions. Nous fabriquons votre abat-jour sur mesure.
          </p>
        </motion.div>
      </section>

      {/* Stepper */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex items-center justify-center gap-1 md:gap-2 flex-wrap">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(i)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-body transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : isDone
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{step.label}</span>
                {i < steps.length - 1 && <ChevronRight className="w-3 h-3 ml-1 hidden md:inline text-muted-foreground" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 pb-16" id="devis">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Preview */}
          <div className="configurator-section sticky top-24 order-2 lg:order-1">
            <h3 className="font-display text-lg font-semibold mb-4 text-center">Aperçu en direct</h3>
            <LampshadePreview
              shape={config.shape}
              color={config.colorHex}
              diameterTop={config.diameterTop}
              diameterBottom={config.diameterBottom}
              height={config.height}
              material={config.material}
            />
            <div className="mt-4 text-center text-sm text-muted-foreground space-y-1">
              <p><span className="font-medium text-foreground">{summary.shape}</span> en <span className="font-medium text-foreground">{summary.material}</span></p>
              <p>Couleur : <span className="font-medium text-foreground">{summary.color}</span></p>
            </div>
          </div>

          {/* Step content */}
          <div className="configurator-section order-1 lg:order-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                {(() => { const Icon = steps[currentStep].icon; return <Icon className="w-5 h-5 text-primary" />; })()}
                {steps[currentStep].label}
              </h3>
              {renderStep()}
            </motion.div>

            {/* Navigation */}
            {steps[currentStep].id !== "quote" && (
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <button
                  onClick={goPrev}
                  disabled={currentStep === 0}
                  className="px-6 py-2.5 rounded-lg text-sm font-body font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-40 transition-all"
                >
                  Précédent
                </button>
                <button
                  onClick={goNext}
                  className="btn-quote !py-2.5 !px-6 !text-sm flex items-center gap-2"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Lumière & Création — Abat-jours artisanaux sur mesure</p>
      </footer>
    </div>
  );
};

export default Index;
