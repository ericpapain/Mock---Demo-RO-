import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";

import imgTerracotta from "@/assets/gallery/lamp-terracotta-tripod.jpg";
import imgCream from "@/assets/gallery/lamp-cream-cylinder.jpg";
import imgNavy from "@/assets/gallery/lamp-navy-dome.jpg";
import imgSage from "@/assets/gallery/lamp-sage-empire.jpg";
import imgPaper from "@/assets/gallery/lamp-paper-pendant.jpg";
import imgRose from "@/assets/gallery/lamp-rose-vase.jpg";
import imgMetal from "@/assets/gallery/lamp-metal-industrial.jpg";
import imgMustard from "@/assets/gallery/lamp-mustard-square.jpg";

const projects = [
  {
    id: 1,
    image: imgTerracotta,
    title: "Lampadaire Terracotta",
    description: "Abat-jour conique en lin terracotta sur pied trépied laiton",
    shape: "Conique",
    material: "Lin",
    color: "Terracotta",
    client: "Hôtel Le Marais, Paris",
  },
  {
    id: 2,
    image: imgCream,
    title: "Suspension Crème",
    description: "Cylindre en coton naturel sur pied trépied noir, style scandinave",
    shape: "Cylindrique",
    material: "Coton",
    color: "Blanc Crème",
    client: "Studio Atelier Nord, Lyon",
  },
  {
    id: 3,
    image: imgNavy,
    title: "Lampe Classique Marine",
    description: "Dôme en soie bleu marine sur pied classique doré, luxe intemporel",
    shape: "Dôme",
    material: "Soie",
    color: "Bleu Marine",
    client: "Résidence Privée, Bordeaux",
  },
  {
    id: 4,
    image: imgSage,
    title: "Empire Vert Sauge",
    description: "Abat-jour empire en lin vert sauge sur pied courbé cuivre",
    shape: "Empire",
    material: "Lin",
    color: "Vert Sauge",
    client: "Café Botanique, Marseille",
  },
  {
    id: 5,
    image: imgPaper,
    title: "Suspension Papier Japonais",
    description: "Luminaire suspendu en papier japonais, diffusion douce et uniforme",
    shape: "Dôme",
    material: "Papier japonais",
    color: "Ivoire",
    client: "Restaurant Umami, Nice",
  },
  {
    id: 6,
    image: imgRose,
    title: "Lampe Poudré",
    description: "Abat-jour conique rose poudré sur pied vase or rose",
    shape: "Conique",
    material: "Coton",
    color: "Rose Poudré",
    client: "Chambre d'hôtes La Roseraie",
  },
  {
    id: 7,
    image: imgMetal,
    title: "Industriel Perforé",
    description: "Métal perforé anthracite avec jeux d'ombres géométriques",
    shape: "Conique",
    material: "Métal perforé",
    color: "Anthracite",
    client: "Loft Design, Lille",
  },
  {
    id: 8,
    image: imgMustard,
    title: "Carré Moutarde",
    description: "Abat-jour carré en lin moutarde sur trépied bois naturel",
    shape: "Carré",
    material: "Lin",
    color: "Moutarde",
    client: "Librairie L'Éclaireur, Toulouse",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Realisations = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const nextImage = () => setLightbox((prev) => (prev !== null ? (prev + 1) % projects.length : null));
  const prevImage = () => setLightbox((prev) => (prev !== null ? (prev - 1 + projects.length) % projects.length : null));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Retour au configurateur
          </Link>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            Nos <span className="text-primary">réalisations</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-lg">
            Chaque pièce est unique, fabriquée à la main dans notre atelier. Découvrez nos créations passées pour vous inspirer.
          </p>
        </motion.div>

        {/* Gallery grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              variants={item}
              className="group cursor-pointer"
              onClick={() => openLightbox(i)}
              whileHover={{ y: -6 }}
            >
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <div>
                    <h3 className="font-display text-lg font-bold text-background">{project.title}</h3>
                    <p className="text-xs text-background/80">{project.client}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 px-1">
                <h3 className="font-display font-semibold text-sm">{project.title}</h3>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {[project.shape, project.material, project.color].map((tag) => (
                    <span key={tag} className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-foreground/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative max-w-3xl w-full bg-card rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={projects[lightbox].image}
                alt={projects[lightbox].title}
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="p-6">
                <h3 className="font-display text-2xl font-bold">{projects[lightbox].title}</h3>
                <p className="text-muted-foreground mt-1">{projects[lightbox].description}</p>
                <p className="text-xs text-primary mt-2">{projects[lightbox].client}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[projects[lightbox].shape, projects[lightbox].material, projects[lightbox].color].map((tag) => (
                    <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <button onClick={closeLightbox} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors">
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/3 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/3 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Lumière & Création — Abat-jours artisanaux sur mesure</p>
      </footer>
    </div>
  );
};

export default Realisations;
