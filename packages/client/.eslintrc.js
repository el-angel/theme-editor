const getFolderRegex = (folder) => {
  return [`^(~\/${folder})(.*|$)`];
};

module.exports = {
  extends: ['../../.eslintrc.js', 'prettier/react', 'plugin:react/recommended'],
  plugins: ['react-hooks', 'simple-import-sort'],
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: 'useRecoilCallback',
      },
    ],
    'simple-import-sort/sort': [
      'error',
      {
        groups: [
          // Node.js builtins. You could also generate this regex if you use a `.js` config.
          // For example: `^(${require("module").builtinModules.join("|")})(/|$)`
          [
            '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
          ],
          // Packages. `react` related packages come first.
          ['^react', '^@?\\w'],
          // Internal packages.
          getFolderRegex('external'),
          getFolderRegex('grammar'),
          getFolderRegex('state'),
          getFolderRegex('containers'),
          getFolderRegex('components'),
          getFolderRegex('services'),
          getFolderRegex('hooks'),
          getFolderRegex('constants'),
          getFolderRegex('helpers'),
          getFolderRegex('model'),
          getFolderRegex('types'),
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.s?css$'],
        ],
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
