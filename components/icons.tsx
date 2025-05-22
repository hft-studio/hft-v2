import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

export const Icons = {
  logo: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="HFT Logo"
      role="img"
      {...props}
    >
      <title>HFT Logo</title>
      {/* Simple HFT logo - customize as needed */}
      <path d="M3 3h18v18H3z" />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="10"
        fill="currentColor"
        stroke="none"
      >
        HFT
      </text>
    </svg>
  ),
}; 