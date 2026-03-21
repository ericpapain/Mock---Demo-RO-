import React from "react";
import { Slider } from "@/components/ui/slider";

interface DimensionSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}

const DimensionSlider = React.forwardRef<HTMLDivElement, DimensionSliderProps>(
  ({ label, value, min, max, unit, onChange }, ref) => {
    return (
      <div ref={ref} className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-body font-medium text-foreground">{label}</label>
          <span className="text-sm font-semibold text-primary tabular-nums">
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
  }
);

DimensionSlider.displayName = "DimensionSlider";

export default DimensionSlider;
