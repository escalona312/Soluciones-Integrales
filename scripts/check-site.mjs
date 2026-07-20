import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const HTML_FILES = ["index.html", "trabajos.html"];
const EXTERNAL_PROTOCOL = /^(?:https?:|mailto:|tel:)/i;

function collectMatches(source, expression, group = 1) {
  let values = [];
  let match = expression.exec(source);
  while (match) {
    values.push(match[group]);
    match = expression.exec(source);
  }
  return values;
}

function inspectHtml(fileName) {
  let absolutePath = resolve(ROOT, fileName);
  let source = readFileSync(absolutePath, "utf8");
  let errors = [];
  let ids = collectMatches(source, /\bid=["']([^"']+)["']/gi);
  let idSet = new Set();

  for (let id of ids) {
    if (idSet.has(id)) errors.push(`${fileName}: id duplicado "${id}"`);
    idSet.add(id);
  }

  let references = collectMatches(source, /\b(?:src|href|poster)=["']([^"']+)["']/gi);
  for (let reference of references) {
    if (EXTERNAL_PROTOCOL.test(reference)) continue;

    if (reference.startsWith("#")) {
      let id = reference.slice(1);
      if (id && !idSet.has(id)) errors.push(`${fileName}: ancla inexistente "${reference}"`);
      continue;
    }

    let [filePart, fragment] = reference.split("#", 2);
    let cleanPath = decodeURIComponent(filePart.split("?", 1)[0]);
    let targetPath = resolve(dirname(absolutePath), cleanPath);

    if (!existsSync(targetPath)) {
      errors.push(`${fileName}: recurso inexistente "${reference}"`);
      continue;
    }

    if (fragment && cleanPath.endsWith(".html")) {
      let targetSource = readFileSync(targetPath, "utf8");
      let escapedFragment = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let targetExpression = new RegExp(`\\bid=["']${escapedFragment}["']`, "i");
      if (!targetExpression.test(targetSource)) errors.push(`${fileName}: ancla cruzada inexistente "${reference}"`);
    }
  }

  let images = source.match(/<img\b[^>]*>/gi) || [];
  for (let image of images) {
    if (!/\balt=["'][^"']*["']/i.test(image)) errors.push(`${fileName}: imagen sin atributo alt`);
    if (!/\bwidth=["']\d+["']/i.test(image) || !/\bheight=["']\d+["']/i.test(image)) {
      errors.push(`${fileName}: imagen sin dimensiones intrínsecas`);
    }
  }

  let blankLinks = source.match(/<a\b[^>]*target=["']_blank["'][^>]*>/gi) || [];
  for (let link of blankLinks) {
    if (!/\brel=["'][^"']*noopener[^"']*["']/i.test(link)) errors.push(`${fileName}: enlace _blank sin noopener`);
  }

  return errors;
}

function runChecks() {
  let errors = [];
  for (let fileName of HTML_FILES) errors.push(...inspectHtml(fileName));

  if (errors.length > 0) {
    for (let error of errors) console.error(`• ${error}`);
    console.error(`\nValidación fallida: ${errors.length} problema(s).`);
    process.exitCode = 1;
    return;
  }

  console.log(`Validación correcta: ${HTML_FILES.length} páginas, recursos y anclas revisados.`);
}

runChecks();
