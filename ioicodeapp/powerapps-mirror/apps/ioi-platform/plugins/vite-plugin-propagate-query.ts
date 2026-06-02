import type { Plugin } from "vite";

export function propagateQueryPlugin(): Plugin {
  return {
    name: "propagate-query",
  };
}
