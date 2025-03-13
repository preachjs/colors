import { minify } from "csso";
import { copyFileSync, mkdirSync, writeFileSync } from "fs";
import { kebabCase as paramCase } from "change-case";
import { join, resolve } from "path";
import prettier from "prettier";
import { colors } from "./index.js";

const TEMPLATE_KEY = "{{template}}";
const TARGET_DIR = "css";
const DOCS_DIR = "docs";
const STYLE_VARIABLE_PREFIX = "preach-";
const styleSheetTemplate = `
    :root{
        ${TEMPLATE_KEY}
    }
`;

let styleSheet = ``;

const pathToCSSVariable = (path) => {
  return `--${path}`;
};

const varToStyleString = (variable, value) => {
  return `${variable}:${value};`;
};

const appendToStylesheet = (cssString) => {
  if (!styleSheet) {
    styleSheet = styleSheetTemplate;
  }
  return styleSheet.replace(
    new RegExp(TEMPLATE_KEY),
    `${cssString}\n{{template}}`
  );
};

const purgeTemplate = (template) => {
  return template.replace(new RegExp(TEMPLATE_KEY), "");
};

const colorExtractor = (source, visitedPath = "") => {
  if (typeof source === "string") {
    return { color: source, path: visitedPath };
  }

  let colorMap = [];

  Object.keys(source).forEach((key) => {
    let pathKey = paramCase(visitedPath);
    if (key !== "hex") {
      pathKey += "-" + paramCase(key);
    }
    const val = colorExtractor(source[key], pathKey);
    colorMap = colorMap.concat(val);
  });

  return colorMap;
};

async function main() {
  const _colors = colorExtractor(colors);
  _colors.forEach((variant) => {
    const colorPath = `${STYLE_VARIABLE_PREFIX}${variant.path}`;
    const cssVarName = pathToCSSVariable(colorPath);
    const cssVarString = varToStyleString(cssVarName, variant.color);
    styleSheet = appendToStylesheet(cssVarString);
  });

  styleSheet = purgeTemplate(styleSheet);
  const cleanedStyles = await prettier.format(styleSheet, { parser: "css" });
  mkdirSync(TARGET_DIR, { recursive: true });
  writeFileSync(join(TARGET_DIR, "preach.css"), cleanedStyles);
  writeFileSync(join(DOCS_DIR, "preach.css"), cleanedStyles);
  writeFileSync(join(TARGET_DIR, "preach.min.css"), minify(cleanedStyles).css);
  copyFileSync(resolve("./index.js"), resolve(DOCS_DIR, "preach.js"));
  console.log(">> Generated Preach Colors\n");
}

main();
