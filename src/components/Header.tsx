import { Lamp } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Lamp className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight">Lumière & Création</h1>
            <p className="text-xs text-muted-foreground">Abat-jours sur mesure</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-body">
          <a href="#configurateur" className="text-muted-foreground hover:text-foreground transition-colors">Configurateur</a>
          <a href="#devis" className="text-muted-foreground hover:text-foreground transition-colors">Devis</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
