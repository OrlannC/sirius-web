import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { mergeConfig } from "vite"
import path from "path"

/**
 * 1. RECRÉATION DE __dirname
 * Indispensable pour que path.resolve fonctionne en ESM
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
  ],
  "framework": {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {}
  }, // <--- J'ai bien vérifié la virgule ici

  typescript: {
    reactDocgen: 'react-docgen-typescript', 
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
      propFilter: (prop) => {
        return prop.parent ? !/node_modules/.test(prop.parent.fileName) : true;
      },
    },
  },

  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@renderer': path.resolve(__dirname, '../packages/diagrams/frontend/sirius-components-diagrams/src/renderer'),
        },
      },
    });
  },
};

export default config;