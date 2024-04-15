/* eslint-disable no-undef */
/// <reference path="../extism-host.d.ts" />

import React from "react";
import { render as renderTemplateComponent } from "@react-email/render";
import { object, string, record, any } from "zod";

const RenderInput = object({
  props: record(string(), any()),
  templateCode: string(),
  env: record(string(), any())
});

/**
 * @param templatePath {string}
 */
export function render() {
  const jsonInput = JSON.parse(Host.inputString());

  const input = RenderInput.parse(jsonInput);

  global.process = {
    env: input.env
  };

  let previousExports = { ...module.exports };
  eval(input.templateCode);
  const templateExports = { ...module.exports };
  module.exports = previousExports;

  Host.outputString(
    renderTemplateComponent(React.createElement(templateExports.default, input.props))
  );
}

