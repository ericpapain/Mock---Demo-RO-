import { motion } from "framer-motion";

interface LampshadePreviewProps {
  shape: string;
  color: string;
  diameterTop: number;
  diameterBottom: number;
  height: number;
  material: string;
}

const LampshadePreview = ({ shape, color, diameterTop, diameterBottom, height }: LampshadePreviewProps) => {
  const scale = 3;
  const topW = diameterTop * scale;
  const botW = diameterBottom * scale;
  const h = height * scale;
  const cx = 200;
  const top = 40;

  const getShapePath = () => {
    switch (shape) {
      case "cylinder":
        return `M ${cx - topW / 2} ${top} L ${cx - topW / 2} ${top + h} L ${cx + topW / 2} ${top + h} L ${cx + topW / 2} ${top} Z`;
      case "dome":
        return `M ${cx - botW / 2} ${top + h} Q ${cx - topW / 2 - 20} ${top - 10} ${cx} ${top} Q ${cx + topW / 2 + 20} ${top - 10} ${cx + botW / 2} ${top + h} Z`;
      case "empire":
        return `M ${cx - topW / 2} ${top} Q ${cx - botW / 2 - 15} ${top + h * 0.6} ${cx - botW / 2} ${top + h} L ${cx + botW / 2} ${top + h} Q ${cx + botW / 2 + 15} ${top + h * 0.6} ${cx + topW / 2} ${top} Z`;
      case "oval":
        return `M ${cx - topW / 2} ${top + h * 0.2} Q ${cx - botW / 2} ${top + h * 0.5} ${cx - botW / 2 * 0.9} ${top + h} L ${cx + botW / 2 * 0.9} ${top + h} Q ${cx + botW / 2} ${top + h * 0.5} ${cx + topW / 2} ${top + h * 0.2} Q ${cx} ${top - 10} ${cx - topW / 2} ${top + h * 0.2} Z`;
      case "square": {
        const inset = 5;
        return `M ${cx - topW / 2 + inset} ${top} L ${cx - botW / 2} ${top + h} L ${cx + botW / 2} ${top + h} L ${cx + topW / 2 - inset} ${top} Z`;
      }
      case "cone":
      default:
        return `M ${cx - topW / 2} ${top} L ${cx - botW / 2} ${top + h} L ${cx + botW / 2} ${top + h} L ${cx + topW / 2} ${top} Z`;
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <svg viewBox="0 0 400 300" className="w-full max-w-md drop-shadow-2xl">
        {/* Light glow */}
        <defs>
          <radialGradient id="glow" cx="50%" cy="80%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="shadeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="50%" stopColor={color} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Ambient glow */}
        <ellipse cx={cx} cy={top + h + 40} rx={botW * 0.8} ry={30} fill="url(#glow)" />

        {/* Cord */}
        <line x1={cx} y1={0} x2={cx} y2={top} stroke="hsl(25, 20%, 30%)" strokeWidth="2" />

        {/* Lampshade */}
        <motion.path
          d={getShapePath()}
          fill="url(#shadeGrad)"
          stroke="hsl(25, 20%, 30%)"
          strokeWidth="1.5"
          filter="url(#shadow)"
          key={`${shape}-${diameterTop}-${diameterBottom}-${height}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Top ring */}
        <ellipse cx={cx} cy={top} rx={topW / 2} ry={4} fill="none" stroke="hsl(25, 20%, 30%)" strokeWidth="1.5" />
        
        {/* Dimensions text */}
        <text x={cx} y={top + h + 60} textAnchor="middle" className="fill-muted-foreground text-xs font-body">
          {diameterTop}cm × {diameterBottom}cm × {height}cm
        </text>
      </svg>
    </motion.div>
  );
};

export default LampshadePreview;
