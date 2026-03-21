import { Lamp, Sparkles, BookOpen, Image } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Configurateur", icon: Lamp },
    { to: "/catalogue", label: "Catalogue", icon: BookOpen },
    { to: "/realisations", label: "Réalisations", icon: Image },
  ];

  return (
    <motion.header
      className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Lamp className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight group-hover:text-primary transition-colors">Lumière & Création</h1>
            <p className="text-xs text-muted-foreground">Abat-jours sur mesure</p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-body transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
          <motion.div className="ml-2">
            <Link
              to="/#devis"
              className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Commander
            </Link>
          </motion.div>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
