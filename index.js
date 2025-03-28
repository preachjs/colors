import { hexToHSL, hexToRGB } from "@barelyhuman/tocolor";

export const colors = {
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
