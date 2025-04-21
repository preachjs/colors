import { copyFileSync, mkdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { kebabCase as paramCase } from "change-case";
import { minify } from "csso";
import prettier from "prettier";
import { colors as themedColors } from "./index.js"; // Assuming export const themedColors = { light: {}, dark: {} };

const TARGET_DIR = "css";
const DOCS_DIR = "docs";
const STYLE_VARIABLE_PREFIX = "preach-";

// --- Helper Functions ---

/**
 * Converts a kebab-case path string to a base CSS variable name part.
 * Example: 'primary-contrast' -> 'preach-primary-contrast'
 */
const pathToBaseVarName = (path) => {
	// Ensure prefix is only added once if already present
	return path.startsWith(STYLE_VARIABLE_PREFIX)
		? path
		: `${STYLE_VARIABLE_PREFIX}${path}`;
};

/**
 * Creates a CSS variable declaration string.
 * Example: ('--preach-text', '#111111') -> '--preach-text: #111111;'
 */
const varToStyleString = (variable, value) => {
	return `${variable}: ${value};`;
};

/**
 * Recursively extracts color values and their corresponding paths. (Same as before)
 */
const colorExtractor = (source, currentPath = "") => {
	// ... (Keep the robust colorExtractor function from the previous "better approach" example) ...
	let colorMap = [];
	if (typeof source !== "object" || source === null) return [];
	for (const key in source) {
		const value = source[key];
		const isDefaultKey = key.toUpperCase() === "DEFAULT";
		const keySegment = isDefaultKey ? "" : paramCase(key);
		let newPath = currentPath;
		if (keySegment) {
			newPath = currentPath ? `${currentPath}-${keySegment}` : keySegment;
		}
		if (typeof value === "string") {
			if (newPath) colorMap.push({ path: newPath, color: value });
		} else if (typeof value === "object" && value !== null) {
			colorMap = colorMap.concat(colorExtractor(value, newPath));
		}
	}
	return colorMap;
};

/**
 * Generates theme-specific CSS variable declaration strings.
 * @param {Array<{path: string, color: string}>} colorData - Extracted color data.
 * @param {'light' | 'dark'} themeName - The name of the theme.
 * @returns {string[]} - Array of CSS strings like '--preach-light-color: #value;'
 */
const generateThemeSpecificCssStrings = (colorData, themeName) => {
	return colorData.map((variant) => {
		const baseVarName = pathToBaseVarName(variant.path);
		// Add the theme name prefix, e.g., --preach-light-primary
		const cssVarName = `--${baseVarName.replace(STYLE_VARIABLE_PREFIX, `${STYLE_VARIABLE_PREFIX}${themeName}-`)}`;
		return varToStyleString(cssVarName, variant.color);
	});
};

/**
 * Generates adaptive CSS variable declarations pointing to theme-specific ones.
 * @param {Array<{path: string, color: string}>} colorData - Extracted color data (used for paths).
 * @param {'light' | 'dark'} targetTheme - The theme these variables should point to.
 * @returns {string[]} - Array of CSS strings like '--preach-color: var(--preach-light-color);'
 */
const generateAdaptiveCssStrings = (colorData, targetTheme) => {
	return colorData.map((variant) => {
		const baseVarName = pathToBaseVarName(variant.path);
		const adaptiveVarName = `--${baseVarName}`; // e.g., --preach-primary
		const specificVarName = `--${baseVarName.replace(STYLE_VARIABLE_PREFIX, `${STYLE_VARIABLE_PREFIX}${targetTheme}-`)}`; // e.g., --preach-light-primary
		return varToStyleString(adaptiveVarName, `var(${specificVarName})`);
	});
};

// --- Main Generation Logic ---

async function main() {
	// 1. Validate Input (Same as before)
	if (
		!themedColors ||
		typeof themedColors.light !== "object" ||
		typeof themedColors.dark !== "object" ||
		themedColors.light === null ||
		themedColors.dark === null
	) {
		console.error(/* ... error message ... */);
		process.exit(1);
	}

	try {
		// 2. Extract Colors for Both Themes
		const lightColorData = colorExtractor(themedColors.light);
		const darkColorData = colorExtractor(themedColors.dark);

		// Ensure consistent paths between themes for adaptive variables
		// We'll use the light theme paths as the canonical set for adaptive vars
		const allPaths = [...new Set(lightColorData.map((d) => d.path))].map(
			(path) => ({ path }),
		); // Create objects {path: string}

		// 3. Generate CSS Variable Strings
		const lightSpecificVarStrings = generateThemeSpecificCssStrings(
			lightColorData,
			"light",
		);
		const darkSpecificVarStrings = generateThemeSpecificCssStrings(
			darkColorData,
			"dark",
		);

		// Adaptive variables default to light
		const adaptiveDefaultVarStrings = generateAdaptiveCssStrings(
			allPaths, // Use all unique paths found
			"light",
		);
		// Adaptive variables override to dark in media query
		const adaptiveDarkVarStrings = generateAdaptiveCssStrings(
			allPaths, // Use all unique paths found
			"dark",
		);

		// 4. Construct the Final CSS Output String
		const combinedStyleSheet = `
:root {
    /* -- Theme-Specific Variables -- */

    /* Light Theme */
    ${lightSpecificVarStrings.join("\n    ")}

    /* Dark Theme */
    ${darkSpecificVarStrings.join("\n    ")}

    /* -- Adaptive Variables (Default to Light) -- */
    ${adaptiveDefaultVarStrings.join("\n    ")}
}

@media (prefers-color-scheme: dark) {
    :root {
        /* -- Adaptive Variables (Override to Dark) -- */
        ${adaptiveDarkVarStrings.join("\n        ")}
    }
}
`;

		// 5. Format, Minify, and Write Files (Same as before)
		const formattedStyles = await prettier.format(combinedStyleSheet, {
			parser: "css",
			printWidth: 80,
		});
		const minifiedStyles = minify(formattedStyles).css;

		mkdirSync(TARGET_DIR, { recursive: true });
		mkdirSync(DOCS_DIR, { recursive: true });

		const cssPath = join(TARGET_DIR, "preach.css");
		const minCssPath = join(TARGET_DIR, "preach.min.css");
		const docsCssPath = join(DOCS_DIR, "preach.css");
		const docsJsPath = join(DOCS_DIR, "preach.js");

		writeFileSync(cssPath, formattedStyles);
		writeFileSync(minCssPath, minifiedStyles);
		writeFileSync(docsCssPath, formattedStyles);
		copyFileSync(resolve("./index.js"), resolve(docsJsPath));

		console.log(/* ... success message ... */);
	} catch (error) {
		console.error("Error during color generation process:", error);
		process.exit(1);
	}
}

main();
