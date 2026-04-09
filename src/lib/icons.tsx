/* eslint-disable react/display-name */
/**
 * Minimal inline SVG icons — drop-in replacement for lucide-react subset.
 * All icons: size prop (default 16), className passthrough.
 */

import React from "react"
import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const base = (d: string | React.ReactNode, extra?: Partial<IconProps>) =>
  ({ size = 16, className, ...rest }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...extra}
      {...rest}
    >
      {typeof d === "string" ? <path d={d} /> : d}
    </svg>
  )

export const ArrowLeft = base("M19 12H5M12 19l-7-7 7-7")

export const Globe = base(
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </>
)

export const ZoomIn = base(
  <>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </>
)

export const X = base("M18 6 6 18M6 6l12 12")

export const ChevronLeft = base("M15 18l-6-6 6-6")

export const ChevronRight = base("M9 18l6-6-6-6")

export const ChevronDown = base("M6 9l6 6 6-6")

export const ChevronUp = base("M18 15l-6-6-6 6")

export const Clock = base(
  <>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </>
)

export const Zap = base("M13 2L3 14h9l-1 8 10-12h-9l1-8z")

export const Lock = base(
  <>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </>
)

export const CheckCircle2 = base(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </>
)

export const Loader2 = base("M21 12a9 9 0 1 1-6.219-8.56")

export const ExternalLink = base(
  <>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </>
)

export const Crown = base(
  <>
    <path d="M2 20h20" />
    <path d="M5 20V10l7-7 7 7v10" />
    <path d="M12 3v4" />
    <path d="M5 10l7 3 7-3" />
  </>
)

export const Trash2 = base(
  <>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </>
)
