import { Slider } from "@/components/ui/slider";

interface DimensionSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}

const DimensionSlider = ({ label, value, min, max, unit, onChange }: DimensionSliderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-body font-medium text-foreground">{label}</label>
        <span className="text-sm font-semibold text-primary">
          {value} {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={([v]) => onChange(v)}
        className="w-full"
      />
    </div>
  );
};

export default DimensionSlider;
