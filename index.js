import { hexToHSL, hexToRGB } from "@barelyhuman/tocolor";

export const colors = {
	light: {
		background: "#F8F8F8",
		subtle: "#F1F1F1",
		element: "#E7E7E7",
		border: "#C4C4C4",
		muted: "#5A5A5A",
		text: "#202020",

		// accent
		accent: "#E4D86C",
		accentHover: "#D9CD62",
		accentBorder: "#C1BA78",
		accentElement: "#F0EDC9",
		textOnAccent: "#25220A",

		// variants
		success: "#AECE6C",
		successHover: "#A4C362",
		successBorder: "#A6BC7E",
		successElement: "#E4EDD6",
		textOnSuccess: "#1D250E",

		error: "#D0484D",
		errorHover: "#C13940",
		errorBorder: "#EA9F9B",
		errorElement: "#F6E3E1",
		textOnError: "#FFFFFF",

		warning: "#D18D56",
		warningHover: "#C5824A",
		warningBorder: "#E2A87B",
		warningElement: "#F7E4D6",
		textOnWarning: "#FFFFFF",

		info: "#348BCE",
		infoHover: "#247EC0",
		infoBorder: "#88BCEB",
		infoElement: "#DFEBF6",
		textOnInfo: "#FFFFFF",
	},
	dark: {
		// base colors
		background: "#1B1C1C",
		subtle: "#222323",
		element: "#2B2B2B",
		border: "#4B4D4D",
		muted: "#B2B4B4",
		text: "#EDEEEE",

		// accent
		accent: "#C8C17F",
		accentHover: "#BDB675",
		accentBorder: "#59552F",
		accentElement: "#2D2C22",
		textOnAccent: "#25220A",

		// variants
		success: "#B2C88A",
		successHover: "#A8BD80",
		successBorder: "#525D3D",
		successElement: "#2A2D24",
		textOnSuccess: "#1E250E",

		error: "#EE908D",
		errorHover: "#E28583",
		errorBorder: "#804241",
		errorElement: "#3C1F1E",
		textOnError: "#102334",

		warning: "#D18D56",
		warningHover: "#C4824A",
		warningBorder: "#6C4D34",
		warningElement: "#332921",
		textOnWarning: "#FFFFFF",

		info: "#8FC4F3",
		infoHover: "#85B9E8",
		infoBorder: "#33658F",
		infoElement: "#172F43",
		textOnInfo: "#102334",
	},
};

/**
 * @type {Record<keyof typeof colors, import("@barelyhuman/tocolor").HSL>}
 */
export const colorsHSL = Object.fromEntries(
	Object.entries(colors).map(([k, v]) => {
		return [k, hexToHSL(v)];
	}),
);

/**
 * @type {Record<keyof typeof colors, import("@barelyhuman/tocolor").RGB>}
 */
export const colorsRGB = Object.fromEntries(
	Object.entries(colors).map(([k, v]) => {
		return [k, hexToRGB(v)];
	}),
);
