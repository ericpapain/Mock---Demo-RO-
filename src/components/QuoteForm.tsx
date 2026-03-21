import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, CheckCircle, ArrowLeft } from "lucide-react";

interface QuoteFormProps {
  summary: {
    shape: string;
    color: string;
    material: string;
    dimensions: string;
    base?: string;
    baseColor?: string;
    customProposal?: { customShape: string; customColor: string; notes: string };
  };
}

const QuoteForm = ({ summary }: QuoteFormProps) => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    quantity: "1",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Veuillez remplir au moins votre nom et email.");
      return;
    }
    setSent(true);
    toast.success("Votre demande de devis a été envoyée avec succès !");
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-center py-12 space-y-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          <CheckCircle className="w-16 h-16 text-primary mx-auto" />
        </motion.div>
        <h3 className="font-display text-2xl font-bold">Devis envoyé !</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Merci {form.name} ! Notre équipe vous contactera sous 48h avec votre devis personnalisé.
        </p>
        <motion.button
          onClick={() => setSent(false)}
          className="inline-flex items-center gap-2 text-primary text-sm mt-4 hover:underline"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Nouvelle demande
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Summary */}
      <motion.div
        className="bg-secondary/50 rounded-xl p-4 space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h4 className="font-display font-semibold text-sm">Récapitulatif</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <span className="text-muted-foreground">Forme :</span>
          <span className="font-medium">{summary.shape}</span>
          <span className="text-muted-foreground">Couleur :</span>
          <span className="font-medium">{summary.color}</span>
          <span className="text-muted-foreground">Matière :</span>
          <span className="font-medium">{summary.material}</span>
          <span className="text-muted-foreground">Dimensions :</span>
          <span className="font-medium">{summary.dimensions}</span>
          {summary.base && summary.base !== "Sans pied" && (
            <>
              <span className="text-muted-foreground">Pied :</span>
              <span className="font-medium">{summary.base} — {summary.baseColor}</span>
            </>
          )}
        </div>
        {summary.customProposal && (summary.customProposal.customShape || summary.customProposal.customColor) && (
          <div className="border-t border-border pt-2 mt-2 text-sm">
            <span className="text-muted-foreground">Personnalisation :</span>
            <p className="font-medium">
              {[summary.customProposal.customShape, summary.customProposal.customColor, summary.customProposal.notes]
                .filter(Boolean)
                .join(" • ")}
            </p>
          </div>
        )}
      </motion.div>

      {/* Contact fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet *</Label>
          <Input id="name" placeholder="Jean Dupont" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" placeholder="jean@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" type="tel" placeholder="06 12 34 56 78" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantité</Label>
          <Input id="quantity" type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Adresse de livraison</Label>
        <Input id="address" placeholder="12 rue de la Lumière, 75001 Paris" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" placeholder="Précisions, délais souhaités..." rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </div>

      <motion.button
        type="submit"
        className="btn-quote w-full flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02, boxShadow: "0 15px 35px -10px hsl(32 80% 50% / 0.35)" }}
        whileTap={{ scale: 0.98 }}
      >
        <Send className="w-5 h-5" />
        Demander un devis
      </motion.button>
    </motion.form>
  );
};

export default QuoteForm;
