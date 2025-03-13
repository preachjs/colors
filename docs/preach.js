import { hexToHSL, hexToRGB } from "@barelyhuman/tocolor";

export const colors = {
  // base colors
  base: "#F9F9FB",
  surface: "#EDEEF2",
  overlay: "#E1E3EA",
  muted: "#8890AA",
  subtle: "#555D77",
  text: "#2A2E3C",
  accent: "#D1E16A",
  textOnAccent: "#254E34",

  // variants
  success: "#233805",
  successLight: "#D8F5A2",

  error: "#761919",
  errorLight: "#FFC9C9",

  warning: "#7A3F00",
  warningLight: "#FFEC99",

  info: "#213078",
  infoLight: "#BAC8FF",

  neutral: "#505963",
  neutralLight: "#E9ECEF",
};

/**
 * @type {Record<keyof typeof colors, import("@barelyhuman/tocolor").HSL>}
 */
export const colorsHSL = Object.fromEntries(
  Object.entries(colors).map(([k, v]) => {
    return [k, hexToHSL(v)];
  })
);

/**
 * @type {Record<keyof typeof colors, import("@barelyhuman/tocolor").RGB>}
 */
export const colorsRGB = Object.fromEntries(
  Object.entries(colors).map(([k, v]) => {
    return [k, hexToRGB(v)];
  })
);
