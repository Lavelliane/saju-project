/**
 * Reusable SVG shapes for sky atmosphere (stars, clouds).
 * Stars use a 4-point path; clouds use layered ellipses in cumulus formation.
 */

/** 4-point star path (normalized, scale via transform). Outer r=1, inner r≈0.15 for sharp points */
const STAR_PATH = "M 0,-1 L 0.106,-0.106 1,0 0.106,0.106 0,1 -0.106,0.106 -1,0 -0.106,-0.106 Z";

export interface StarProps {
  cx: number;
  cy: number;
  r?: number;
  opacity?: number;
  fill?: string;
}

export function SvgStar({ cx, cy, r = 1, opacity = 0.9, fill = "white" }: StarProps) {
  return (
    <path
      d={STAR_PATH}
      fill={fill}
      opacity={opacity}
      transform={`translate(${cx} ${cy}) scale(${r})`}
    />
  );
}

/** Cumulus cloud: overlapping ellipses for a puffy cloud shape */
export interface CloudProps {
  cx: number;
  cy: number;
  scale?: number;
  opacity?: number;
  fill?: string;
}

/** Cloud puffs as [dx, dy, rx, ry] relative to center */
const CLOUD_PUFFS: [number, number, number, number][] = [
  [0, 0.15, 0.45, 0.18], // base center
  [-0.32, 0, 0.28, 0.14], // left
  [0.32, 0, 0.28, 0.14], // right
  [-0.18, -0.12, 0.2, 0.1], // top left
  [0.18, -0.12, 0.2, 0.1], // top right
  [0, -0.2, 0.16, 0.08], // top center
];

export function SvgCloud({ cx, cy, scale = 1, opacity = 0.35, fill = "white" }: CloudProps) {
  return (
    <g opacity={opacity}>
      {CLOUD_PUFFS.map(([dx, dy, rx, ry], i) => (
        <ellipse
          key={i}
          cx={cx + dx * scale}
          cy={cy + dy * scale}
          rx={rx * scale}
          ry={ry * scale}
          fill={fill}
        />
      ))}
    </g>
  );
}
