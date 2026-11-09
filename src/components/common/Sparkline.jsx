import React, { useId, useMemo } from 'react';

/**
 * Tiny dependency-free SVG sparkline (area + line + end dot).
 * Uses `currentColor`, so color it with a Tailwind text-* class.
 */
export default function Sparkline({ data = [], className = '', height = 36, strokeWidth = 2 }) {
  const id = useId().replace(/:/g, '');
  const width = 100;

  const { line, area, last } = useMemo(() => {
    if (data.length < 2) return { line: '', area: '', last: null };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const pad = 4;
    const pts = data.map((v, i) => [
      (i / (data.length - 1)) * width,
      pad + (1 - (v - min) / span) * (height - pad * 2),
    ]);
    // Smooth curve through points (Catmull-Rom → cubic Bézier)
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
    }
    return { line: d, area: `${d} L ${width} ${height} L 0 ${height} Z`, last: pts[pts.length - 1] };
  }, [data, height]);

  if (!line) return null;

  return (
    <div className={`relative w-full ${className}`} style={{ height }} aria-hidden="true">
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full overflow-visible"
    >
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${id})`} />
      <path d={line} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
      {last && (
        <span
          className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-current ring-2 ring-white/80"
          style={{ left: `${last[0]}%`, top: last[1] }}
        />
      )}
    </div>
  );
}
