import { cn } from "@/lib/utils";

function formatPercent(value: number) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return `${clamped}%`;
}

export function ScoreGauge({
  percent,
  className,
  svgClassName,
}: {
  percent: number;
  className?: string;
  svgClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const centerX = 80;
  const centerY = 72;
  const innerRadius = 42;
  const outerRadius = 52;
  const tickCount = 45;
  const textY = Math.round(centerY - innerRadius * 0.35);

  const paletteLeft = { r: 242, g: 201, b: 76 };
  const paletteMid = { r: 193, g: 199, b: 205 };
  const paletteRight = { r: 52, g: 199, b: 89 };

  function lerp(a: number, b: number, t: number) {
    return Math.round(a + (b - a) * t);
  }

  function lerpColor(from: typeof paletteLeft, to: typeof paletteLeft, t: number): string {
    return `rgb(${lerp(from.r, to.r, t)}, ${lerp(from.g, to.g, t)}, ${lerp(from.b, to.b, t)})`;
  }

  const ticks = Array.from({ length: tickCount }, (_, index) => {
    const ratio = index / (tickCount - 1);
    const angle = (180 + 180 * ratio) * (Math.PI / 180);
    const x1 = centerX + innerRadius * Math.cos(angle);
    const y1 = centerY + innerRadius * Math.sin(angle);
    const x2 = centerX + outerRadius * Math.cos(angle);
    const y2 = centerY + outerRadius * Math.sin(angle);
    const stroke =
      ratio <= 0.5
        ? lerpColor(paletteLeft, paletteMid, ratio * 2)
        : lerpColor(paletteMid, paletteRight, (ratio - 0.5) * 2);

    return { key: index, x1, y1, x2, y2, stroke };
  });

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg viewBox="26 18 108 60" className={cn("h-[80px] w-[152px]", svgClassName)}>
        {ticks.map((tick) => (
          <line
            key={tick.key}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.stroke}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        ))}
        <text
          x={centerX}
          y={textY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-text-black)"
          fontSize={22}
          fontWeight={700}
          fontFamily="var(--font-urbanist), sans-serif"
        >
          {formatPercent(clamped)}
        </text>
      </svg>
    </div>
  );
}
