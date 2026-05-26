import type { LanguageRegistration } from 'shiki/core';
import bash from 'shiki/langs/bash.mjs';
import c from 'shiki/langs/c.mjs';
import cpp from 'shiki/langs/cpp.mjs';
import csharp from 'shiki/langs/csharp.mjs';
import css from 'shiki/langs/css.mjs';
import dockerfile from 'shiki/langs/dockerfile.mjs';
import go from 'shiki/langs/go.mjs';
import graphql from 'shiki/langs/graphql.mjs';
import html from 'shiki/langs/html.mjs';
import java from 'shiki/langs/java.mjs';
import javascript from 'shiki/langs/javascript.mjs';
import json from 'shiki/langs/json.mjs';
import json5 from 'shiki/langs/json5.mjs';
import jsx from 'shiki/langs/jsx.mjs';
import less from 'shiki/langs/less.mjs';
import markdown from 'shiki/langs/markdown.mjs';
import php from 'shiki/langs/php.mjs';
import python from 'shiki/langs/python.mjs';
import ruby from 'shiki/langs/ruby.mjs';
import rust from 'shiki/langs/rust.mjs';
import sass from 'shiki/langs/sass.mjs';
import scss from 'shiki/langs/scss.mjs';
import shellscript from 'shiki/langs/shellscript.mjs';
import sql from 'shiki/langs/sql.mjs';
import tsx from 'shiki/langs/tsx.mjs';
import typescript from 'shiki/langs/typescript.mjs';
import xml from 'shiki/langs/xml.mjs';
import yaml from 'shiki/langs/yaml.mjs';

type Lang = LanguageRegistration | LanguageRegistration[];

const BUILTIN: Record<string, Lang> = {
  bash,
  c,
  cpp,
  csharp,
  cs: csharp,
  css,
  docker: dockerfile,
  dockerfile,
  go,
  graphql,
  html,
  markup: html,
  xml,
  svg: xml,
  java,
  javascript,
  js: javascript,
  json,
  json5,
  jsx,
  less,
  markdown,
  md: markdown,
  php,
  python,
  py: python,
  ruby,
  rb: ruby,
  rust,
  sass,
  scss,
  sh: shellscript,
  shell: shellscript,
  shellscript,
  sql,
  tsx,
  typescript,
  ts: typescript,
  yaml,
  yml: yaml,
};

const USER: Record<string, Lang> = {};

/**
 * Resolves a string language name to a shiki language module. Falls back
 * to the built-in set if the user hasn't registered a module under that
 * name. Returns `undefined` if nothing matches.
 */
export function resolveLanguageString(name: string): Lang | undefined {
  return USER[name] ?? BUILTIN[name];
}

/**
 * Registers a shiki language module under a string name so it can be
 * referenced by `<CodeBlock language="<name>">`. Useful for languages
 * outside the small built-in set this package ships.
 */
export function registerLanguage(name: string, module: Lang): void {
  USER[name] = module;
}

/**
 * Whether a language name resolves to a known module (built-in or
 * registered via {@link registerLanguage}).
 */
export function isLanguageRegistered(name: string): boolean {
  return name in USER || name in BUILTIN;
}
