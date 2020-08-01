import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import ttypescript from 'ttypescript';

const pkg = require('./package.json');

const bundlePackages = ['@anche/shared'];

const external = Object.keys(pkg.dependencies || {}).filter(dep => !bundlePackages.includes(dep));

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            exports: 'named',
        },
        {
            file: pkg.module,
            format: 'esm',
        },
    ],
    external: [...external, 'typescript/lib/tsserverlibrary', 'util'],
    plugins: [
        resolve({
            preferBuiltins: true,
            browser: false,
        }),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.build.json',
            typescript: ttypescript,
            include: ['./**/*.ts+(|x)', '../shared/**/*.ts+(|x)'],
        }),
    ],
};
