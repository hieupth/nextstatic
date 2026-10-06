// Registers module-resolution stubs for next/* so the lib's client
// components can be server-rendered in plain node (deterministic render
// oracle). Mirrors what Next itself would add MINUS the parts the lib owns:
// the stub for next/link emits the href exactly as the lib computed it.
import { register } from "node:module";
import React from "react";
globalThis.React = React;

register(new URL("./stubs-loader.mjs", import.meta.url));
export const ready = true;
