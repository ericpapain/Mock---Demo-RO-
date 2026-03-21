export type LampshadeShape = {
  id: string;
  name: string;
  description: string;
  icon: string; // SVG path
};

export type LampshadeColor = {
  id: string;
  name: string;
  hex: string;
  category: string;
};

export type LampshadeMaterial = {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
};

export type LampshadeDimension = {
  label: string;
  min: number;
  max: number;
  default: number;
  unit: string;
};

export const shapes: LampshadeShape[] = [
  { id: "cone", name: "Conique", description: "Forme classique évasée", icon: "cone" },
  { id: "cylinder", name: "Cylindrique", description: "Forme droite moderne", icon: "cylinder" },
  { id: "dome", name: "Dôme", description: "Arrondi et élégant", icon: "dome" },
  { id: "empire", name: "Empire", description: "Évasé traditionnel", icon: "empire" },
  { id: "oval", name: "Ovale", description: "Doux et organique", icon: "oval" },
  { id: "square", name: "Carré", description: "Lignes nettes et géométriques", icon: "square" },
];

export const colors: LampshadeColor[] = [
  // Neutres
  { id: "blanc", name: "Blanc Crème", hex: "#FAF5EF", category: "Neutres" },
  { id: "ivoire", name: "Ivoire", hex: "#FFFFF0", category: "Neutres" },
  { id: "beige", name: "Beige Naturel", hex: "#D4C5A9", category: "Neutres" },
  { id: "lin", name: "Lin", hex: "#C8B99A", category: "Neutres" },
  { id: "gris-perle", name: "Gris Perle", hex: "#C4C4C4", category: "Neutres" },
  { id: "anthracite", name: "Anthracite", hex: "#3C3C3C", category: "Neutres" },
  { id: "noir", name: "Noir", hex: "#1A1A1A", category: "Neutres" },
  // Chauds
  { id: "terracotta", name: "Terracotta", hex: "#C4623A", category: "Chauds" },
  { id: "rouille", name: "Rouille", hex: "#A0522D", category: "Chauds" },
  { id: "ocre", name: "Ocre", hex: "#CC7722", category: "Chauds" },
  { id: "moutarde", name: "Moutarde", hex: "#D4A830", category: "Chauds" },
  { id: "saumon", name: "Saumon", hex: "#FA8072", category: "Chauds" },
  { id: "corail", name: "Corail", hex: "#FF7F50", category: "Chauds" },
  { id: "rouge-vin", name: "Rouge Vin", hex: "#722F37", category: "Chauds" },
  // Froids
  { id: "bleu-marine", name: "Bleu Marine", hex: "#1B3A5C", category: "Froids" },
  { id: "bleu-canard", name: "Bleu Canard", hex: "#006E6D", category: "Froids" },
  { id: "vert-sauge", name: "Vert Sauge", hex: "#9CAF88", category: "Froids" },
  { id: "vert-foret", name: "Vert Forêt", hex: "#1B4332", category: "Froids" },
  { id: "lavande", name: "Lavande", hex: "#B4A7D6", category: "Froids" },
  { id: "bleu-ciel", name: "Bleu Ciel", hex: "#87CEEB", category: "Froids" },
  // Pastels
  { id: "rose-poudre", name: "Rose Poudré", hex: "#E8C4C4", category: "Pastels" },
  { id: "menthe", name: "Menthe", hex: "#B5D8CC", category: "Pastels" },
  { id: "pêche", name: "Pêche", hex: "#FFDAB9", category: "Pastels" },
  { id: "lilas", name: "Lilas", hex: "#D8BFD8", category: "Pastels" },
];

export const materials: LampshadeMaterial[] = [
  { id: "coton", name: "Coton", description: "Tissu naturel, lumière douce et chaleureuse", priceModifier: 1 },
  { id: "lin", name: "Lin", description: "Texture organique, aspect artisanal", priceModifier: 1.3 },
  { id: "soie", name: "Soie", description: "Luxueux, lumière tamisée élégante", priceModifier: 1.8 },
  { id: "papier", name: "Papier japonais", description: "Léger, diffusion douce et uniforme", priceModifier: 1.2 },
  { id: "metal", name: "Métal perforé", description: "Industriel, jeux d'ombres décoratifs", priceModifier: 1.5 },
];

export const dimensions: Record<string, LampshadeDimension> = {
  diameterTop: { label: "Diamètre haut", min: 10, max: 60, default: 20, unit: "cm" },
  diameterBottom: { label: "Diamètre bas", min: 15, max: 80, default: 35, unit: "cm" },
  height: { label: "Hauteur", min: 10, max: 60, default: 25, unit: "cm" },
};
