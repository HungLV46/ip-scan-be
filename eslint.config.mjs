import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { ignores: ['prisma/*', 'dist/*', 'node_module/*'] },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
