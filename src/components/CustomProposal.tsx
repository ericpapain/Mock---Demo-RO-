import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomProposalProps {
  onUpdate: (proposal: { customShape: string; customColor: string; notes: string }) => void;
}

const CustomProposal = ({ onUpdate }: CustomProposalProps) => {
  const [customShape, setCustomShape] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [notes, setNotes] = useState("");

  const handleChange = (field: string, value: string) => {
    const updated = { customShape, customColor, notes, [field]: value };
    if (field === "customShape") setCustomShape(value);
    if (field === "customColor") setCustomColor(value);
    if (field === "notes") setNotes(value);
    onUpdate(updated);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Vous ne trouvez pas votre bonheur ? Décrivez votre abat-jour idéal et nous vous ferons un devis personnalisé.
      </p>
      <div className="space-y-2">
        <Label htmlFor="customShape">Forme souhaitée</Label>
        <Input
          id="customShape"
          placeholder="Ex: Forme pagode, forme tulipe..."
          value={customShape}
          onChange={(e) => handleChange("customShape", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="customColor">Couleur / Motif souhaité</Label>
        <Input
          id="customColor"
          placeholder="Ex: Bleu pétrole avec motif art déco..."
          value={customColor}
          onChange={(e) => handleChange("customColor", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes supplémentaires</Label>
        <Textarea
          id="notes"
          placeholder="Précisez vos envies, l'ambiance recherchée, le lieu de pose..."
          rows={3}
          value={notes}
          onChange={(e) => handleChange("notes", e.target.value)}
        />
      </div>
    </div>
  );
};

export default CustomProposal;
