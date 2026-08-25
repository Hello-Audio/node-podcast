import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.js'],
  outfile: 'dist/index.js',
  bundle: true,
  packages: 'external',
  platform: 'node',
  target: 'node22',
  format: 'cjs',
});
