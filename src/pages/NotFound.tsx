import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center panel p-10 max-w-md">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h1 className="font-mono text-5xl font-bold text-primary mb-2">404</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono mb-1">Module introuvable</p>
        <p className="text-sm text-foreground mb-6">La route <code className="text-accent font-mono">{location.pathname}</code> n'existe pas dans SupplyOR.</p>
        <a href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-xs hover:bg-primary/90">
          ← Retour au cockpit
        </a>
      </div>
    </div>
  );
};

export default NotFound;
