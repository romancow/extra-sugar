import pkg from './package.json'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default {
	input: pkg.module,
	external: ['sugar'],
	output: {
		file: 'umd/extra-sugar.js',
		name: 'ExtraSugar',
		format: 'umd',
		globals: {
			'sugar': 'Sugar'
		},
		sourcemap: true,
		sourcemapExcludeSources: true
	},
	plugins: [ resolve(), terser() ]
}
