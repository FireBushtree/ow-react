import { getBaseRollupPlugins, getPackageJSON, resolvePkgPath } from './utils'
import generatePackageJson from 'rollup-plugin-generate-package-json'

const { name, module } = getPackageJSON('shared')
const pkgPath = resolvePkgPath(name)
const pkgDistPath = resolvePkgPath(name, true)

export default [
  // react
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${pkgDistPath}/index.js`,
      name: 'index.js',
      format: 'umd',
    },
    plugins: [
      ...getBaseRollupPlugins(),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          main: 'index.js',
        }),
      }),
    ],
  },
]
