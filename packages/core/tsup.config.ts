import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ["esm"],
  clean: true,
  treeshake: true,
  shims: true,
  outDir:"lib"
})