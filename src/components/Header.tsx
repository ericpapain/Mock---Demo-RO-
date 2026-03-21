import { Lamp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header
      className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Lamp className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight">Lumière & Création</h1>
            <p className="text-xs text-muted-foreground">Abat-jours sur mesure</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-body">
          <a href="#configurateur" className="text-muted-foreground hover:text-foreground transition-colors relative group">
            Configurateur
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#devis" className="text-muted-foreground hover:text-foreground transition-colors relative group">
            Devis
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
          <motion.a
            href="#devis"
            className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Commander
          </motion.a>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
