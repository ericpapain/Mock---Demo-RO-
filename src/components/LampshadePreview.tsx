import { motion } from "framer-motion";

interface LampshadePreviewProps {
  shape: string;
  color: string;
  diameterTop: number;
  diameterBottom: number;
  height: number;
  material: string;
  baseType: string;
  baseColor: string;
}

const LampshadePreview = ({ shape, color, diameterTop, diameterBottom, height, baseType, baseColor }: LampshadePreviewProps) => {
  const scale = 2.5;
  const topW = diameterTop * scale;
  const botW = diameterBottom * scale;
  const h = height * scale;
  const cx = 200;
  const shadeTop = baseType === "none" ? 60 : 40;
  const shadeBottom = shadeTop + h;
  const baseStart = shadeBottom + 4;

  const getShapePath = () => {
    switch (shape) {
      case "cylinder":
        return `M ${cx - topW / 2} ${shadeTop} L ${cx - topW / 2} ${shadeBottom} L ${cx + topW / 2} ${shadeBottom} L ${cx + topW / 2} ${shadeTop} Z`;
      case "dome":
        return `M ${cx - botW / 2} ${shadeBottom} Q ${cx - topW / 2 - 20} ${shadeTop - 10} ${cx} ${shadeTop} Q ${cx + topW / 2 + 20} ${shadeTop - 10} ${cx + botW / 2} ${shadeBottom} Z`;
      case "empire":
        return `M ${cx - topW / 2} ${shadeTop} Q ${cx - botW / 2 - 15} ${shadeTop + h * 0.6} ${cx - botW / 2} ${shadeBottom} L ${cx + botW / 2} ${shadeBottom} Q ${cx + botW / 2 + 15} ${shadeTop + h * 0.6} ${cx + topW / 2} ${shadeTop} Z`;
      case "oval":
        return `M ${cx - topW / 2} ${shadeTop + h * 0.2} Q ${cx - botW / 2} ${shadeTop + h * 0.5} ${cx - botW / 2 * 0.9} ${shadeBottom} L ${cx + botW / 2 * 0.9} ${shadeBottom} Q ${cx + botW / 2} ${shadeTop + h * 0.5} ${cx + topW / 2} ${shadeTop + h * 0.2} Q ${cx} ${shadeTop - 10} ${cx - topW / 2} ${shadeTop + h * 0.2} Z`;
      case "square": {
        const inset = 5;
        return `M ${cx - topW / 2 + inset} ${shadeTop} L ${cx - botW / 2} ${shadeBottom} L ${cx + botW / 2} ${shadeBottom} L ${cx + topW / 2 - inset} ${shadeTop} Z`;
      }
      case "cone":
      default:
        return `M ${cx - topW / 2} ${shadeTop} L ${cx - botW / 2} ${shadeBottom} L ${cx + botW / 2} ${shadeBottom} L ${cx + topW / 2} ${shadeTop} Z`;
    }
  };

  const renderBase = () => {
    const bh = 120; // base height
    const floorY = baseStart + bh;

    switch (baseType) {
      case "classic":
        return (
          <g>
            {/* Neck */}
            <rect x={cx - 4} y={baseStart} width={8} height={12} fill={baseColor} rx={2} />
            {/* Main stem */}
            <rect x={cx - 5} y={baseStart + 12} width={10} height={bh - 30} fill={baseColor} rx={2} />
            {/* Base plate */}
            <ellipse cx={cx} cy={floorY} rx={30} ry={8} fill={baseColor} />
            <ellipse cx={cx} cy={floorY - 3} rx={28} ry={6} fill={baseColor} opacity={0.7} />
          </g>
        );
      case "curved":
        return (
          <g>
            <rect x={cx - 4} y={baseStart} width={8} height={10} fill={baseColor} rx={2} />
            <path
              d={`M ${cx} ${baseStart + 10} Q ${cx + 25} ${baseStart + bh * 0.4} ${cx} ${baseStart + bh * 0.7} Q ${cx - 15} ${baseStart + bh * 0.85} ${cx} ${floorY - 8}`}
              fill="none"
              stroke={baseColor}
              strokeWidth={8}
              strokeLinecap="round"
            />
            <ellipse cx={cx} cy={floorY} rx={28} ry={7} fill={baseColor} />
          </g>
        );
      case "tripod":
        return (
          <g>
            <rect x={cx - 4} y={baseStart} width={8} height={10} fill={baseColor} rx={2} />
            {/* Center connector */}
            <rect x={cx - 3} y={baseStart + 10} width={6} height={15} fill={baseColor} rx={1} />
            {/* Three legs */}
            <line x1={cx} y1={baseStart + 25} x2={cx - 35} y2={floorY} stroke={baseColor} strokeWidth={5} strokeLinecap="round" />
            <line x1={cx} y1={baseStart + 25} x2={cx + 35} y2={floorY} stroke={baseColor} strokeWidth={5} strokeLinecap="round" />
            <line x1={cx} y1={baseStart + 25} x2={cx} y2={floorY} stroke={baseColor} strokeWidth={5} strokeLinecap="round" />
            {/* Feet */}
            <circle cx={cx - 35} cy={floorY} r={3} fill={baseColor} />
            <circle cx={cx + 35} cy={floorY} r={3} fill={baseColor} />
            <circle cx={cx} cy={floorY} r={3} fill={baseColor} />
          </g>
        );
      case "vase":
        return (
          <g>
            <rect x={cx - 4} y={baseStart} width={8} height={8} fill={baseColor} rx={2} />
            <path
              d={`M ${cx - 10} ${baseStart + 8} Q ${cx - 22} ${baseStart + bh * 0.35} ${cx - 20} ${baseStart + bh * 0.6} Q ${cx - 18} ${baseStart + bh * 0.85} ${cx - 15} ${floorY - 5} L ${cx + 15} ${floorY - 5} Q ${cx + 18} ${baseStart + bh * 0.85} ${cx + 20} ${baseStart + bh * 0.6} Q ${cx + 22} ${baseStart + bh * 0.35} ${cx + 10} ${baseStart + 8} Z`}
              fill={baseColor}
            />
            <ellipse cx={cx} cy={floorY - 2} rx={18} ry={5} fill={baseColor} opacity={0.6} />
          </g>
        );
      case "slim":
        return (
          <g>
            <rect x={cx - 3} y={baseStart} width={6} height={8} fill={baseColor} rx={1.5} />
            <rect x={cx - 2} y={baseStart + 8} width={4} height={bh - 20} fill={baseColor} rx={2} />
            <ellipse cx={cx} cy={floorY} rx={18} ry={5} fill={baseColor} />
          </g>
        );
      default:
        return null;
    }
  };

  const svgHeight = baseType === "none" ? 280 : 340;

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <svg viewBox={`0 0 400 ${svgHeight}`} className="w-full max-w-md">
        <defs>
          <radialGradient id="ambientGlow" cx="50%" cy="60%" r="60%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lightGlow" cx="50%" cy="30%" r="45%">
            <stop offset="0%">
              <animate attributeName="stop-opacity" values="0.35;0.5;0.35" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="shadeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="40%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.65" />
          </linearGradient>
          <filter id="softShadow">
            <feDropShadow dx="0" dy="10" stdDeviation="8" floodOpacity="0.12" />
          </filter>
          <filter id="innerLight">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
            <feOffset dx="0" dy="2" result="offset" />
            <feComposite in="SourceGraphic" in2="offset" operator="over" />
          </filter>
        </defs>

        {/* Background ambient glow */}
        <ellipse cx={cx} cy={shadeBottom + 30} rx={botW} ry={50} fill="url(#ambientGlow)">
          <animate attributeName="ry" values="50;55;50" dur="4s" repeatCount="indefinite" />
        </ellipse>

        {/* Light beam below shade */}
        <polygon
          points={`${cx - botW / 2 + 5},${shadeBottom} ${cx - botW * 0.8},${shadeBottom + 80} ${cx + botW * 0.8},${shadeBottom + 80} ${cx + botW / 2 - 5},${shadeBottom}`}
          fill={color}
          opacity="0.08"
        >
          <animate attributeName="opacity" values="0.06;0.12;0.06" dur="3s" repeatCount="indefinite" />
        </polygon>

        {/* Cord / Ceiling mount for suspension */}
        {baseType === "none" && (
          <g>
            <line x1={cx} y1={0} x2={cx} y2={shadeTop} stroke="hsl(25, 20%, 30%)" strokeWidth="2" />
            <circle cx={cx} cy={4} r={4} fill="hsl(25, 20%, 30%)" />
          </g>
        )}

        {/* Lampshade */}
        <motion.path
          d={getShapePath()}
          fill="url(#shadeGrad)"
          stroke="hsl(25, 15%, 40%)"
          strokeWidth="1"
          filter="url(#softShadow)"
          key={`${shape}-${diameterTop}-${diameterBottom}-${height}-${baseType}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
        />

        {/* Inner glow on shade */}
        <motion.path
          d={getShapePath()}
          fill={color}
          opacity="0.15"
          key={`inner-${shape}`}
        >
          <animate attributeName="opacity" values="0.1;0.2;0.1" dur="3s" repeatCount="indefinite" />
        </motion.path>

        {/* Top ring / fitting */}
        <ellipse cx={cx} cy={shadeTop} rx={topW / 2} ry={4} fill="hsl(25, 15%, 35%)" stroke="hsl(25, 15%, 30%)" strokeWidth="1" />
        {/* Light bulb hint */}
        <ellipse cx={cx} cy={shadeTop + 10} rx={5} ry={7} fill="#FFF8E1" opacity="0.6">
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2.5s" repeatCount="indefinite" />
        </ellipse>

        {/* Lamp base */}
        {baseType !== "none" && renderBase()}

        {/* Floor shadow */}
        {baseType !== "none" && (
          <ellipse cx={cx} cy={baseStart + 125} rx={45} ry={6} fill="hsl(25, 10%, 20%)" opacity="0.08" />
        )}
      </svg>
    </motion.div>
  );
};

export default LampshadePreview;
